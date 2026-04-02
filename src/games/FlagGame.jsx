import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const COUNTRIES = [
  {code:"af",name:"Afghanistan",region:"Asia",t:"un"},{code:"al",name:"Albania",region:"Europe",t:"un"},{code:"dz",name:"Algeria",region:"Africa",t:"un"},
  {code:"ad",name:"Andorra",region:"Europe",t:"un"},{code:"ao",name:"Angola",region:"Africa",t:"un"},{code:"ag",name:"Antigua and Barbuda",region:"Americas",t:"un"},
  {code:"ar",name:"Argentina",region:"Americas",t:"un"},{code:"am",name:"Armenia",region:"Asia",t:"un"},{code:"au",name:"Australia",region:"Oceania",t:"un"},
  {code:"at",name:"Austria",region:"Europe",t:"un"},{code:"az",name:"Azerbaijan",region:"Asia",t:"un"},{code:"bs",name:"Bahamas",region:"Americas",t:"un"},
  {code:"bh",name:"Bahrain",region:"Asia",t:"un"},{code:"bd",name:"Bangladesh",region:"Asia",t:"un"},{code:"bb",name:"Barbados",region:"Americas",t:"un"},
  {code:"by",name:"Belarus",region:"Europe",t:"un"},{code:"be",name:"Belgium",region:"Europe",t:"un"},{code:"bz",name:"Belize",region:"Americas",t:"un"},
  {code:"bj",name:"Benin",region:"Africa",t:"un"},{code:"bt",name:"Bhutan",region:"Asia",t:"un"},{code:"bo",name:"Bolivia",region:"Americas",t:"un"},
  {code:"ba",name:"Bosnia and Herzegovina",region:"Europe",t:"un"},{code:"bw",name:"Botswana",region:"Africa",t:"un"},{code:"br",name:"Brazil",region:"Americas",t:"un"},
  {code:"bn",name:"Brunei",region:"Asia",t:"un"},{code:"bg",name:"Bulgaria",region:"Europe",t:"un"},{code:"bf",name:"Burkina Faso",region:"Africa",t:"un"},
  {code:"bi",name:"Burundi",region:"Africa",t:"un"},{code:"cv",name:"Cabo Verde",region:"Africa",t:"un"},{code:"kh",name:"Cambodia",region:"Asia",t:"un"},
  {code:"cm",name:"Cameroon",region:"Africa",t:"un"},{code:"ca",name:"Canada",region:"Americas",t:"un"},{code:"cf",name:"Central African Republic",region:"Africa",t:"un"},
  {code:"td",name:"Chad",region:"Africa",t:"un"},{code:"cl",name:"Chile",region:"Americas",t:"un"},{code:"cn",name:"China",region:"Asia",t:"un"},
  {code:"co",name:"Colombia",region:"Americas",t:"un"},{code:"km",name:"Comoros",region:"Africa",t:"un"},{code:"cg",name:"Congo",region:"Africa",t:"un"},
  {code:"cd",name:"DR Congo",region:"Africa",t:"un"},{code:"cr",name:"Costa Rica",region:"Americas",t:"un"},{code:"ci",name:"Côte d'Ivoire",region:"Africa",t:"un"},
  {code:"hr",name:"Croatia",region:"Europe",t:"un"},{code:"cu",name:"Cuba",region:"Americas",t:"un"},{code:"cy",name:"Cyprus",region:"Europe",t:"un"},
  {code:"cz",name:"Czechia",region:"Europe",t:"un"},{code:"dk",name:"Denmark",region:"Europe",t:"un"},{code:"dj",name:"Djibouti",region:"Africa",t:"un"},
  {code:"dm",name:"Dominica",region:"Americas",t:"un"},{code:"do",name:"Dominican Republic",region:"Americas",t:"un"},{code:"ec",name:"Ecuador",region:"Americas",t:"un"},
  {code:"eg",name:"Egypt",region:"Africa",t:"un"},{code:"sv",name:"El Salvador",region:"Americas",t:"un"},{code:"gq",name:"Equatorial Guinea",region:"Africa",t:"un"},
  {code:"er",name:"Eritrea",region:"Africa",t:"un"},{code:"ee",name:"Estonia",region:"Europe",t:"un"},{code:"sz",name:"Eswatini",region:"Africa",t:"un"},
  {code:"et",name:"Ethiopia",region:"Africa",t:"un"},{code:"fj",name:"Fiji",region:"Oceania",t:"un"},{code:"fi",name:"Finland",region:"Europe",t:"un"},
  {code:"fr",name:"France",region:"Europe",t:"un"},{code:"ga",name:"Gabon",region:"Africa",t:"un"},{code:"gm",name:"Gambia",region:"Africa",t:"un"},
  {code:"ge",name:"Georgia",region:"Asia",t:"un"},{code:"de",name:"Germany",region:"Europe",t:"un"},{code:"gh",name:"Ghana",region:"Africa",t:"un"},
  {code:"gr",name:"Greece",region:"Europe",t:"un"},{code:"gd",name:"Grenada",region:"Americas",t:"un"},{code:"gt",name:"Guatemala",region:"Americas",t:"un"},
  {code:"gn",name:"Guinea",region:"Africa",t:"un"},{code:"gw",name:"Guinea-Bissau",region:"Africa",t:"un"},{code:"gy",name:"Guyana",region:"Americas",t:"un"},
  {code:"ht",name:"Haiti",region:"Americas",t:"un"},{code:"hn",name:"Honduras",region:"Americas",t:"un"},{code:"hu",name:"Hungary",region:"Europe",t:"un"},
  {code:"is",name:"Iceland",region:"Europe",t:"un"},{code:"in",name:"India",region:"Asia",t:"un"},{code:"id",name:"Indonesia",region:"Asia",t:"un"},
  {code:"ir",name:"Iran",region:"Asia",t:"un"},{code:"iq",name:"Iraq",region:"Asia",t:"un"},{code:"ie",name:"Ireland",region:"Europe",t:"un"},
  {code:"il",name:"Israel",region:"Asia",t:"un"},{code:"it",name:"Italy",region:"Europe",t:"un"},{code:"jm",name:"Jamaica",region:"Americas",t:"un"},
  {code:"jp",name:"Japan",region:"Asia",t:"un"},{code:"jo",name:"Jordan",region:"Asia",t:"un"},{code:"kz",name:"Kazakhstan",region:"Asia",t:"un"},
  {code:"ke",name:"Kenya",region:"Africa",t:"un"},{code:"ki",name:"Kiribati",region:"Oceania",t:"un"},{code:"kp",name:"North Korea",region:"Asia",t:"un"},
  {code:"kr",name:"South Korea",region:"Asia",t:"un"},{code:"kw",name:"Kuwait",region:"Asia",t:"un"},{code:"kg",name:"Kyrgyzstan",region:"Asia",t:"un"},
  {code:"la",name:"Laos",region:"Asia",t:"un"},{code:"lv",name:"Latvia",region:"Europe",t:"un"},{code:"lb",name:"Lebanon",region:"Asia",t:"un"},
  {code:"ls",name:"Lesotho",region:"Africa",t:"un"},{code:"lr",name:"Liberia",region:"Africa",t:"un"},{code:"ly",name:"Libya",region:"Africa",t:"un"},
  {code:"li",name:"Liechtenstein",region:"Europe",t:"un"},{code:"lt",name:"Lithuania",region:"Europe",t:"un"},{code:"lu",name:"Luxembourg",region:"Europe",t:"un"},
  {code:"mg",name:"Madagascar",region:"Africa",t:"un"},{code:"mw",name:"Malawi",region:"Africa",t:"un"},{code:"my",name:"Malaysia",region:"Asia",t:"un"},
  {code:"mv",name:"Maldives",region:"Asia",t:"un"},{code:"ml",name:"Mali",region:"Africa",t:"un"},{code:"mt",name:"Malta",region:"Europe",t:"un"},
  {code:"mh",name:"Marshall Islands",region:"Oceania",t:"un"},{code:"mr",name:"Mauritania",region:"Africa",t:"un"},{code:"mu",name:"Mauritius",region:"Africa",t:"un"},
  {code:"mx",name:"Mexico",region:"Americas",t:"un"},{code:"fm",name:"Micronesia",region:"Oceania",t:"un"},{code:"md",name:"Moldova",region:"Europe",t:"un"},
  {code:"mc",name:"Monaco",region:"Europe",t:"un"},{code:"mn",name:"Mongolia",region:"Asia",t:"un"},{code:"me",name:"Montenegro",region:"Europe",t:"un"},
  {code:"ma",name:"Morocco",region:"Africa",t:"un"},{code:"mz",name:"Mozambique",region:"Africa",t:"un"},{code:"mm",name:"Myanmar",region:"Asia",t:"un"},
  {code:"na",name:"Namibia",region:"Africa",t:"un"},{code:"nr",name:"Nauru",region:"Oceania",t:"un"},{code:"np",name:"Nepal",region:"Asia",t:"un"},
  {code:"nl",name:"Netherlands",region:"Europe",t:"un"},{code:"nz",name:"New Zealand",region:"Oceania",t:"un"},{code:"ni",name:"Nicaragua",region:"Americas",t:"un"},
  {code:"ne",name:"Niger",region:"Africa",t:"un"},{code:"ng",name:"Nigeria",region:"Africa",t:"un"},{code:"mk",name:"North Macedonia",region:"Europe",t:"un"},
  {code:"no",name:"Norway",region:"Europe",t:"un"},{code:"om",name:"Oman",region:"Asia",t:"un"},{code:"pk",name:"Pakistan",region:"Asia",t:"un"},
  {code:"pw",name:"Palau",region:"Oceania",t:"un"},{code:"pa",name:"Panama",region:"Americas",t:"un"},{code:"pg",name:"Papua New Guinea",region:"Oceania",t:"un"},
  {code:"py",name:"Paraguay",region:"Americas",t:"un"},{code:"pe",name:"Peru",region:"Americas",t:"un"},{code:"ph",name:"Philippines",region:"Asia",t:"un"},
  {code:"pl",name:"Poland",region:"Europe",t:"un"},{code:"pt",name:"Portugal",region:"Europe",t:"un"},{code:"qa",name:"Qatar",region:"Asia",t:"un"},
  {code:"ro",name:"Romania",region:"Europe",t:"un"},{code:"ru",name:"Russia",region:"Europe",t:"un"},{code:"rw",name:"Rwanda",region:"Africa",t:"un"},
  {code:"kn",name:"Saint Kitts and Nevis",region:"Americas",t:"un"},{code:"lc",name:"Saint Lucia",region:"Americas",t:"un"},
  {code:"vc",name:"Saint Vincent and the Grenadines",region:"Americas",t:"un"},{code:"ws",name:"Samoa",region:"Oceania",t:"un"},
  {code:"sm",name:"San Marino",region:"Europe",t:"un"},{code:"st",name:"São Tomé and Príncipe",region:"Africa",t:"un"},
  {code:"sa",name:"Saudi Arabia",region:"Asia",t:"un"},{code:"sn",name:"Senegal",region:"Africa",t:"un"},{code:"rs",name:"Serbia",region:"Europe",t:"un"},
  {code:"sc",name:"Seychelles",region:"Africa",t:"un"},{code:"sl",name:"Sierra Leone",region:"Africa",t:"un"},{code:"sg",name:"Singapore",region:"Asia",t:"un"},
  {code:"sk",name:"Slovakia",region:"Europe",t:"un"},{code:"si",name:"Slovenia",region:"Europe",t:"un"},{code:"sb",name:"Solomon Islands",region:"Oceania",t:"un"},
  {code:"so",name:"Somalia",region:"Africa",t:"un"},{code:"za",name:"South Africa",region:"Africa",t:"un"},{code:"ss",name:"South Sudan",region:"Africa",t:"un"},
  {code:"es",name:"Spain",region:"Europe",t:"un"},{code:"lk",name:"Sri Lanka",region:"Asia",t:"un"},{code:"sd",name:"Sudan",region:"Africa",t:"un"},
  {code:"sr",name:"Suriname",region:"Americas",t:"un"},{code:"se",name:"Sweden",region:"Europe",t:"un"},{code:"ch",name:"Switzerland",region:"Europe",t:"un"},
  {code:"sy",name:"Syria",region:"Asia",t:"un"},{code:"tj",name:"Tajikistan",region:"Asia",t:"un"},
  {code:"tz",name:"Tanzania",region:"Africa",t:"un"},{code:"th",name:"Thailand",region:"Asia",t:"un"},{code:"tl",name:"Timor-Leste",region:"Asia",t:"un"},
  {code:"tg",name:"Togo",region:"Africa",t:"un"},{code:"to",name:"Tonga",region:"Oceania",t:"un"},{code:"tt",name:"Trinidad and Tobago",region:"Americas",t:"un"},
  {code:"tn",name:"Tunisia",region:"Africa",t:"un"},{code:"tr",name:"Turkey",region:"Asia",t:"un"},{code:"tm",name:"Turkmenistan",region:"Asia",t:"un"},
  {code:"tv",name:"Tuvalu",region:"Oceania",t:"un"},{code:"ug",name:"Uganda",region:"Africa",t:"un"},{code:"ua",name:"Ukraine",region:"Europe",t:"un"},
  {code:"ae",name:"United Arab Emirates",region:"Asia",t:"un"},{code:"gb",name:"United Kingdom",region:"Europe",t:"un"},
  {code:"us",name:"United States",region:"Americas",t:"un"},{code:"uy",name:"Uruguay",region:"Americas",t:"un"},
  {code:"uz",name:"Uzbekistan",region:"Asia",t:"un"},{code:"vu",name:"Vanuatu",region:"Oceania",t:"un"},
  {code:"ve",name:"Venezuela",region:"Americas",t:"un"},{code:"vn",name:"Vietnam",region:"Asia",t:"un"},{code:"ye",name:"Yemen",region:"Asia",t:"un"},
  {code:"zm",name:"Zambia",region:"Africa",t:"un"},{code:"zw",name:"Zimbabwe",region:"Africa",t:"un"},
  // Observers
  {code:"va",name:"Vatican City",region:"Europe",t:"obs"},{code:"ps",name:"Palestine",region:"Asia",t:"obs"},
  // Disputed / partially recognized
  {code:"xk",name:"Kosovo",region:"Europe",t:"dis"},{code:"tw",name:"Taiwan",region:"Asia",t:"dis"},
  // Territories & dependencies
  {code:"as",name:"American Samoa",region:"Oceania",t:"ter"},{code:"ai",name:"Anguilla",region:"Americas",t:"ter"},
  {code:"aw",name:"Aruba",region:"Americas",t:"ter"},{code:"bm",name:"Bermuda",region:"Americas",t:"ter"},
  {code:"vg",name:"British Virgin Islands",region:"Americas",t:"ter"},{code:"ky",name:"Cayman Islands",region:"Americas",t:"ter"},
  {code:"ck",name:"Cook Islands",region:"Oceania",t:"ter"},{code:"cw",name:"Curaçao",region:"Americas",t:"ter"},
  {code:"fo",name:"Faroe Islands",region:"Europe",t:"ter"},{code:"gf",name:"French Guiana",region:"Americas",t:"ter"},
  {code:"pf",name:"French Polynesia",region:"Oceania",t:"ter"},{code:"gi",name:"Gibraltar",region:"Europe",t:"ter"},
  {code:"gl",name:"Greenland",region:"Americas",t:"ter"},{code:"gp",name:"Guadeloupe",region:"Americas",t:"ter"},
  {code:"gu",name:"Guam",region:"Oceania",t:"ter"},{code:"hk",name:"Hong Kong",region:"Asia",t:"ter"},
  {code:"im",name:"Isle of Man",region:"Europe",t:"ter"},{code:"je",name:"Jersey",region:"Europe",t:"ter"},
  {code:"mo",name:"Macau",region:"Asia",t:"ter"},{code:"mq",name:"Martinique",region:"Americas",t:"ter"},
  {code:"nc",name:"New Caledonia",region:"Oceania",t:"ter"},{code:"nu",name:"Niue",region:"Oceania",t:"ter"},
  {code:"mp",name:"Northern Mariana Islands",region:"Oceania",t:"ter"},{code:"pr",name:"Puerto Rico",region:"Americas",t:"ter"},
  {code:"re",name:"Réunion",region:"Africa",t:"ter"},{code:"sx",name:"Sint Maarten",region:"Americas",t:"ter"},
  {code:"tk",name:"Tokelau",region:"Oceania",t:"ter"},{code:"tc",name:"Turks and Caicos Islands",region:"Americas",t:"ter"},
  {code:"vi",name:"U.S. Virgin Islands",region:"Americas",t:"ter"},{code:"wf",name:"Wallis and Futuna",region:"Oceania",t:"ter"},
  {code:"eh",name:"Western Sahara",region:"Africa",t:"ter"},{code:"gg",name:"Guernsey",region:"Europe",t:"ter"},
  {code:"ax",name:"Åland Islands",region:"Europe",t:"ter"},{code:"bq",name:"Caribbean Netherlands",region:"Americas",t:"ter"},
  {code:"io",name:"British Indian Ocean Territory",region:"Asia",t:"ter"},{code:"cx",name:"Christmas Island",region:"Oceania",t:"ter"},
  {code:"cc",name:"Cocos Islands",region:"Oceania",t:"ter"},{code:"fk",name:"Falkland Islands",region:"Americas",t:"ter"},
  {code:"ms",name:"Montserrat",region:"Americas",t:"ter"},{code:"nf",name:"Norfolk Island",region:"Oceania",t:"ter"},
  {code:"pn",name:"Pitcairn Islands",region:"Oceania",t:"ter"},{code:"bl",name:"Saint Barthélemy",region:"Americas",t:"ter"},
  {code:"sh",name:"Saint Helena",region:"Africa",t:"ter"},{code:"mf",name:"Saint Martin",region:"Americas",t:"ter"},
  {code:"pm",name:"Saint Pierre and Miquelon",region:"Americas",t:"ter"},{code:"gs",name:"South Georgia",region:"Americas",t:"ter"},
  {code:"sj",name:"Svalbard and Jan Mayen",region:"Europe",t:"ter"},{code:"tf",name:"French Southern Territories",region:"Africa",t:"ter"}
];

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];
const SCOPES = [
  { value: "un", label: "UN (193)" },
  { value: "sovereign", label: "Sovereign (197)" },
  { value: "all", label: "All (245)" },
];

// Build emoji flag from country code using regional indicator symbols
const codeToFlag = (code) =>
  [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join("");

function FlagDisplay({ code, size = 160, style = {} }) {
  const emoji = codeToFlag(code);
  return (
    <span style={{
      fontSize: size * 0.75,
      lineHeight: 1,
      display: "inline-block",
      ...style,
    }}>
      {emoji}
    </span>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function fuzzyMatch(input, target) {
  const a = normalize(input);
  const b = normalize(target);
  if (a === b) return true;
  const aliases = {
    "usa":"unitedstates","us":"unitedstates","america":"unitedstates",
    "uk":"unitedkingdom","britain":"unitedkingdom","greatbritain":"unitedkingdom","england":"unitedkingdom",
    "uae":"unitedarabemirates","emirates":"unitedarabemirates",
    "drc":"drcongo",
    "ivorycoast":"ctedivoire","cotedivoire":"ctedivoire",
    "czechrepublic":"czechia","burma":"myanmar","swaziland":"eswatini",
    "capeverde":"caboverde","easttimor":"timorleste","korea":"southkorea",
    "macedonia":"northmacedonia","bosnia":"bosniaandherzegovina",
    "stkitts":"saintkittsandnevis","stkittsandnevis":"saintkittsandnevis",
    "stlucia":"saintlucia","stvincent":"saintvincentandthegrenadines",
    "trinidad":"trinidadandtobago","png":"papuanewguinea",
  };
  if (aliases[a] === b || aliases[a] === normalize(target)) return true;
  if (a.length >= 3 && b.startsWith(a)) return true;
  return false;
}

const C = {
  bg: "#0c0c0e",
  card: "#131316",
  cardBorder: "#1e1e22",
  text: "#dcdce0",
  textMuted: "#9a9aa0",
  textDim: "#7a7a82",
  white: "#e4e4e8",
  accent: "#b8b8be",
  btnBg: "#a0a0a6",
  btnText: "#0c0c0e",
  green: "#5cb870",
  greenBg: "rgba(92,184,112,0.1)",
  red: "#d45555",
  redBg: "rgba(212,85,85,0.08)",
  gold: "#d4a843",
  goldBg: "rgba(212,168,67,0.06)",
  inputBg: "#0e0e11",
  inputBorder: "#222228",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  title: { fontSize: "32px", fontWeight: 100, letterSpacing: "8px", textTransform: "uppercase", marginBottom: "4px", color: C.white },
  subtitle: { fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: C.textMuted, marginBottom: "40px" },
  card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: "3px", padding: "24px 20px", width: "100%", maxWidth: "680px", boxSizing: "border-box" },
  label: { fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: C.textMuted, marginBottom: "10px", display: "block" },
  select: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, padding: "10px 14px", fontSize: "14px", fontFamily: "'Roboto', sans-serif", fontWeight: 300, borderRadius: "2px", width: "100%", outline: "none", cursor: "pointer", appearance: "none", boxSizing: "border-box" },
  btn: { background: C.btnBg, color: C.btnText, border: "none", padding: "14px 32px", fontSize: "12px", fontFamily: "'Roboto', sans-serif", fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", transition: "all 0.2s" },
  btnOutline: { background: "transparent", color: C.text, border: `1px solid ${C.inputBorder}`, padding: "10px 20px", fontSize: "11px", fontFamily: "'Roboto', sans-serif", fontWeight: 300, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", transition: "all 0.2s" },
  input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, borderBottom: "2px solid #333", color: C.white, padding: "14px 16px", fontSize: "18px", fontFamily: "'Roboto', sans-serif", fontWeight: 300, borderRadius: "2px", width: "100%", outline: "none", boxSizing: "border-box", textAlign: "center" },
  timer: { fontFamily: "'Roboto Mono', monospace", fontSize: "42px", fontWeight: 100, color: C.white, letterSpacing: "2px", textAlign: "center" },
  row: { display: "flex", gap: "12px", flexWrap: "wrap" },
  choiceBtn: { flex: "1 1 calc(50% - 6px)", minWidth: "0", background: "#18181c", border: `1px solid ${C.inputBorder}`, color: C.text, padding: "14px 12px", fontSize: "14px", fontFamily: "'Roboto', sans-serif", fontWeight: 300, cursor: "pointer", borderRadius: "2px", textAlign: "center", transition: "all 0.15s" },
};

function Timer({ running, onTick, resetKey }) {
  const [ms, setMs] = useState(0);
  const ref = useRef(null);
  const startRef = useRef(0);
  useEffect(() => { setMs(0); if (ref.current) cancelAnimationFrame(ref.current); }, [resetKey]);
  useEffect(() => {
    if (running) {
      startRef.current = performance.now() - ms;
      const tick = () => { const elapsed = performance.now() - startRef.current; setMs(elapsed); if (onTick) onTick(elapsed); ref.current = requestAnimationFrame(tick); };
      ref.current = requestAnimationFrame(tick);
    } else { if (ref.current) cancelAnimationFrame(ref.current); }
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [running]);
  const fmt = (t) => { const total = Math.floor(t); const m = Math.floor(total / 60000); const s = Math.floor((total % 60000) / 1000); const cs = Math.floor((total % 1000) / 10); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`; };
  return <div style={styles.timer}>{fmt(ms)}</div>;
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", border: `1px solid ${C.inputBorder}`, borderRadius: "2px", overflow: "hidden" }}>
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          flex: 1, padding: "10px 12px", fontSize: "11px", fontFamily: "'Roboto', sans-serif",
          fontWeight: value === opt.value ? 400 : 300, letterSpacing: "1.5px", textTransform: "uppercase",
          background: value === opt.value ? C.accent : "transparent", color: value === opt.value ? C.bg : C.textMuted,
          border: "none", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

export default function FlagGame() {
  const [screen, setScreen] = useState("setup");
  const [mode, setMode] = useState("race");
  const [inputType, setInputType] = useState("choice");
  const [numChoices, setNumChoices] = useState(4);
  const [reverse, setReverse] = useState(false);
  const [region, setRegion] = useState("All");
  const [scope, setScope] = useState("un");
  const [raceCount, setRaceCount] = useState(20);
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(["Player 1"]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [missedFlags, setMissedFlags] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const timeRef = useRef(0);
  const inputRef = useRef(null);

  const pool = useMemo(() => {
    const scopeTypes = scope === "un" ? ["un"] : scope === "sovereign" ? ["un", "obs", "dis"] : ["un", "obs", "dis", "ter"];
    let filtered = COUNTRIES.filter(c => scopeTypes.includes(c.t));
    if (region !== "All") filtered = filtered.filter(c => c.region === region);
    return filtered;
  }, [region, scope]);
  const totalAvailable = pool.length;
  const raceOptions = useMemo(() => { const opts = [10,20,25,50,100].filter(n => n <= totalAvailable); if (!opts.includes(totalAvailable)) opts.push(totalAvailable); return [...new Set(opts)]; }, [totalAvailable]);

  useEffect(() => { if (raceCount > totalAvailable) setRaceCount(Math.min(20, totalAvailable)); }, [totalAvailable]);
  useEffect(() => { if (reverse && inputType === "type") setInputType("choice"); }, [reverse]);

  const generateQuestions = useCallback(() => {
    const shuffled = shuffle(pool);
    const count = mode === "race" ? raceCount : shuffled.length;
    return shuffled.slice(0, count).map(country => {
      const distractors = shuffle(pool.filter(c => c.code !== country.code)).slice(0, numChoices - 1);
      return { country, options: shuffle([country, ...distractors]) };
    });
  }, [pool, mode, raceCount, numChoices]);

  const startGame = () => {
    const names = Array.from({ length: playerCount }, (_, i) => playerNames[i] || `Player ${i + 1}`);
    setPlayerNames(names); setResults([]); setCurrentPlayerIdx(0); startPlayerRound();
  };

  const startPlayerRound = () => {
    setQuestions(generateQuestions()); setQIndex(0); setMistakes(0); setCorrect(0);
    setStreak(0); setBestStreak(0); setAnswered(null); setTypedAnswer("");
    setMissedFlags([]); setGameOver(false); setTimerKey(k => k + 1);
    setTimerRunning(true); setScreen("playing");
  };

  const handleAnswer = (selectedCode) => {
    if (answered !== null) return;
    const q = questions[qIndex];
    const isCorrect = selectedCode === q.country.code;
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) { setCorrect(c => c + 1); setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; }); }
    else { setMistakes(m => m + 1); setStreak(0); setMissedFlags(prev => [...prev, { ...q.country, yourAnswer: selectedCode }]); }
    setTimeout(() => {
      const newMistakes = mistakes + (isCorrect ? 0 : 1);
      const newQIndex = qIndex + 1;
      if ((mode === "survival" && newMistakes >= 3) || (mode === "race" && newQIndex >= questions.length)) {
        setTimerRunning(false); finishRound(isCorrect ? correct + 1 : correct, newMistakes);
      } else { setQIndex(newQIndex); setAnswered(null); setTypedAnswer(""); if (inputType === "type" && inputRef.current) inputRef.current.focus(); }
    }, 600);
  };

  const handleType = (e) => {
    if (e.key === "Enter" && typedAnswer.trim()) {
      const q = questions[qIndex];
      handleAnswer(fuzzyMatch(typedAnswer, q.country.name) ? q.country.code : "__wrong__");
    }
  };

  const finishRound = (finalCorrect, finalMistakes) => {
    setGameOver(true);
    setResults(prev => [...prev, { player: playerNames[currentPlayerIdx], correct: finalCorrect, mistakes: finalMistakes, time: timeRef.current, bestStreak: Math.max(bestStreak, streak + (answered === "correct" ? 1 : 0)), missedFlags: [...missedFlags], exited: false }]);
    setTimeout(() => { setScreen(currentPlayerIdx + 1 < playerCount ? "transition" : "results"); }, 1500);
  };

  const nextPlayer = () => { setCurrentPlayerIdx(i => i + 1); startPlayerRound(); };
  const resetAll = () => { setScreen("setup"); setResults([]); setCurrentPlayerIdx(0); };

  const exitGame = () => {
    setTimerRunning(false);
    setGameOver(true);
    const result = {
      player: playerNames[currentPlayerIdx],
      correct,
      mistakes,
      time: timeRef.current,
      bestStreak: Math.max(bestStreak, streak),
      missedFlags: [...missedFlags],
      exited: true,
    };
    setResults(prev => [...prev, result]);
    if (currentPlayerIdx + 1 < playerCount) {
      setScreen("transition");
    } else {
      setScreen("results");
    }
  };

  const formatTime = (t) => { const total = Math.floor(t); const m = Math.floor(total / 60000); const s = Math.floor((total % 60000) / 1000); const cs = Math.floor((total % 1000) / 10); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`; };

  const currentQ = questions[qIndex];
  const fontLink = <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500&family=Roboto+Mono:wght@100;300;400&display=swap" rel="stylesheet" />;

  // SETUP
  if (screen === "setup") {
    return (
      <div style={styles.app}>
        {fontLink}
        <div style={styles.title}>Vexillum</div>
        <div style={styles.subtitle}>{COUNTRIES.length} flags of the world</div>
        <div style={{ ...styles.card, marginBottom: "16px" }}>
          <div style={styles.label}>Game Mode</div>
          <SegmentedControl options={[{ value: "race", label: "Race" }, { value: "survival", label: "Survival" }]} value={mode} onChange={setMode} />
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "8px" }}>{mode === "race" ? "Answer a set number of flags as fast as possible." : "How many can you get right? Three strikes and you're out."}</div>
        </div>
        <div style={{ ...styles.card, marginBottom: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={styles.label}>Input Method</div>
              <SegmentedControl options={[{ value: "choice", label: "Multiple Choice" }, { value: "type", label: "Type" }]} value={inputType} onChange={(v) => { setInputType(v); if (v === "type") setReverse(false); }} />
            </div>
            <div>
              <div style={styles.label}>Scope</div>
              <SegmentedControl options={SCOPES} value={scope} onChange={setScope} />
            </div>
            <div>
              <div style={styles.label}>Region</div>
              <select style={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map(r => {
                  const scopeTypes = scope === "un" ? ["un"] : scope === "sovereign" ? ["un","obs","dis"] : ["un","obs","dis","ter"];
                  const count = COUNTRIES.filter(c => scopeTypes.includes(c.t) && (r === "All" || c.region === r)).length;
                  return <option key={r} value={r}>{r === "All" ? `All Regions (${count})` : `${r} (${count})`}</option>;
                })}
              </select>
            </div>
            {inputType === "choice" && (
              <div>
                <div style={styles.label}>Number of Choices</div>
                <SegmentedControl options={[{ value: 3, label: "3" }, { value: 4, label: "4" }, { value: 6, label: "6" }]} value={numChoices} onChange={setNumChoices} />
              </div>
            )}
            <div>
              <div style={styles.label}>Direction</div>
              <SegmentedControl options={[{ value: false, label: "Flag → Name" }, { value: true, label: "Name → Flag" }]} value={reverse} onChange={(v) => { if (v && inputType === "type") return; setReverse(v); }} />
              {inputType === "type" && <div style={{ fontSize: "10px", color: C.textDim, marginTop: "4px" }}>Reverse requires multiple choice</div>}
            </div>
          </div>
          {mode === "race" && (
            <div style={{ marginTop: "20px" }}>
              <div style={styles.label}>Number of Flags ({totalAvailable} available)</div>
              <SegmentedControl options={raceOptions.map(n => ({ value: n, label: n === totalAvailable ? `All ${n}` : String(n) }))} value={raceCount} onChange={setRaceCount} />
            </div>
          )}
        </div>
        <div style={{ ...styles.card, marginBottom: "24px" }}>
          <div style={styles.label}>Players</div>
          <SegmentedControl options={[1,2,3,4].map(n => ({ value: n, label: String(n) }))} value={playerCount} onChange={(n) => { setPlayerCount(n); setPlayerNames(prev => { const next = [...prev]; while (next.length < n) next.push(`Player ${next.length + 1}`); return next.slice(0, n); }); }} />
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {Array.from({ length: playerCount }).map((_, i) => (
              <input key={i} style={{ ...styles.input, fontSize: "13px", flex: "1 1 120px", minWidth: "0" }} value={playerNames[i] || ""} onChange={(e) => { const next = [...playerNames]; next[i] = e.target.value; setPlayerNames(next); }} placeholder={`Player ${i + 1}`} />
            ))}
          </div>
        </div>
        <button style={styles.btn} onClick={startGame} onMouseEnter={(e) => { e.target.style.background = "#909096"; }} onMouseLeave={(e) => { e.target.style.background = C.btnBg; }}>Start Game</button>
      </div>
    );
  }

  // PLAYING
  if (screen === "playing") {
    const progress = mode === "race" ? `${qIndex + 1} / ${questions.length}` : `${correct} correct`;
    return (
      <div style={styles.app}>
        {fontLink}
        <div style={{ width: "100%", maxWidth: "680px", display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button onClick={exitGame} style={{ background: "transparent", border: `1px solid ${C.inputBorder}`, color: C.textDim, padding: "6px 14px", fontSize: "10px", fontFamily: "'Roboto', sans-serif", fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.red; e.target.style.color = C.red; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.inputBorder; e.target.style.color = C.textDim; }}
          >Exit</button>
        </div>
        {playerCount > 1 && <div style={{ ...styles.label, marginBottom: "12px", color: C.textMuted }}>{playerNames[currentPlayerIdx]}</div>}
        <Timer running={timerRunning} onTick={(t) => { timeRef.current = t; }} resetKey={timerKey} />
        {mode === "survival" && (
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "8px" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i < mistakes ? C.red : "#1e1e22", border: `1px solid ${C.inputBorder}`, transition: "background 0.3s" }} />)}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", marginTop: "4px" }}>
          <span style={{ fontSize: "12px", color: C.textMuted, letterSpacing: "2px" }}>{progress}</span>
          {streak > 1 && <span style={{ fontSize: "11px", color: C.green, letterSpacing: "1px", padding: "3px 10px", background: C.greenBg, borderRadius: "2px" }}>{streak} streak</span>}
        </div>
        {gameOver ? (
          <div style={{ ...styles.card, textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "18px", fontWeight: 100, color: C.white, marginBottom: "8px" }}>{mode === "survival" && mistakes >= 3 ? "Game Over" : "Complete"}</div>
            <div style={{ fontSize: "13px", color: C.textDim }}>Loading results...</div>
          </div>
        ) : currentQ && (
          <div style={{ ...styles.card, textAlign: "center" }}>
            {!reverse ? (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                  <FlagDisplay code={currentQ.country.code} size={240} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }} />
                </div>
                <div style={{ marginTop: "28px" }}>
                  {inputType === "choice" ? (
                    <div style={styles.row}>
                      {currentQ.options.map(opt => {
                        let bg = "#18181c", border = C.inputBorder, color = C.text;
                        if (answered) {
                          if (opt.code === currentQ.country.code) { bg = C.greenBg; border = C.green; color = C.green; }
                          else { bg = C.redBg; color = C.textDim; }
                        }
                        return (
                          <button key={opt.code} onClick={() => handleAnswer(opt.code)} disabled={answered !== null}
                            style={{ ...styles.choiceBtn, background: bg, borderColor: border, color, opacity: answered && opt.code !== currentQ.country.code ? 0.5 : 1 }}
                            onMouseEnter={(e) => { if (!answered) e.target.style.borderColor = "#444"; }}
                            onMouseLeave={(e) => { if (!answered) e.target.style.borderColor = C.inputBorder; }}
                          >{opt.name}</button>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <input ref={inputRef} style={{ ...styles.input, borderBottomColor: answered === "correct" ? C.green : answered === "wrong" ? C.red : "#333" }}
                        value={typedAnswer} onChange={(e) => setTypedAnswer(e.target.value)} onKeyDown={handleType} placeholder="Type country name..." autoFocus disabled={answered !== null} />
                      {answered === "wrong" && <div style={{ marginTop: "8px", fontSize: "13px", color: C.red }}>{currentQ.country.name}</div>}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "28px", fontWeight: 100, letterSpacing: "2px", marginBottom: "28px", color: C.white }}>{currentQ.country.name}</div>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  {currentQ.options.map(opt => {
                    let borderStyle = "3px solid transparent", opacity = 1;
                    if (answered) { if (opt.code === currentQ.country.code) borderStyle = `3px solid ${C.green}`; else opacity = 0.3; }
                    return (
                      <div key={opt.code} onClick={() => handleAnswer(opt.code)}
                        style={{ border: borderStyle, borderRadius: "4px", padding: "4px", cursor: answered ? "default" : "pointer", opacity, transition: "all 0.15s" }}>
                        <FlagDisplay code={opt.code} size={numChoices > 4 ? 90 : 120} style={{ borderRadius: "2px" }} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // TRANSITION
  if (screen === "transition") {
    return (
      <div style={styles.app}>
        {fontLink}
        <div style={{ ...styles.card, textAlign: "center", padding: "60px 32px" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "24px" }}>Next Up</div>
          <div style={{ fontSize: "32px", fontWeight: 100, color: C.white, marginBottom: "8px" }}>{playerNames[currentPlayerIdx + 1]}</div>
          <div style={{ fontSize: "13px", color: C.textDim, marginBottom: "40px" }}>Pass the device. No peeking.</div>
          <button style={styles.btn} onClick={nextPlayer} onMouseEnter={(e) => { e.target.style.background = "#909096"; }} onMouseLeave={(e) => { e.target.style.background = C.btnBg; }}>Ready</button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (screen === "results") {
    const sorted = [...results].sort((a, b) => { if (mode === "race") { if (b.correct !== a.correct) return b.correct - a.correct; return a.time - b.time; } if (b.correct !== a.correct) return b.correct - a.correct; return b.bestStreak - a.bestStreak; });
    const winner = sorted[0];
    const perfect = mode === "race" && winner && winner.correct === raceCount && winner.mistakes === 0 && raceCount === totalAvailable && !winner.exited;
    return (
      <div style={styles.app}>
        {fontLink}
        {perfect && (
          <div style={{ background: C.goldBg, border: "1px solid rgba(212,168,67,0.2)", borderRadius: "2px", padding: "20px 32px", marginBottom: "24px", textAlign: "center", maxWidth: "680px", width: "100%" }}>
            <div style={{ fontSize: "10px", letterSpacing: "6px", color: "rgba(212,168,67,0.6)", textTransform: "uppercase", marginBottom: "6px" }}>Achievement Unlocked</div>
            <div style={{ fontSize: "22px", fontWeight: 100, color: C.gold, letterSpacing: "4px" }}>MAJOR STATUS</div>
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>All {totalAvailable} flags — zero mistakes</div>
          </div>
        )}
        <div style={styles.title}>Results</div>
        <div style={{ ...styles.subtitle, marginBottom: "24px" }}>
          {mode === "race" ? `Race — ${raceCount} flags` : "Survival — 3 strikes"} · {region === "All" ? "World" : region}{reverse ? " · Reverse" : ""} · {inputType === "choice" ? `${numChoices} choices` : "Typed"}
        </div>
        {sorted.map((r, i) => (
          <div key={i} style={{ ...styles.card, marginBottom: "12px", borderLeft: i === 0 && playerCount > 1 ? `2px solid ${C.accent}` : `1px solid ${C.cardBorder}` }}>
            {playerCount > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "16px", fontWeight: 400, color: C.white }}>{r.player}</span>
                {i === 0 && !r.exited && <span style={{ fontSize: "10px", letterSpacing: "2px", color: C.gold, textTransform: "uppercase" }}>Winner</span>}
                {r.exited && <span style={{ fontSize: "10px", letterSpacing: "2px", color: C.textDim, textTransform: "uppercase" }}>Exited</span>}
              </div>
            )}
            {playerCount <= 1 && r.exited && (
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.textDim, textTransform: "uppercase", marginBottom: "12px" }}>Exited early</div>
            )}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={styles.label}>Time</div>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "36px", fontWeight: 100, color: C.white }}>{formatTime(r.time)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
              <div><div style={styles.label}>Correct</div><div style={{ fontSize: "28px", fontWeight: 100, color: C.green }}>{r.correct}</div></div>
              <div><div style={styles.label}>Mistakes</div><div style={{ fontSize: "28px", fontWeight: 100, color: r.mistakes > 0 ? C.red : C.textDim }}>{r.mistakes}</div></div>
              <div><div style={styles.label}>Best Streak</div><div style={{ fontSize: "28px", fontWeight: 100, color: C.white }}>{r.bestStreak}</div></div>
            </div>
            {r.missedFlags.length > 0 && (
              <div style={{ marginTop: "20px", borderTop: `1px solid ${C.cardBorder}`, paddingTop: "16px" }}>
                <div style={{ ...styles.label, marginBottom: "12px" }}>Missed Flags</div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {r.missedFlags.map((f, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <FlagDisplay code={f.code} size={48} style={{ marginBottom: "4px" }} />
                      <div style={{ fontSize: "9px", color: C.textMuted, maxWidth: "56px", lineHeight: "1.3" }}>{f.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button style={styles.btn} onClick={resetAll} onMouseEnter={(e) => { e.target.style.background = "#909096"; }} onMouseLeave={(e) => { e.target.style.background = C.btnBg; }}>New Game</button>
          <button style={styles.btnOutline} onClick={() => { setResults([]); setCurrentPlayerIdx(0); startPlayerRound(); }} onMouseEnter={(e) => { e.target.style.borderColor = "#444"; }} onMouseLeave={(e) => { e.target.style.borderColor = C.inputBorder; }}>Rematch</button>
        </div>
      </div>
    );
  }
  return null;
}
