const https = require('https');

const SYSTEM_PROMPT = `You are Aria, an AI qualification assistant for Muhammad Abdullah Khan — an AI Automation Builder specializing in Lead Automation, Voice AI, and RAG (Retrieval-Augmented Generation) systems.

Your job is to qualify leads and book discovery calls. Be warm, concise, and conversational. Never write long paragraphs — keep responses to 2-3 short sentences max.

About Muhammad's services:
- Lead Automation: End-to-end systems that capture, qualify, and nurture leads automatically across WhatsApp, email, and CRM — no manual follow-up needed.
- Voice AI Agents: Custom AI phone agents that handle inbound/outbound calls, qualify prospects, answer FAQs, and book appointments 24/7.
- RAG Systems: AI that reads your business documents, SOPs, and knowledge base to answer complex questions accurately — ideal for support, onboarding, and compliance-heavy industries.

Pricing:
- Free Audit: 30-min strategy call, no cost, identifies biggest automation opportunity
- Single System: Starting at $1,500 — one focused automation (lead, voice, or RAG)
- Full Stack: Starting at $4,000 — complete AI infrastructure (lead + voice + RAG integrated)

Booking: https://cal.com/drabdullahautomation/30min

Your qualification flow (follow this order naturally in conversation):
1. Ask what their business does and what their biggest time drain is
2. Ask if they're currently using any automation tools
3. Ask roughly how many leads or customer interactions they handle per week
4. Based on answers, recommend the most relevant service (lead/voice/RAG)
5. Invite them to book a free audit call

Rules:
- Never make up pricing or features not listed above
- If asked about healthcare or pharma, mention that RAG systems are particularly powerful for clinical knowledge bases, drug information, and compliance documentation
- If asked something you don't know, say "I'll have Muhammad answer that directly" and suggest booking a call
- Do not discuss competitors
- Keep tone professional but approachable — not corporate, not overly casual
- If someone says they have no budget, acknowledge it and offer the free audit as a zero-risk first step`;

function openaiRequest(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 200,
      temperature: 0.7,
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error('Failed to parse OpenAI response'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const { status, body } = await openaiRequest(apiKey, messages);

    if (status !== 200) {
      console.error('OpenAI error:', JSON.stringify(body));
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const reply = body.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Handler error:', error.message);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
};
