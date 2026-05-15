const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const MODELS = [
  'google/gemma-3-12b-it',
]

const PROMPT = `You are a caption writer for a couple's shared journal app. Look at these photos and generate a short, warm title and a brief description for this event/memory.

Respond in exactly this JSON format (no markdown, no code fences):
{"title": "...", "description": "..."}

Guidelines:
- Title: 3-8 words, catchy and affectionate, include 1-2 playful emojis
- Description: 1-3 sentences capturing the mood and moment, sprinkle in a few fun emojis that match the vibe
- Be warm, personal, and a little cheeky — as if writing for a couple's scrapbook
- If you can identify the activity, location type, or mood, mention it naturally
- Keep the tone lighthearted and loving`

async function callModel(model, imageContent) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [...imageContent, { type: 'text', text: PROMPT }],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`${model} failed: ${err}`)
  }

  return response.json()
}

export async function generateCaption(files) {
  const imageFiles = files.slice(0, 4)
  const base64Images = await Promise.all(imageFiles.map(fileToBase64))

  const imageContent = base64Images.map((dataUrl) => ({
    type: 'image_url',
    image_url: { url: dataUrl },
  }))

  let lastError
  for (const model of MODELS) {
    try {
      const data = await callModel(model, imageContent)
      const content = data.choices?.[0]?.message?.content?.trim()

      try {
        return JSON.parse(content)
      } catch {
        const titleMatch = content.match(/"title"\s*:\s*"([^"]+)"/)
        const descMatch = content.match(/"description"\s*:\s*"([^"]+)"/)
        if (titleMatch || descMatch) {
          return {
            title: titleMatch?.[1] || '',
            description: descMatch?.[1] || '',
          }
        }
        throw new Error('Could not parse response')
      }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError
}
