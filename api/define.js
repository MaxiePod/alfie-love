// Vercel serverless function: look up SAT-quality definitions via Claude.
//
// POST /api/define  body: { word: "Quaint" }
// Response: { w, d, pos, syn } on success, { error } on failure.
//
// Requires ANTHROPIC_API_KEY env var set in Vercel project settings.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// The system prompt is stable across every call, so we cache it.
// With prompt caching, each call after the first pays ~0.1x for these tokens.
const SYSTEM_PROMPT = `You are an SAT vocabulary assistant. Given a single English word, respond with a definition suitable for a high-school SAT study deck.

Rules for the definition:
- Use the most common / SAT-relevant sense of the word (not obscure or archaic meanings)
- Keep it under 100 characters when possible
- Write it as a definition phrase, not a sentence (e.g. "Unusually advanced for one's age" not "It means unusually advanced...")
- Do not start with an article ("a", "the", "an") unless grammatically required
- Do not repeat the word itself in the definition

Rules for part of speech:
- Use the most common part of speech for the SAT sense
- Must be exactly one of: "n" (noun), "v" (verb), "adj" (adjective), "adv" (adverb)

Rules for synonyms:
- Provide 6-10 common synonyms that match the chosen sense
- Use single words or short phrases
- Avoid rare or archaic synonyms

If the word is not a real English word, return an error-shaped response by leaving the definition empty.`;

// JSON schema for structured output — guarantees the shape we want
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    word: {
      type: "string",
      description: "The word, properly capitalized (title case)"
    },
    definition: {
      type: "string",
      description: "SAT-quality definition under 100 characters when possible"
    },
    pos: {
      type: "string",
      enum: ["n", "v", "adj", "adv"],
      description: "Part of speech abbreviation"
    },
    synonyms: {
      type: "array",
      items: { type: "string" },
      description: "6-10 common synonyms"
    }
  },
  required: ["word", "definition", "pos", "synonyms"],
  additionalProperties: false
};

export default async function handler(req, res) {
  if(req.method !== "POST"){
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const word = (req.body && req.body.word || "").trim();
  if(!word){
    res.status(400).json({ error: "Missing 'word' in request body" });
    return;
  }
  if(word.length > 60 || !/^[a-zA-Z][a-zA-Z\- ']*$/.test(word)){
    res.status(400).json({ error: "Invalid word" });
    return;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        { role: "user", content: `Define: ${word}` }
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: OUTPUT_SCHEMA
        }
      }
    });

    // Extract the text block — structured output still comes back as text
    const textBlock = response.content.find(b => b.type === "text");
    if(!textBlock){
      res.status(502).json({ error: "No response content" });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch(e) {
      res.status(502).json({ error: "Invalid JSON from model" });
      return;
    }

    if(!parsed.definition || !parsed.definition.trim()){
      res.status(404).json({ error: `No definition found for "${word}"` });
      return;
    }

    res.status(200).json({
      w: parsed.word,
      d: parsed.definition,
      pos: parsed.pos,
      syn: Array.isArray(parsed.synonyms) ? parsed.synonyms.slice(0, 10) : []
    });
  } catch(err) {
    if(err instanceof Anthropic.APIError){
      console.error("Anthropic API error", err.status, err.message);
      res.status(502).json({ error: "Upstream error: " + err.message });
    } else {
      console.error("define handler error", err);
      res.status(500).json({ error: "Internal error" });
    }
  }
}
