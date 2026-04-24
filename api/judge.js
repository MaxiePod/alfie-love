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
- "A type of bird" for GARRULOUS -> 0

Be strict about wrong meanings, even when the student uses impressive vocabulary.

The "note" should be under 8 words explaining the score, e.g. "Close synonym", "Correct meaning", "Misses key nuance", "Partially correct", "Wrong meaning".`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    note: { type: "string" }
  },
  required: ["score", "note"],
  additionalProperties: false
};

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
      model: "claude-haiku-4-5-20251001",
      max_tokens: 128,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        {
          role: "user",
          content: `Word: ${word}\nCorrect definition: ${definition}\nStudent's answer: ${answer}`
        }
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: OUTPUT_SCHEMA
        }
      }
    });

    const textBlock = response.content.find(b => b.type === "text");
    if(!textBlock){
      res.status(502).json({ error: "No response content" });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch(e){
      res.status(502).json({ error: "Invalid JSON from model" });
      return;
    }

    const score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    const note = (parsed.note || "").trim().slice(0, 80);
    res.status(200).json({ score, note });
  } catch(err){
    if(err instanceof Anthropic.APIError){
      console.error("Anthropic API error", err.status, err.message);
      res.status(502).json({ error: "Upstream error: " + err.message });
    } else {
      console.error("judge handler error", err);
      res.status(500).json({ error: "Internal error" });
    }
  }
}
