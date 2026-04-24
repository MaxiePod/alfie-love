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

const SENTENCE_PROMPT = `You are evaluating a student's sentence using an SAT vocabulary word. The only thing that matters is whether they use the word with the correct meaning.

You will be given:
- The target word
- Its correct definition
- The student's sentence

Score 0-100:
- 90-100: Clearly correct usage in a natural context. The sentence shows real understanding of the meaning.
- 75-89: Correct usage even if the context is simple or generic. A basic correct sentence lives HERE — this is the default for any sentence that uses the word rightly.
- 55-74: Usage is mostly right but slightly forced, imprecise, or a bit loose.
- 30-54: Partial — the sentence doesn't really demonstrate that they understand the word.
- 10-29: Wrong meaning or wrong connotation.
- 0-9: Word missing, nonsensical, or flatly wrong.

Scoring rules — apply literally:
1. IGNORE capitalization. IGNORE missing punctuation. IGNORE sentence case. Never deduct for these.
2. Minor typos (1-2 characters wrong, a missing letter, a swapped letter) deduct at most 5 points. "ferosity" instead of "ferocity" is a 5-point deduction, not a 50-point one.
3. Severe spelling (word is unrecognizable) deduct up to 15 points — not more.
4. A basic, correct sentence is ALWAYS 75+. Do not penalize for being "plain" or "not creative." Simplicity is not a flaw.
5. Restating the definition alongside the word (e.g. "His ferocity, his savage aggression, scared me") still demonstrates understanding — score 70-80, not 50.
6. The ONLY things to penalize heavily are: wrong meaning, wrong connotation, wrong part of speech used ungrammatically, or the word not appearing at all.

Examples for FEROCITY (savage fierceness; aggressive intensity):
- "the lion attacked its prey with ferocity" -> 90 (no caps/period — doesn't matter)
- "she showed ferocity in the match" -> 85 (simple but correct)
- "he fought with ferosity" -> 82 (correct usage, 1-char typo, -5 max)
- "the athlete's ferocity was unmatched" -> 88
- "she worked with ferocity on her paper" -> 85 (metaphorical but valid)
- "the ferocity was there in the room" -> 50 (vague — doesn't demonstrate meaning)
- "his ferocity for baking cookies was endearing" -> 20 (wrong connotation — ferocity isn't enthusiasm)
- "ferocity is savage aggression" -> 40 (just defines it, doesn't use it)

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
