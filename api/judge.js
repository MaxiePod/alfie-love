// Vercel serverless function: score a typed SAT vocab answer by meaning.
//
// POST /api/judge  body: { word, definition, answer }
// Response: { score: 0-100, note: string }
//
// Requires ANTHROPIC_API_KEY env var set in Vercel project settings.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are scoring a student's attempt to define an SAT vocabulary word.

You will be given:
- The target word
- Its correct definition
- The student's answer

Score 0-100 based on how well the student's answer captures the MEANING of the word:
- 90-100: Matches precisely, uses a strong synonym, or captures the definition in different wording
- 70-89: Clearly captures the meaning even if partial or imprecise
- 40-69: Partial understanding — touches the concept but misses or distorts key aspects
- 10-39: Loosely related — hints at the right area but mostly wrong
- 0-9: Wrong, blank, or unrelated

Be generous to paraphrases and valid approximations. A student does not need to regurgitate the definition. Examples:
- "Hardworking" for DILIGENT -> 92
- "Not giving up" for TENACIOUS -> 85
- "Fake" for SPECIOUS -> 72 (captures the core, misses the "plausible-seeming" nuance)
- "Honest" for CANDID -> 90
- "Showing toughness" for FEROCITY -> 55 (related concept but misses the aggression/savagery)
- "A type of bird" for GARRULOUS -> 0

Be strict about wrong meanings, even when the student uses impressive vocabulary.

Respond with ONLY a JSON object, no other text, in this exact shape:
{"score": <integer 0-100>, "note": "<under 8 words>"}

Example valid responses:
{"score": 92, "note": "Close synonym"}
{"score": 55, "note": "Related but misses nuance"}
{"score": 0, "note": "Wrong meaning"}`;

export default async function handler(req, res){
  if(req.method !== "POST"){
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const word = (req.body && req.body.word || "").trim();
  const definition = (req.body && req.body.definition || "").trim();
  const answer = (req.body && req.body.answer || "").trim();

  if(!word || !definition || !answer){
    res.status(400).json({ error: "Missing word, definition, or answer" });
    return;
  }
  if(word.length > 60 || definition.length > 300 || answer.length > 300){
    res.status(400).json({ error: "Input too long" });
    return;
  }

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 128,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Word: ${word}\nCorrect definition: ${definition}\nStudent's answer: ${answer}`
        }
      ]
    });

    const textBlock = response.content.find(b => b.type === "text");
    if(!textBlock){
      res.status(502).json({ error: "No response content" });
      return;
    }

    // Extract JSON object from the text — tolerate any whitespace/prefix
    const raw = textBlock.text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if(!match){
      res.status(502).json({ error: "No JSON object in model response", raw });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch(e){
      res.status(502).json({ error: "Invalid JSON from model", raw: match[0] });
      return;
    }

    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const note = String(parsed.note || "").trim().slice(0, 80);
    res.status(200).json({ score, note });
  } catch(err){
    const message = err && err.message ? err.message : String(err);
    const status = (err && err.status) || 500;
    console.error("judge handler error", status, message);
    // Surface credit-balance errors with a distinct code so the client can
    // switch to offline scoring and show an "add credits" banner.
    if(/credit balance is too low/i.test(message)){
      res.status(402).json({ error: "credits_exhausted", message });
      return;
    }
    res.status(500).json({ error: message, status });
  }
}
