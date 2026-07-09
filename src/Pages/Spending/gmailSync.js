import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../db/firebase";
import {
  addExpense,
  getProcessedEmailIds,
  markEmailProcessed,
  updateSpendingSettings,
} from "./spendingService";

const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
const SEARCH_QUERY = "in:inbox newer_than:14d";
const MAX_MESSAGES = 25;
const BATCH_SIZE = 5;
const TOKEN_KEY = "gmailAccessToken";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = "google/gemma-3-12b-it";

// ── OAuth ────────────────────────────────────────────────────────────────
// Firebase doesn't refresh Google OAuth access tokens, so we grab one via a
// consent popup on demand and cache it for its ~1h lifetime.

function getCachedToken() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw);
    return Date.now() < expiresAt ? token : null;
  } catch {
    return null;
  }
}

function clearCachedToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function getAccessToken() {
  const cached = getCachedToken();
  if (cached) return cached;

  const provider = new GoogleAuthProvider();
  provider.addScope(GMAIL_SCOPE);
  const result = await signInWithPopup(auth, provider);
  const token = GoogleAuthProvider.credentialFromResult(result)?.accessToken;
  if (!token) throw new Error("Google did not return a Gmail access token.");

  sessionStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ token, expiresAt: Date.now() + 55 * 60 * 1000 })
  );
  return token;
}

// ── Gmail REST ───────────────────────────────────────────────────────────

async function gmailGet(token, path) {
  const res = await fetch(`${GMAIL_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) {
    clearCachedToken();
    throw new Error("Gmail access expired — click Sync again to re-authorize.");
  }
  if (!res.ok) throw new Error(`Gmail API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listRecentMessageIds(token) {
  const q = encodeURIComponent(SEARCH_QUERY);
  const data = await gmailGet(token, `/messages?q=${q}&maxResults=${MAX_MESSAGES}`);
  return (data.messages || []).map((m) => m.id);
}

function decodeBase64Url(data) {
  try {
    return decodeURIComponent(
      atob(data.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

function extractBody(payload) {
  if (!payload) return "";
  if (payload.body?.data && payload.mimeType?.startsWith("text/plain")) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    const plain = payload.parts.find((p) => p.mimeType === "text/plain" && p.body?.data);
    if (plain) return decodeBase64Url(plain.body.data);
    for (const part of payload.parts) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }
  if (payload.body?.data && payload.mimeType === "text/html") {
    return decodeBase64Url(payload.body.data).replace(/<[^>]+>/g, " ");
  }
  return "";
}

async function fetchEmail(token, id) {
  const msg = await gmailGet(token, `/messages/${id}?format=full`);
  const headers = Object.fromEntries(
    (msg.payload?.headers || []).map((h) => [h.name.toLowerCase(), h.value])
  );
  return {
    id,
    subject: headers.subject || "(no subject)",
    from: headers.from || "",
    receivedAt: new Date(Number(msg.internalDate)),
    body: extractBody(msg.payload).replace(/\s+/g, " ").trim().slice(0, 1500),
  };
}

// ── LLM classification / extraction ─────────────────────────────────────

function buildPrompt(emails, categoryNames) {
  const emailBlocks = emails
    .map(
      (e, i) =>
        `EMAIL ${i}\nid: ${e.id}\nfrom: ${e.from}\nsubject: ${e.subject}\ndate: ${e.receivedAt.toISOString().slice(0, 10)}\nbody: ${e.body}`
    )
    .join("\n\n");

  return `You classify emails for a personal expense tracker (currency: SGD).
A receipt is a completed personal purchase: order confirmations, ride/food-delivery receipts, card transaction alerts, e-receipts.
NOT receipts: newsletters, promos, shipping updates, refunds, statements, OTPs, reservations without a charged amount.
If unsure, mark it not a receipt — never guess.

For each email respond with one object:
{"id": "...", "is_receipt": bool, "merchant": "short name", "amount": number, "currency": "SGD", "date": "YYYY-MM-DD", "category": one of [${categoryNames.map((n) => `"${n}"`).join(", ")}] or null, "description": "few words" or null}

Respond with ONLY a JSON array (no markdown, no code fences), one object per email, same order.

${emailBlocks}`;
}

async function classifyEmails(emails, categoryNames) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(emails, categoryNames) }],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter error: ${await res.text()}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim() || "";
  const jsonText = content.replace(/^```(json)?/m, "").replace(/```$/m, "").trim();
  return JSON.parse(jsonText);
}

// ── Sync orchestrator ────────────────────────────────────────────────────
// Idempotent: every examined Gmail message id is recorded in Firestore
// (`processedEmails`, doc id = message id) as imported/skipped/removed and
// never re-imported. Batches that fail to classify are NOT recorded, so
// they are retried on the next sync.

export async function syncGmail({ currentUid, categories }) {
  const token = await getAccessToken();
  const connectedEmail = auth.currentUser?.email || null;

  const [allIds, processedIds] = await Promise.all([
    listRecentMessageIds(token),
    getProcessedEmailIds(),
  ]);
  const newIds = allIds.filter((id) => !processedIds.has(id));

  const imported = [];
  let receipts = 0;

  for (let i = 0; i < newIds.length; i += BATCH_SIZE) {
    const batchIds = newIds.slice(i, i + BATCH_SIZE);
    const emails = await Promise.all(batchIds.map((id) => fetchEmail(token, id)));

    let verdicts;
    try {
      verdicts = await classifyEmails(emails, categories.map((c) => c.name));
    } catch {
      continue; // unclassified batch stays unprocessed → retried next sync
    }

    for (const email of emails) {
      const v = verdicts.find((x) => x.id === email.id) || verdicts[emails.indexOf(email)];
      const amount = Number(v?.amount);
      const isImportable =
        v?.is_receipt && (v.currency || "SGD") === "SGD" && amount > 0 && amount < 100000;

      if (!isImportable) {
        await markEmailProcessed(email.id, { status: "skipped", subject: email.subject });
        continue;
      }

      receipts += 1;
      const parsedDate = v.date ? new Date(v.date + "T12:00:00") : email.receivedAt;
      const category = categories.find((c) => c.name === v.category);
      const expenseId = await addExpense({
        amount,
        merchant: v.merchant || email.subject,
        description: v.description || null,
        categoryId: category?.id || null,
        paidBy: currentUid,
        split: "none",
        date: Timestamp.fromDate(isNaN(parsedDate) ? email.receivedAt : parsedDate),
        source: "gmail",
        gmailMeta: {
          messageId: email.id,
          subject: email.subject,
          receivedAt: Timestamp.fromDate(email.receivedAt),
        },
      });
      await markEmailProcessed(email.id, {
        status: "imported",
        subject: email.subject,
        expenseId,
      });
      imported.push({ merchant: v.merchant || email.subject, amount });
    }
  }

  await updateSpendingSettings({
    lastSyncedAt: Timestamp.now(),
    ...(connectedEmail && {
      gmailAccounts: [
        { email: connectedEmail, label: "Connected · syncs on demand", connectedAt: Timestamp.now() },
      ],
    }),
  });

  return { scanned: newIds.length, receipts, imported };
}
