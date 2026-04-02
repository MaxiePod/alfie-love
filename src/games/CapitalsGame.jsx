import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const COUNTRIES = [
  {code:"af",name:"Afghanistan",capital:"Kabul",region:"Asia",t:"un"},
  {code:"al",name:"Albania",capital:"Tirana",region:"Europe",t:"un"},
  {code:"dz",name:"Algeria",capital:"Algiers",region:"Africa",t:"un"},
  {code:"ad",name:"Andorra",capital:"Andorra la Vella",region:"Europe",t:"un"},
  {code:"ao",name:"Angola",capital:"Luanda",region:"Africa",t:"un"},
  {code:"ag",name:"Antigua and Barbuda",capital:"St. John's",region:"Americas",t:"un"},
  {code:"ar",name:"Argentina",capital:"Buenos Aires",region:"Americas",t:"un"},
  {code:"am",name:"Armenia",capital:"Yerevan",region:"Asia",t:"un"},
  {code:"au",name:"Australia",capital:"Canberra",region:"Oceania",t:"un"},
  {code:"at",name:"Austria",capital:"Vienna",region:"Europe",t:"un"},
  {code:"az",name:"Azerbaijan",capital:"Baku",region:"Asia",t:"un"},
  {code:"bs",name:"Bahamas",capital:"Nassau",region:"Americas",t:"un"},
  {code:"bh",name:"Bahrain",capital:"Manama",region:"Asia",t:"un"},
  {code:"bd",name:"Bangladesh",capital:"Dhaka",region:"Asia",t:"un"},
  {code:"bb",name:"Barbados",capital:"Bridgetown",region:"Americas",t:"un"},
  {code:"by",name:"Belarus",capital:"Minsk",region:"Europe",t:"un"},
  {code:"be",name:"Belgium",capital:"Brussels",region:"Europe",t:"un"},
  {code:"bz",name:"Belize",capital:"Belmopan",region:"Americas",t:"un"},
  {code:"bj",name:"Benin",capital:"Porto-Novo",region:"Africa",t:"un"},
  {code:"bt",name:"Bhutan",capital:"Thimphu",region:"Asia",t:"un"},
  {code:"bo",name:"Bolivia",capital:"Sucre",region:"Americas",t:"un"},
  {code:"ba",name:"Bosnia and Herzegovina",capital:"Sarajevo",region:"Europe",t:"un"},
  {code:"bw",name:"Botswana",capital:"Gaborone",region:"Africa",t:"un"},
  {code:"br",name:"Brazil",capital:"Brasilia",region:"Americas",t:"un"},
  {code:"bn",name:"Brunei",capital:"Bandar Seri Begawan",region:"Asia",t:"un"},
  {code:"bg",name:"Bulgaria",capital:"Sofia",region:"Europe",t:"un"},
  {code:"bf",name:"Burkina Faso",capital:"Ouagadougou",region:"Africa",t:"un"},
  {code:"bi",name:"Burundi",capital:"Gitega",region:"Africa",t:"un"},
  {code:"cv",name:"Cabo Verde",capital:"Praia",region:"Africa",t:"un"},
  {code:"kh",name:"Cambodia",capital:"Phnom Penh",region:"Asia",t:"un"},
  {code:"cm",name:"Cameroon",capital:"Yaoundé",region:"Africa",t:"un"},
  {code:"ca",name:"Canada",capital:"Ottawa",region:"Americas",t:"un"},
  {code:"cf",name:"Central African Republic",capital:"Bangui",region:"Africa",t:"un"},
  {code:"td",name:"Chad",capital:"N'Djamena",region:"Africa",t:"un"},
  {code:"cl",name:"Chile",capital:"Santiago",region:"Americas",t:"un"},
  {code:"cn",name:"China",capital:"Beijing",region:"Asia",t:"un"},
  {code:"co",name:"Colombia",capital:"Bogotá",region:"Americas",t:"un"},
  {code:"km",name:"Comoros",capital:"Moroni",region:"Africa",t:"un"},
  {code:"cg",name:"Congo",capital:"Brazzaville",region:"Africa",t:"un"},
  {code:"cd",name:"DR Congo",capital:"Kinshasa",region:"Africa",t:"un"},
  {code:"cr",name:"Costa Rica",capital:"San José",region:"Americas",t:"un"},
  {code:"ci",name:"Côte d'Ivoire",capital:"Yamoussoukro",region:"Africa",t:"un"},
  {code:"hr",name:"Croatia",capital:"Zagreb",region:"Europe",t:"un"},
  {code:"cu",name:"Cuba",capital:"Havana",region:"Americas",t:"un"},
  {code:"cy",name:"Cyprus",capital:"Nicosia",region:"Europe",t:"un"},
  {code:"cz",name:"Czechia",capital:"Prague",region:"Europe",t:"un"},
  {code:"dk",name:"Denmark",capital:"Copenhagen",region:"Europe",t:"un"},
  {code:"dj",name:"Djibouti",capital:"Djibouti",region:"Africa",t:"un"},
  {code:"dm",name:"Dominica",capital:"Roseau",region:"Americas",t:"un"},
  {code:"do",name:"Dominican Republic",capital:"Santo Domingo",region:"Americas",t:"un"},
  {code:"ec",name:"Ecuador",capital:"Quito",region:"Americas",t:"un"},
  {code:"eg",name:"Egypt",capital:"Cairo",region:"Africa",t:"un"},
  {code:"sv",name:"El Salvador",capital:"San Salvador",region:"Americas",t:"un"},
  {code:"gq",name:"Equatorial Guinea",capital:"Malabo",region:"Africa",t:"un"},
  {code:"er",name:"Eritrea",capital:"Asmara",region:"Africa",t:"un"},
  {code:"ee",name:"Estonia",capital:"Tallinn",region:"Europe",t:"un"},
  {code:"sz",name:"Eswatini",capital:"Mbabane",region:"Africa",t:"un"},
  {code:"et",name:"Ethiopia",capital:"Addis Ababa",region:"Africa",t:"un"},
  {code:"fj",name:"Fiji",capital:"Suva",region:"Oceania",t:"un"},
  {code:"fi",name:"Finland",capital:"Helsinki",region:"Europe",t:"un"},
  {code:"fr",name:"France",capital:"Paris",region:"Europe",t:"un"},
  {code:"ga",name:"Gabon",capital:"Libreville",region:"Africa",t:"un"},
  {code:"gm",name:"Gambia",capital:"Banjul",region:"Africa",t:"un"},
  {code:"ge",name:"Georgia",capital:"Tbilisi",region:"Asia",t:"un"},
  {code:"de",name:"Germany",capital:"Berlin",region:"Europe",t:"un"},
  {code:"gh",name:"Ghana",capital:"Accra",region:"Africa",t:"un"},
  {code:"gr",name:"Greece",capital:"Athens",region:"Europe",t:"un"},
  {code:"gd",name:"Grenada",capital:"St. George's",region:"Americas",t:"un"},
  {code:"gt",name:"Guatemala",capital:"Guatemala City",region:"Americas",t:"un"},
  {code:"gn",name:"Guinea",capital:"Conakry",region:"Africa",t:"un"},
  {code:"gw",name:"Guinea-Bissau",capital:"Bissau",region:"Africa",t:"un"},
  {code:"gy",name:"Guyana",capital:"Georgetown",region:"Americas",t:"un"},
  {code:"ht",name:"Haiti",capital:"Port-au-Prince",region:"Americas",t:"un"},
  {code:"hn",name:"Honduras",capital:"Tegucigalpa",region:"Americas",t:"un"},
  {code:"hu",name:"Hungary",capital:"Budapest",region:"Europe",t:"un"},
  {code:"is",name:"Iceland",capital:"Reykjavik",region:"Europe",t:"un"},
  {code:"in",name:"India",capital:"New Delhi",region:"Asia",t:"un"},
  {code:"id",name:"Indonesia",capital:"Jakarta",region:"Asia",t:"un"},
  {code:"ir",name:"Iran",capital:"Tehran",region:"Asia",t:"un"},
  {code:"iq",name:"Iraq",capital:"Baghdad",region:"Asia",t:"un"},
  {code:"ie",name:"Ireland",capital:"Dublin",region:"Europe",t:"un"},
  {code:"il",name:"Israel",capital:"Jerusalem",region:"Asia",t:"un"},
  {code:"it",name:"Italy",capital:"Rome",region:"Europe",t:"un"},
  {code:"jm",name:"Jamaica",capital:"Kingston",region:"Americas",t:"un"},
  {code:"jp",name:"Japan",capital:"Tokyo",region:"Asia",t:"un"},
  {code:"jo",name:"Jordan",capital:"Amman",region:"Asia",t:"un"},
  {code:"kz",name:"Kazakhstan",capital:"Astana",region:"Asia",t:"un"},
  {code:"ke",name:"Kenya",capital:"Nairobi",region:"Africa",t:"un"},
  {code:"ki",name:"Kiribati",capital:"Tarawa",region:"Oceania",t:"un"},
  {code:"kp",name:"North Korea",capital:"Pyongyang",region:"Asia",t:"un"},
  {code:"kr",name:"South Korea",capital:"Seoul",region:"Asia",t:"un"},
  {code:"kw",name:"Kuwait",capital:"Kuwait City",region:"Asia",t:"un"},
  {code:"kg",name:"Kyrgyzstan",capital:"Bishkek",region:"Asia",t:"un"},
  {code:"la",name:"Laos",capital:"Vientiane",region:"Asia",t:"un"},
  {code:"lv",name:"Latvia",capital:"Riga",region:"Europe",t:"un"},
  {code:"lb",name:"Lebanon",capital:"Beirut",region:"Asia",t:"un"},
  {code:"ls",name:"Lesotho",capital:"Maseru",region:"Africa",t:"un"},
  {code:"lr",name:"Liberia",capital:"Monrovia",region:"Africa",t:"un"},
  {code:"ly",name:"Libya",capital:"Tripoli",region:"Africa",t:"un"},
  {code:"li",name:"Liechtenstein",capital:"Vaduz",region:"Europe",t:"un"},
  {code:"lt",name:"Lithuania",capital:"Vilnius",region:"Europe",t:"un"},
  {code:"lu",name:"Luxembourg",capital:"Luxembourg City",region:"Europe",t:"un"},
  {code:"mg",name:"Madagascar",capital:"Antananarivo",region:"Africa",t:"un"},
  {code:"mw",name:"Malawi",capital:"Lilongwe",region:"Africa",t:"un"},
  {code:"my",name:"Malaysia",capital:"Kuala Lumpur",region:"Asia",t:"un"},
  {code:"mv",name:"Maldives",capital:"Malé",region:"Asia",t:"un"},
  {code:"ml",name:"Mali",capital:"Bamako",region:"Africa",t:"un"},
  {code:"mt",name:"Malta",capital:"Valletta",region:"Europe",t:"un"},
  {code:"mh",name:"Marshall Islands",capital:"Majuro",region:"Oceania",t:"un"},
  {code:"mr",name:"Mauritania",capital:"Nouakchott",region:"Africa",t:"un"},
  {code:"mu",name:"Mauritius",capital:"Port Louis",region:"Africa",t:"un"},
  {code:"mx",name:"Mexico",capital:"Mexico City",region:"Americas",t:"un"},
  {code:"fm",name:"Micronesia",capital:"Palikir",region:"Oceania",t:"un"},
  {code:"md",name:"Moldova",capital:"Chișinău",region:"Europe",t:"un"},
  {code:"mc",name:"Monaco",capital:"Monaco",region:"Europe",t:"un"},
  {code:"mn",name:"Mongolia",capital:"Ulaanbaatar",region:"Asia",t:"un"},
  {code:"me",name:"Montenegro",capital:"Podgorica",region:"Europe",t:"un"},
  {code:"ma",name:"Morocco",capital:"Rabat",region:"Africa",t:"un"},
  {code:"mz",name:"Mozambique",capital:"Maputo",region:"Africa",t:"un"},
  {code:"mm",name:"Myanmar",capital:"Naypyidaw",region:"Asia",t:"un"},
  {code:"na",name:"Namibia",capital:"Windhoek",region:"Africa",t:"un"},
  {code:"nr",name:"Nauru",capital:"Yaren",region:"Oceania",t:"un"},
  {code:"np",name:"Nepal",capital:"Kathmandu",region:"Asia",t:"un"},
  {code:"nl",name:"Netherlands",capital:"Amsterdam",region:"Europe",t:"un"},
  {code:"nz",name:"New Zealand",capital:"Wellington",region:"Oceania",t:"un"},
  {code:"ni",name:"Nicaragua",capital:"Managua",region:"Americas",t:"un"},
  {code:"ne",name:"Niger",capital:"Niamey",region:"Africa",t:"un"},
  {code:"ng",name:"Nigeria",capital:"Abuja",region:"Africa",t:"un"},
  {code:"mk",name:"North Macedonia",capital:"Skopje",region:"Europe",t:"un"},
  {code:"no",name:"Norway",capital:"Oslo",region:"Europe",t:"un"},
  {code:"om",name:"Oman",capital:"Muscat",region:"Asia",t:"un"},
  {code:"pk",name:"Pakistan",capital:"Islamabad",region:"Asia",t:"un"},
  {code:"pw",name:"Palau",capital:"Ngerulmud",region:"Oceania",t:"un"},
  {code:"pa",name:"Panama",capital:"Panama City",region:"Americas",t:"un"},
  {code:"pg",name:"Papua New Guinea",capital:"Port Moresby",region:"Oceania",t:"un"},
  {code:"py",name:"Paraguay",capital:"Asunción",region:"Americas",t:"un"},
  {code:"pe",name:"Peru",capital:"Lima",region:"Americas",t:"un"},
  {code:"ph",name:"Philippines",capital:"Manila",region:"Asia",t:"un"},
  {code:"pl",name:"Poland",capital:"Warsaw",region:"Europe",t:"un"},
  {code:"pt",name:"Portugal",capital:"Lisbon",region:"Europe",t:"un"},
  {code:"qa",name:"Qatar",capital:"Doha",region:"Asia",t:"un"},
  {code:"ro",name:"Romania",capital:"Bucharest",region:"Europe",t:"un"},
  {code:"ru",name:"Russia",capital:"Moscow",region:"Europe",t:"un"},
  {code:"rw",name:"Rwanda",capital:"Kigali",region:"Africa",t:"un"},
  {code:"kn",name:"Saint Kitts and Nevis",capital:"Basseterre",region:"Americas",t:"un"},
  {code:"lc",name:"Saint Lucia",capital:"Castries",region:"Americas",t:"un"},
  {code:"vc",name:"Saint Vincent and the Grenadines",capital:"Kingstown",region:"Americas",t:"un"},
  {code:"ws",name:"Samoa",capital:"Apia",region:"Oceania",t:"un"},
  {code:"sm",name:"San Marino",capital:"San Marino",region:"Europe",t:"un"},
  {code:"st",name:"São Tomé and Príncipe",capital:"São Tomé",region:"Africa",t:"un"},
  {code:"sa",name:"Saudi Arabia",capital:"Riyadh",region:"Asia",t:"un"},
  {code:"sn",name:"Senegal",capital:"Dakar",region:"Africa",t:"un"},
  {code:"rs",name:"Serbia",capital:"Belgrade",region:"Europe",t:"un"},
  {code:"sc",name:"Seychelles",capital:"Victoria",region:"Africa",t:"un"},
  {code:"sl",name:"Sierra Leone",capital:"Freetown",region:"Africa",t:"un"},
  {code:"sg",name:"Singapore",capital:"Singapore",region:"Asia",t:"un"},
  {code:"sk",name:"Slovakia",capital:"Bratislava",region:"Europe",t:"un"},
  {code:"si",name:"Slovenia",capital:"Ljubljana",region:"Europe",t:"un"},
  {code:"sb",name:"Solomon Islands",capital:"Honiara",region:"Oceania",t:"un"},
  {code:"so",name:"Somalia",capital:"Mogadishu",region:"Africa",t:"un"},
  {code:"za",name:"South Africa",capital:"Pretoria",region:"Africa",t:"un"},
  {code:"ss",name:"South Sudan",capital:"Juba",region:"Africa",t:"un"},
  {code:"es",name:"Spain",capital:"Madrid",region:"Europe",t:"un"},
  {code:"lk",name:"Sri Lanka",capital:"Sri Jayawardenepura Kotte",region:"Asia",t:"un"},
  {code:"sd",name:"Sudan",capital:"Khartoum",region:"Africa",t:"un"},
  {code:"sr",name:"Suriname",capital:"Paramaribo",region:"Americas",t:"un"},
  {code:"se",name:"Sweden",capital:"Stockholm",region:"Europe",t:"un"},
  {code:"ch",name:"Switzerland",capital:"Bern",region:"Europe",t:"un"},
  {code:"sy",name:"Syria",capital:"Damascus",region:"Asia",t:"un"},
  {code:"tj",name:"Tajikistan",capital:"Dushanbe",region:"Asia",t:"un"},
  {code:"tz",name:"Tanzania",capital:"Dodoma",region:"Africa",t:"un"},
  {code:"th",name:"Thailand",capital:"Bangkok",region:"Asia",t:"un"},
  {code:"tl",name:"Timor-Leste",capital:"Dili",region:"Asia",t:"un"},
  {code:"tg",name:"Togo",capital:"Lomé",region:"Africa",t:"un"},
  {code:"to",name:"Tonga",capital:"Nukuʻalofa",region:"Oceania",t:"un"},
  {code:"tt",name:"Trinidad and Tobago",capital:"Port of Spain",region:"Americas",t:"un"},
  {code:"tn",name:"Tunisia",capital:"Tunis",region:"Africa",t:"un"},
  {code:"tr",name:"Turkey",capital:"Ankara",region:"Asia",t:"un"},
  {code:"tm",name:"Turkmenistan",capital:"Ashgabat",region:"Asia",t:"un"},
  {code:"tv",name:"Tuvalu",capital:"Funafuti",region:"Oceania",t:"un"},
  {code:"ug",name:"Uganda",capital:"Kampala",region:"Africa",t:"un"},
  {code:"ua",name:"Ukraine",capital:"Kyiv",region:"Europe",t:"un"},
  {code:"ae",name:"United Arab Emirates",capital:"Abu Dhabi",region:"Asia",t:"un"},
  {code:"gb",name:"United Kingdom",capital:"London",region:"Europe",t:"un"},
  {code:"us",name:"United States",capital:"Washington, D.C.",region:"Americas",t:"un"},
  {code:"uy",name:"Uruguay",capital:"Montevideo",region:"Americas",t:"un"},
  {code:"uz",name:"Uzbekistan",capital:"Tashkent",region:"Asia",t:"un"},
  {code:"vu",name:"Vanuatu",capital:"Port Vila",region:"Oceania",t:"un"},
  {code:"ve",name:"Venezuela",capital:"Caracas",region:"Americas",t:"un"},
  {code:"vn",name:"Vietnam",capital:"Hanoi",region:"Asia",t:"un"},
  {code:"ye",name:"Yemen",capital:"Sana'a",region:"Asia",t:"un"},
  {code:"zm",name:"Zambia",capital:"Lusaka",region:"Africa",t:"un"},
  {code:"zw",name:"Zimbabwe",capital:"Harare",region:"Africa",t:"un"},
  // Observers
  {code:"va",name:"Vatican City",capital:"Vatican City",region:"Europe",t:"obs"},
  {code:"ps",name:"Palestine",capital:"Ramallah",region:"Asia",t:"obs"},
  // Disputed / partially recognized
  {code:"xk",name:"Kosovo",capital:"Pristina",region:"Europe",t:"dis"},
  {code:"tw",name:"Taiwan",capital:"Taipei",region:"Asia",t:"dis"},
];

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];
const SCOPES = [
  { value: "un", label: "UN (193)" },
  { value: "sovereign", label: "Sovereign (197)" },
];

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
    "dc":"washingtondc","washingtondc":"washingtondc","washington":"washingtondc",
    "kotte":"srijayawardenepurakotte","srijayawardenepura":"srijayawardenepurakotte",
    "nukualofa":"nukualofa",
    "chisinau":"chisinau","kishinev":"chisinau",
    "kyiv":"kyiv","kiev":"kyiv",
    "peking":"beijing",
    "bombay":"mumbai",
    "calcutta":"kolkata",
    "saigon":"hochiminhcity",
    "rangoon":"naypyidaw",
    "saintjohns":"stjohns","stjohns":"stjohns",
    "saintgeorges":"stgeorges","stgeorges":"stgeorges",
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

export default function CapitalsGame() {
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
  const [missed, setMissed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const timeRef = useRef(0);
  const inputRef = useRef(null);

  const pool = useMemo(() => {
    const scopeTypes = scope === "un" ? ["un"] : ["un", "obs", "dis"];
    let filtered = COUNTRIES.filter(c => scopeTypes.includes(c.t));
    if (region !== "All") filtered = filtered.filter(c => c.region === region);
    return filtered;
  }, [region, scope]);
  const totalAvailable = pool.length;
  const raceOptions = useMemo(() => { const opts = [10,20,25,50,100].filter(n => n <= totalAvailable); if (!opts.includes(totalAvailable)) opts.push(totalAvailable); return [...new Set(opts)]; }, [totalAvailable]);

  useEffect(() => { if (raceCount > totalAvailable) setRaceCount(Math.min(20, totalAvailable)); }, [totalAvailable]);

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
    setMissed([]); setGameOver(false); setTimerKey(k => k + 1);
    setTimerRunning(true); setScreen("playing");
  };

  const handleAnswer = (selectedCode) => {
    if (answered !== null) return;
    const q = questions[qIndex];
    const isCorrect = selectedCode === q.country.code;
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) { setCorrect(c => c + 1); setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; }); }
    else { setMistakes(m => m + 1); setStreak(0); setMissed(prev => [...prev, { ...q.country, yourAnswer: selectedCode }]); }
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
      const target = reverse ? q.country.name : q.country.capital;
      handleAnswer(fuzzyMatch(typedAnswer, target) ? q.country.code : "__wrong__");
    }
  };

  const finishRound = (finalCorrect, finalMistakes) => {
    setGameOver(true);
    setResults(prev => [...prev, { player: playerNames[currentPlayerIdx], correct: finalCorrect, mistakes: finalMistakes, time: timeRef.current, bestStreak: Math.max(bestStreak, streak + (answered === "correct" ? 1 : 0)), missed: [...missed], exited: false }]);
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
      missed: [...missed],
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
        <div style={styles.title}>Capitolium</div>
        <div style={styles.subtitle}>{COUNTRIES.length} countries & capitals</div>
        <div style={{ ...styles.card, marginBottom: "16px" }}>
          <div style={styles.label}>Game Mode</div>
          <SegmentedControl options={[{ value: "race", label: "Race" }, { value: "survival", label: "Survival" }]} value={mode} onChange={setMode} />
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "8px" }}>{mode === "race" ? "Answer a set number of capitals as fast as possible." : "How many can you get right? Three strikes and you're out."}</div>
        </div>
        <div style={{ ...styles.card, marginBottom: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={styles.label}>Input Method</div>
              <SegmentedControl options={[{ value: "choice", label: "Multiple Choice" }, { value: "type", label: "Type" }]} value={inputType} onChange={setInputType} />
            </div>
            <div>
              <div style={styles.label}>Scope</div>
              <SegmentedControl options={SCOPES} value={scope} onChange={setScope} />
            </div>
            <div>
              <div style={styles.label}>Region</div>
              <select style={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map(r => {
                  const scopeTypes = scope === "un" ? ["un"] : ["un","obs","dis"];
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
              <SegmentedControl options={[{ value: false, label: "Country → Capital" }, { value: true, label: "Capital → Country" }]} value={reverse} onChange={setReverse} />
            </div>
          </div>
          {mode === "race" && (
            <div style={{ marginTop: "20px" }}>
              <div style={styles.label}>Number of Questions ({totalAvailable} available)</div>
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
                <div style={{ fontSize: "28px", fontWeight: 100, letterSpacing: "2px", marginBottom: "28px", color: C.white }}>{currentQ.country.name}</div>
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: C.textDim, marginBottom: "20px" }}>What is the capital?</div>
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
                        >{opt.capital}</button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <input ref={inputRef} style={{ ...styles.input, borderBottomColor: answered === "correct" ? C.green : answered === "wrong" ? C.red : "#333" }}
                      value={typedAnswer} onChange={(e) => setTypedAnswer(e.target.value)} onKeyDown={handleType} placeholder="Type the capital..." autoFocus disabled={answered !== null} />
                    {answered === "wrong" && <div style={{ marginTop: "8px", fontSize: "13px", color: C.red }}>{currentQ.country.capital}</div>}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: "28px", fontWeight: 100, letterSpacing: "2px", marginBottom: "28px", color: C.white }}>{currentQ.country.capital}</div>
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: C.textDim, marginBottom: "20px" }}>What country is this the capital of?</div>
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
                      value={typedAnswer} onChange={(e) => setTypedAnswer(e.target.value)} onKeyDown={handleType} placeholder="Type the country..." autoFocus disabled={answered !== null} />
                    {answered === "wrong" && <div style={{ marginTop: "8px", fontSize: "13px", color: C.red }}>{currentQ.country.name}</div>}
                  </div>
                )}
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
            <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px" }}>All {totalAvailable} capitals — zero mistakes</div>
          </div>
        )}
        <div style={styles.title}>Results</div>
        <div style={{ ...styles.subtitle, marginBottom: "24px" }}>
          {mode === "race" ? `Race — ${raceCount} capitals` : "Survival — 3 strikes"} · {region === "All" ? "World" : region}{reverse ? " · Reverse" : ""} · {inputType === "choice" ? `${numChoices} choices` : "Typed"}
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
            {r.missed.length > 0 && (
              <div style={{ marginTop: "20px", borderTop: `1px solid ${C.cardBorder}`, paddingTop: "16px" }}>
                <div style={{ ...styles.label, marginBottom: "12px" }}>Missed</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {r.missed.map((m, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.redBg, borderRadius: "2px", fontSize: "13px" }}>
                      <span style={{ color: C.text }}>{m.name}</span>
                      <span style={{ color: C.textMuted }}>{m.capital}</span>
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
