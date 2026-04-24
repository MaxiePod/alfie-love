// Vercel serverless function: score a typed SAT vocab answer by meaning.
//
// POST /api/judge  body: { word, definition, answer, mode? }
//   mode: "definition" (default) | "sentence"
// Response: { score: 0-100, note: string }
//
// Requires ANTHROPIC_API_KEY env var set in Vercel project settings.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const DEFINITION_PROMPT = `You are scoring a student's attempt to define an SAT vocabulary word.

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

Be generous to paraphrases and valid approximations. Examples:
- "Hardworking" for DILIGENT -> 92
- "Not giving up" for TENACIOUS -> 85
- "Fake" for SPECIOUS -> 72 (captures the core, misses the "plausible-seeming" nuance)
- "Honest" for CANDID -> 90
- "Showing toughness" for FEROCITY -> 55 (related concept but misses the aggression/savagery)
- "A type of bird" for GARRULOUS -> 0

Be strict about wrong meanings, even when the student uses impressive vocabulary.

Respond with ONLY a JSON object, no other text:
{"score": <integer 0-100>, "note": "<under 8 words>"}`;

const SENTENCE_PROMPT = `You are evaluating a student's sentence using an SAT vocabulary word. The goal is to confirm they understand the meaning by using the word naturally and correctly in context.

You will be given:
- The target word
- Its correct definition
- The student's sentence

Score 0-100 based on how well the sentence demonstrates the word's meaning:
- 90-100: Uses the word correctly in a natural, rich context that clearly demonstrates the meaning
- 70-89: Correct usage; context may be slightly generic or understated
- 40-69: Partial — word is present but the sentence does not fully demonstrate the meaning (generic context, weak fit)
- 10-39: Misused — wrong connotation, wrong sense, or sentence doesn't fit
- 0-9: Word absent, nonsensical, or clearly wrong

Red flags (cap score accordingly):
- Sentence just restates the definition — cap at 50
- Word is a filler and could be swapped for any generic word — cap at 60
- Wrong connotation or wrong meaning — cap at 30
- Wrong part of speech without proper inflection — cap at 40

Examples for FEROCITY (savage fierceness; aggressive intensity):
- "The lion attacked its prey with startling ferocity." -> 95
- "She worked with ferocity on her project." -> 75 (metaphorical but correct)
- "The ferocity was there in the room." -> 30 (vague)
- "His ferocity for cookies was endearing." -> 15 (wrong connotation)

Respond with ONLY a JSON object, no other text:
{"score": <integer 0-100>, "note": "<under 10 words>"}`;

export default async function handler(req, res){
  if(req.method !== "POST"){
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const word = (req.body && req.body.word || "").trim();
  const definition = (req.body && req.body.definition || "").trim();
  const answer = (req.body && req.body.answer || "").trim();
  const mode = (req.body && req.body.mode) === "sentence" ? "sentence" : "definition";

  if(!word || !definition || !answer){
    res.status(400).json({ error: "Missing word, definition, or answer" });
    return;
  }
  if(word.length > 60 || definition.length > 300 || answer.length > 400){
    res.status(400).json({ error: "Input too long" });
    return;
  }

  const systemPrompt = mode === "sentence" ? SENTENCE_PROMPT : DEFINITION_PROMPT;
  const userLabel = mode === "sentence" ? "Student's sentence" : "Student's answer";

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 128,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Word: ${word}\nCorrect definition: ${definition}\n${userLabel}: ${answer}`
        }
      ]
    });

    const textBlock = response.content.find(b => b.type === "text");
    if(!textBlock){
      res.status(502).json({ error: "No response content" });
      return;
    }

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
    if(/credit balance is too low/i.test(message)){
      res.status(402).json({ error: "credits_exhausted", message });
      return;
    }
    res.status(500).json({ error: message, status });
  }
}
