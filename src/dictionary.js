// Online dictionary lookup via dictionaryapi.dev (free, no auth).
// Returns { d, pos, syn } or null if the word isn't found.

const POS_MAP = {
  noun: "n",
  verb: "v",
  adjective: "adj",
  adverb: "adv",
};

export async function fetchDefinition(word) {
  var w = (word || "").trim();
  if(!w) return null;
  try {
    var res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w));
    if(!res.ok) return null;
    var data = await res.json();
    if(!Array.isArray(data) || !data.length) return null;

    // Flatten all meanings across entries
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

    // Prefer the first meaning that isn't excessively long
    var pick = meanings.find(function(m){ return m.d && m.d.length < 140; }) || meanings[0];
    var posShort = POS_MAP[(pick.pos || "").toLowerCase()] || "adj";
    // Dedupe synonyms and cap at 10
    var seen = {};
    var syns = [];
    (pick.syn || []).forEach(function(s){
      var k = (s || "").toLowerCase().trim();
      if(k && !seen[k]){ seen[k] = true; syns.push(s); }
    });
    return {
      d: pick.d.trim(),
      pos: posShort,
      syn: syns.slice(0, 10)
    };
  } catch(e) {
    console.error("fetchDefinition failed", e);
    return null;
  }
}
