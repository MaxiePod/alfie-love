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
const SYSTEM_PROMPT = `You are an SAT vocabulary assistant. Given a single English word, return one or more distinct SAT-relevant senses.

Rules for which senses to include in "senses":
- Return each meaningfully different SAT-relevant sense as its own entry
- Include different parts of speech when both are common (e.g. "intuitive" as adjective AND as noun)
- Include distinctly different meanings within the same POS (e.g. "constitution" = founding document vs. physical health/makeup)
- DO NOT split near-synonymous shadings into separate senses (e.g. "quaint" = charming-old-fashioned is ONE sense, don't sub-split)
- DO NOT include archaic or rare senses
- Prefer a single sense for most words; 2-3 only when the word is genuinely ambiguous. Never return more than 4.

Rules for each sense:
- definition: SAT-quality, under 100 characters when possible, phrase not sentence, no leading article unless grammatical, don't repeat the word
- pos: exactly one of "n" (noun), "v" (verb), "adj" (adjective), "adv" (adverb)
- synonyms: 6-10 common matching synonyms, single words or short phrases, avoid archaic

If the word is NOT a real English word (e.g. a brand name, typo, or made-up word):
- Return an empty "senses" array
- Set "suggestion" to the closest real English word the user likely meant (e.g. "epicurious" -> "epicurean"). If you have no good guess, leave it as an empty string.

If the word IS a real English word, leave "suggestion" as an empty string.`;

// JSON schema for structured output — guarantees the shape we want
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    word: {
      type: "string",
      description: "The word, properly capitalized (title case)"
    },
    senses: {
      type: "array",
      description: "One entry per distinct SAT-relevant sense",
      items: {
        type: "object",
        properties: {
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
            description: "6-10 common synonyms for this sense"
          }
        },
        required: ["definition", "pos", "synonyms"],
        additionalProperties: false
      }
    },
    suggestion: {
      type: "string",
      description: "Closest real English word if the input is not a real word; empty string otherwise"
    }
  },
  required: ["word", "senses", "suggestion"],
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

    const senses = Array.isArray(parsed.senses) ? parsed.senses.filter(s => s && s.definition && s.definition.trim()) : [];
    if(!senses.length){
      res.status(404).json({
        error: `No definition found for "${word}"`,
        suggestion: (parsed.suggestion || "").trim()
      });
      return;
    }

    res.status(200).json({
      w: parsed.word,
      senses: senses.slice(0, 4).map(s => ({
        d: s.definition,
        pos: s.pos,
        syn: Array.isArray(s.synonyms) ? s.synonyms.slice(0, 10) : []
      }))
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
