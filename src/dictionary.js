// Online dictionary lookup.
//
// Primary source: our own /api/define endpoint, which uses Claude to
// produce SAT-quality definitions. Falls back to the free dictionaryapi.dev
// API if the Claude endpoint is unavailable.
//
// Returns { w, d, pos, syn } or null if nothing was found.

const POS_MAP = {
  noun: "n",
  verb: "v",
  adjective: "adj",
  adverb: "adv",
};

async function fetchFromClaude(word) {
  try {
    var res = await fetch("/api/define", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word })
    });
    var data = await res.json().catch(function(){ return null; });
    if(!res.ok){
      // 404 means Claude didn't recognize it; pass through any suggestion.
      if(res.status === 404 && data && data.suggestion){
        return { suggestion: data.suggestion };
      }
      return null;
    }
    if(!data || !data.d) return null;
    return {
      w: data.w,
      d: data.d,
      pos: data.pos || "adj",
      syn: Array.isArray(data.syn) ? data.syn : []
    };
  } catch(e) {
    console.error("fetchFromClaude failed", e);
    return null;
  }
}

async function fetchFromDictionaryApi(word) {
  try {
    var res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word));
    if(!res.ok) return null;
    var data = await res.json();
    if(!Array.isArray(data) || !data.length) return null;

    var meanings = [];
    data.forEach(function(entry){
      (entry.meanings || []).forEach(function(m){
        (m.definitions || []).forEach(function(def){
          meanings.push({
            pos: m.partOfSpeech,
            d: def.definition,
            syn: (def.synonyms || []).concat(m.synonyms || [])
          });
        });
      });
    });
    if(!meanings.length) return null;

    var pick = meanings.find(function(m){ return m.d && m.d.length < 140; }) || meanings[0];
    var posShort = POS_MAP[(pick.pos || "").toLowerCase()] || "adj";
    var seen = {};
    var syns = [];
    (pick.syn || []).forEach(function(s){
      var k = (s || "").toLowerCase().trim();
      if(k && !seen[k]){ seen[k] = true; syns.push(s); }
    });
    return {
      w: word.charAt(0).toUpperCase() + word.slice(1),
      d: pick.d.trim(),
      pos: posShort,
      syn: syns.slice(0, 10)
    };
  } catch(e) {
    console.error("fetchFromDictionaryApi failed", e);
    return null;
  }
}

export async function fetchDefinition(word) {
  var w = (word || "").trim();
  if(!w) return null;
  var viaClaude = await fetchFromClaude(w);
  if(viaClaude && viaClaude.d) return viaClaude;
  var viaApi = await fetchFromDictionaryApi(w);
  if(viaApi) return viaApi;
  // Both lookups failed; bubble up Claude's suggestion if it had one.
  if(viaClaude && viaClaude.suggestion) return { suggestion: viaClaude.suggestion };
  return null;
}
