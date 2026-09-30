export default async function handler(req, res) {
  // CORS & Method Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "xAI API key not configured on server.",
    });
  }

  try {
    const { messages, userRole = "admin", currentPage = "/dashboard" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemPrompt = `You are the AY International Hospital Intelligent Clinical & Administrative Co-Pilot.
You assist both hospital administration/doctors and patients.
Current User Role: ${userRole}
Current Active Page: ${currentPage}

Tone & Capabilities:
- Professional, concise, empathetic, and clinically precise.
- Support English and Urdu/Roman Urdu queries seamlessly.
- When answering operational or patient questions, suggest relevant portal routes.
- Format responses cleanly with Markdown bullets or short paragraphs.

You must respond strictly in JSON matching this schema:
{
  "reply": "Your clear text or markdown answer here",
  "actions": [
    { "label": "Button text", "route": "/patients" }
  ],
  "suggestedReplies": ["Short follow-up 1", "Short follow-up 2"]
}
Only output valid parseable JSON. Do not include markdown code fence blocks if possible.`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "xAI API error",
        details: errText,
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent || "No response received.",
        actions: [],
        suggestedReplies: [],
      };
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Chat API Handler Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}