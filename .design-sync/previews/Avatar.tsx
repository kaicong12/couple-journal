import * as React from "react";
import { Avatar } from "couple-journal";

// Partner avatars — warm gradient "Y" (you) and rose gradient "M" (Mira).
export const Partners = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Avatar who="you" />
    <Avatar who="mira" />
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Avatar who="you" size="sm" />
    <Avatar who="you" size="md" />
    <Avatar who="mira" size="sm" />
    <Avatar who="mira" size="md" />
  </div>
);

export const InContext = () => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
    <Avatar who="you" />
    <span>
      You · <b style={{ fontFamily: "Newsreader, serif" }}>S$862</b>
    </span>
  </div>
);
