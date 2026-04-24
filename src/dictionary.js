// Online dictionary lookup.
//
// Primary source: our own /api/define endpoint, which uses Claude to
// produce SAT-quality definitions. Falls back to the free dictionaryapi.dev
// API if the Claude endpoint is unavailable.
//
// Returns { w, senses: [{d, pos, syn}, ...] } or { suggestion } or null.

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
      if(res.status === 404 && data && data.suggestion){
        return { suggestion: data.suggestion };
      }
      return null;
    }
    if(!data || !Array.isArray(data.senses) || !data.senses.length) return null;
    return {
      w: data.w,
      senses: data.senses.map(function(s){
        return {
          d: s.d,
          pos: s.pos || "adj",
          syn: Array.isArray(s.syn) ? s.syn : []
        };
      })
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

    // Build a senses list, one per POS, preferring short definitions.
    var byPos = {};
    meanings.forEach(function(m){
      var posShort = POS_MAP[(m.pos || "").toLowerCase()] || "adj";
      if(!m.d) return;
      var existing = byPos[posShort];
      if(!existing || (existing.d.length > 140 && m.d.length < 140)){
        byPos[posShort] = { d: m.d.trim(), pos: posShort, syn: m.syn || [] };
      }
    });
    var senses = Object.keys(byPos).map(function(k){ return byPos[k]; }).slice(0, 4);
    if(!senses.length){
      var pick = meanings[0];
      senses = [{ d: pick.d.trim(), pos: POS_MAP[(pick.pos||"").toLowerCase()] || "adj", syn: pick.syn || [] }];
    }
    senses = senses.map(function(s){
      var seen = {};
      var syns = [];
      (s.syn || []).forEach(function(x){
        var k = (x || "").toLowerCase().trim();
        if(k && !seen[k]){ seen[k] = true; syns.push(x); }
      });
      return { d: s.d, pos: s.pos, syn: syns.slice(0, 10) };
    });

    return {
      w: word.charAt(0).toUpperCase() + word.slice(1),
      senses: senses
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
  if(viaClaude && viaClaude.senses) return viaClaude;
  var viaApi = await fetchFromDictionaryApi(w);
  if(viaApi) return viaApi;
  if(viaClaude && viaClaude.suggestion) return { suggestion: viaClaude.suggestion };
  return null;
}
