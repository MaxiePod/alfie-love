import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getCurrentUser, setCurrentUser, loadProgress, saveProgress, applyAnswer, getMasteredBatches, loadCustomCardsForDeck, saveCustomCardsForDeck, getDeckId, MASTERY_THRESHOLD, BATCH_SIZE } from "../progress";
import { fetchDefinition } from "../dictionary";

const WORDS = [
  {w:"Benevolent",d:"Well-meaning and kindly",pos:"adj",t:"easy",syn:["kind","generous","charitable","compassionate","caring","good-hearted","altruistic","philanthropic","warm"]},
  {w:"Candid",d:"Truthful and straightforward",pos:"adj",t:"easy",syn:["honest","frank","direct","open","blunt","sincere","upfront","forthright"]},
  {w:"Diligent",d:"Showing careful and persistent effort",pos:"adj",t:"easy",syn:["hardworking","industrious","thorough","meticulous","dedicated","conscientious","persistent","tireless"]},
  {w:"Eloquent",d:"Fluent or persuasive in speaking",pos:"adj",t:"easy",syn:["articulate","well-spoken","expressive","persuasive","fluent","silver-tongued","powerful"]},
  {w:"Frugal",d:"Sparing or economical with money",pos:"adj",t:"easy",syn:["thrifty","economical","cheap","stingy","penny-pinching","careful","sparing","tight"]},
  {w:"Gratitude",d:"The quality of being thankful",pos:"n",t:"easy",syn:["thankfulness","appreciation","gratefulness","thanks","recognition"]},
  {w:"Harmony",d:"Agreement or peaceful coexistence",pos:"n",t:"easy",syn:["peace","accord","agreement","unity","balance","cooperation","concord"]},
  {w:"Impartial",d:"Treating all rivals or sides equally",pos:"adj",t:"easy",syn:["unbiased","fair","neutral","objective","even-handed","balanced","just","disinterested"]},
  {w:"Jubilant",d:"Feeling or expressing great happiness",pos:"adj",t:"easy",syn:["joyful","ecstatic","elated","overjoyed","thrilled","happy","exultant","triumphant","delighted"]},
  {w:"Keen",d:"Eager or enthusiastic",pos:"adj",t:"easy",syn:["eager","enthusiastic","excited","passionate","avid","fervent","zealous","sharp"]},
  {w:"Lament",d:"To express sorrow or grief",pos:"v",t:"easy",syn:["mourn","grieve","weep","cry","bewail","bemoan","sorrow","wail"]},
  {w:"Modest",d:"Unassuming in estimation of abilities",pos:"adj",t:"easy",syn:["humble","unassuming","unpretentious","reserved","shy","meek","self-effacing"]},
  {w:"Novice",d:"A person new to a field or activity",pos:"n",t:"easy",syn:["beginner","newcomer","amateur","rookie","newbie","learner","apprentice","neophyte"]},
  {w:"Ominous",d:"Giving the impression something bad will happen",pos:"adj",t:"easy",syn:["threatening","menacing","sinister","foreboding","dark","gloomy","dire","portentous"]},
  {w:"Prudent",d:"Acting with care and thought for the future",pos:"adj",t:"easy",syn:["careful","cautious","wise","sensible","judicious","shrewd","thoughtful","circumspect"]},
  {w:"Resilient",d:"Able to recover quickly from difficulties",pos:"adj",t:"easy",syn:["tough","strong","hardy","adaptable","flexible","bouncing back","durable","sturdy"]},
  {w:"Serene",d:"Calm, peaceful, and untroubled",pos:"adj",t:"easy",syn:["calm","peaceful","tranquil","placid","quiet","relaxed","composed","still"]},
  {w:"Trivial",d:"Of little value or importance",pos:"adj",t:"easy",syn:["unimportant","insignificant","minor","petty","small","trifling","negligible","meaningless"]},
  {w:"Vivid",d:"Producing powerful images in the mind",pos:"adj",t:"easy",syn:["bright","colorful","striking","graphic","clear","intense","vibrant","lifelike"]},
  {w:"Wary",d:"Feeling cautious about possible dangers",pos:"adj",t:"easy",syn:["cautious","careful","watchful","alert","guarded","suspicious","leery","vigilant"]},
  {w:"Zeal",d:"Great energy or enthusiasm for a cause",pos:"n",t:"easy",syn:["passion","enthusiasm","fervor","eagerness","devotion","ardor","drive","dedication"]},
  {w:"Amiable",d:"Having a friendly and pleasant manner",pos:"adj",t:"easy",syn:["friendly","pleasant","likable","agreeable","warm","genial","good-natured","affable"]},
  {w:"Bliss",d:"Supreme happiness or great joy",pos:"n",t:"easy",syn:["happiness","joy","ecstasy","delight","euphoria","rapture","elation","heaven"]},
  {w:"Concise",d:"Giving information clearly and briefly",pos:"adj",t:"easy",syn:["brief","short","succinct","terse","compact","to the point","pithy","condensed"]},
  {w:"Deter",d:"To discourage someone from doing something",pos:"v",t:"easy",syn:["discourage","prevent","dissuade","stop","inhibit","scare off","put off","ward off"]},
  {w:"Elated",d:"Extremely happy and excited",pos:"adj",t:"easy",syn:["thrilled","overjoyed","ecstatic","jubilant","happy","delighted","euphoric","exhilarated"]},
  {w:"Fickle",d:"Changing frequently in loyalty or affection",pos:"adj",t:"easy",syn:["changeable","inconsistent","unpredictable","unreliable","capricious","flighty","unstable","volatile"]},
  {w:"Gist",d:"The main point or substance of a matter",pos:"n",t:"easy",syn:["essence","core","point","crux","gist","summary","substance","heart","nub"]},
  {w:"Hinder",d:"To create difficulties or delay progress",pos:"v",t:"easy",syn:["obstruct","block","impede","hamper","delay","slow","prevent","hold back","inhibit"]},
  {w:"Impede",d:"To delay or prevent by obstructing",pos:"v",t:"easy",syn:["hinder","block","obstruct","hamper","slow","delay","prevent","restrict","thwart"]},
  {w:"Lucid",d:"Expressed clearly and easy to understand",pos:"adj",t:"easy",syn:["clear","understandable","coherent","plain","transparent","intelligible","comprehensible","articulate"]},
  {w:"Mundane",d:"Lacking interest or excitement; dull",pos:"adj",t:"easy",syn:["boring","dull","ordinary","tedious","humdrum","routine","everyday","unexciting","banal"]},
  {w:"Nurture",d:"To care for and encourage growth",pos:"v",t:"easy",syn:["care for","nourish","foster","raise","cultivate","support","develop","tend","encourage"]},
  {w:"Obscure",d:"Not well known or hard to understand",pos:"adj",t:"easy",syn:["unknown","unclear","vague","hidden","mysterious","ambiguous","cryptic","arcane","esoteric"]},
  {w:"Plausible",d:"Seeming reasonable or probable",pos:"adj",t:"easy",syn:["believable","credible","reasonable","likely","possible","convincing","probable","feasible"]},
  {w:"Robust",d:"Strong, healthy, and vigorous",pos:"adj",t:"easy",syn:["strong","sturdy","healthy","vigorous","tough","hardy","powerful","solid","muscular"]},
  {w:"Subtle",d:"Fine or delicate; not immediately obvious",pos:"adj",t:"easy",syn:["slight","faint","delicate","understated","nuanced","fine","indirect","elusive"]},
  {w:"Thrive",d:"To grow or develop well; to prosper",pos:"v",t:"easy",syn:["flourish","prosper","bloom","succeed","grow","boom","blossom","do well"]},
  {w:"Abate",d:"To become less intense or widespread",pos:"v",t:"easy",syn:["decrease","diminish","lessen","subside","reduce","weaken","fade","decline","ease"]},
  {w:"Banal",d:"So lacking in originality as to be obvious",pos:"adj",t:"easy",syn:["trite","cliche","unoriginal","boring","dull","hackneyed","commonplace","stale","predictable"]},
  {w:"Comply",d:"To act in accordance with a wish or command",pos:"v",t:"easy",syn:["obey","follow","conform","adhere","submit","agree","abide","respect"]},
  {w:"Demean",d:"To cause a loss of dignity and respect",pos:"v",t:"easy",syn:["degrade","humiliate","belittle","lower","debase","shame","disgrace","diminish","disrespect"]},
  {w:"Erratic",d:"Not even or regular in pattern",pos:"adj",t:"easy",syn:["unpredictable","irregular","inconsistent","unstable","random","volatile","unsteady","sporadic"]},
  {w:"Feasible",d:"Possible to do easily or conveniently",pos:"adj",t:"easy",syn:["possible","doable","practical","achievable","realistic","viable","workable","attainable"]},
  {w:"Gullible",d:"Easily persuaded to believe something",pos:"adj",t:"easy",syn:["naive","trusting","credulous","innocent","unsuspecting","foolish","impressionable","susceptible"]},
  {w:"Haughty",d:"Arrogantly superior and disdainful",pos:"adj",t:"easy",syn:["arrogant","proud","snobbish","conceited","condescending","superior","stuck-up","pompous","disdainful"]},
  {w:"Innate",d:"Inborn; natural rather than learned",pos:"adj",t:"easy",syn:["natural","inborn","inherent","instinctive","native","built-in","intrinsic","congenital"]},
  {w:"Jovial",d:"Cheerful and friendly",pos:"adj",t:"easy",syn:["cheerful","friendly","jolly","merry","happy","upbeat","good-humored","buoyant","genial"]},
  {w:"Lavish",d:"Sumptuously rich or elaborate",pos:"adj",t:"easy",syn:["extravagant","luxurious","opulent","generous","elaborate","rich","grand","excessive","plush"]},
  {w:"Meager",d:"Lacking in quantity or quality",pos:"adj",t:"easy",syn:["scarce","small","insufficient","sparse","poor","paltry","skimpy","thin","scanty"]},
  {w:"Notable",d:"Worthy of attention; remarkable",pos:"adj",t:"easy",syn:["remarkable","noteworthy","important","significant","famous","distinguished","prominent","outstanding"]},
  {w:"Ample",d:"Enough or more than enough; plentiful",pos:"adj",t:"easy",syn:["plenty","sufficient","abundant","generous","large","substantial","plentiful","copious"]},
  {w:"Berate",d:"To scold or criticize someone angrily",pos:"v",t:"easy",syn:["scold","criticize","reprimand","rebuke","chastise","yell at","tell off","upbraid","lambaste"]},
  {w:"Candor",d:"The quality of being open and honest",pos:"n",t:"easy",syn:["honesty","openness","frankness","sincerity","directness","truthfulness","bluntness","transparency"]},
  {w:"Deviate",d:"To depart from an established course",pos:"v",t:"easy",syn:["diverge","stray","depart","veer","wander","differ","digress","swerve"]},
  {w:"Endorse",d:"To declare public approval or support of",pos:"v",t:"easy",syn:["support","approve","back","advocate","recommend","promote","sanction","champion"]},
  {w:"Futile",d:"Incapable of producing any useful result",pos:"adj",t:"easy",syn:["useless","pointless","hopeless","vain","fruitless","ineffective","unsuccessful","worthless"]},
  {w:"Grim",d:"Very serious or gloomy",pos:"adj",t:"easy",syn:["serious","gloomy","somber","bleak","dark","stern","grave","harsh","dismal","dreary"]},
  {w:"Hostility",d:"Unfriendly or antagonistic behavior",pos:"n",t:"easy",syn:["aggression","anger","animosity","antagonism","hatred","enmity","ill will","opposition","malice"]},
  {w:"Ironic",d:"Happening opposite to what is expected",pos:"adj",t:"easy",syn:["paradoxical","unexpected","contradictory","sardonic","sarcastic","satirical","wry"]},
  {w:"Aberration",d:"A departure from what is normal or expected",pos:"n",t:"med",syn:["anomaly","deviation","irregularity","oddity","exception","abnormality","freak","quirk"]},
  {w:"Bolster",d:"To support or strengthen",pos:"v",t:"med",syn:["support","strengthen","reinforce","boost","prop up","shore up","buttress","fortify"]},
  {w:"Cacophony",d:"A harsh discordant mixture of sounds",pos:"n",t:"med",syn:["noise","din","racket","discord","clamor","dissonance","commotion"]},
  {w:"Debilitate",d:"To make someone weak or infirm",pos:"v",t:"med",syn:["weaken","enfeeble","exhaust","drain","sap","incapacitate","cripple","impair"]},
  {w:"Ephemeral",d:"Lasting for a very short time",pos:"adj",t:"med",syn:["fleeting","temporary","brief","short-lived","transient","momentary","passing","transitory"]},
  {w:"Fervent",d:"Having or displaying passionate intensity",pos:"adj",t:"med",syn:["passionate","intense","zealous","ardent","eager","enthusiastic","fiery","impassioned"]},
  {w:"Galvanize",d:"To shock or excite into taking action",pos:"v",t:"med",syn:["motivate","inspire","spur","stimulate","energize","rouse","electrify","provoke","catalyze"]},
  {w:"Harbinger",d:"A person or thing announcing the approach of another",pos:"n",t:"med",syn:["herald","sign","omen","forerunner","precursor","signal","indicator","messenger"]},
  {w:"Idiosyncrasy",d:"A distinctive or peculiar individual behavior",pos:"n",t:"med",syn:["quirk","peculiarity","eccentricity","oddity","habit","trait","mannerism","characteristic"]},
  {w:"Juxtapose",d:"To place close together for contrast",pos:"v",t:"med",syn:["compare","contrast","place side by side","set against","pair"]},
  {w:"Kindle",d:"To arouse or inspire an emotion or feeling",pos:"v",t:"med",syn:["ignite","spark","arouse","inspire","stir","awaken","provoke","stimulate","light"]},
  {w:"Lethargy",d:"A lack of energy and enthusiasm",pos:"n",t:"med",syn:["tiredness","fatigue","sluggishness","laziness","drowsiness","apathy","inertia","torpor","listlessness"]},
  {w:"Meticulous",d:"Showing great attention to detail",pos:"adj",t:"med",syn:["careful","thorough","precise","detailed","exacting","painstaking","scrupulous","fastidious"]},
  {w:"Nonchalant",d:"Appearing casually calm and relaxed",pos:"adj",t:"med",syn:["casual","cool","indifferent","unconcerned","laid-back","carefree","relaxed","unbothered"]},
  {w:"Ostentatious",d:"Designed to impress; showy",pos:"adj",t:"med",syn:["showy","flashy","gaudy","pretentious","flamboyant","extravagant","garish","pompous","over the top"]},
  {w:"Paradox",d:"A seemingly contradictory statement that may be true",pos:"n",t:"med",syn:["contradiction","puzzle","enigma","riddle","anomaly","inconsistency","irony","oxymoron"]},
  {w:"Quandary",d:"A state of uncertainty or perplexity",pos:"n",t:"med",syn:["dilemma","predicament","problem","difficulty","bind","pickle","plight","puzzle","conundrum"]},
  {w:"Recluse",d:"A person who lives in seclusion",pos:"n",t:"med",syn:["hermit","loner","introvert","isolationist","shut-in","solitary"]},
  {w:"Scrutinize",d:"To examine or inspect closely and thoroughly",pos:"v",t:"med",syn:["examine","inspect","study","analyze","review","investigate","observe","survey","probe"]},
  {w:"Tangible",d:"Clear and definite; able to be touched",pos:"adj",t:"med",syn:["physical","real","concrete","solid","palpable","material","touchable","actual","perceptible"]},
  {w:"Ubiquitous",d:"Present, appearing, or found everywhere",pos:"adj",t:"med",syn:["everywhere","omnipresent","universal","pervasive","widespread","common","prevalent"]},
  {w:"Vindicate",d:"To clear of accusation or blame",pos:"v",t:"med",syn:["exonerate","clear","absolve","justify","acquit","defend","prove right","support"]},
  {w:"Wistful",d:"Having a feeling of vague longing",pos:"adj",t:"med",syn:["longing","yearning","nostalgic","pensive","melancholy","dreamy","reflective","sad"]},
  {w:"Alleviate",d:"To make suffering less severe",pos:"v",t:"med",syn:["relieve","ease","reduce","lessen","soothe","diminish","lighten","mitigate"]},
  {w:"Brevity",d:"Concise and exact use of words",pos:"n",t:"med",syn:["shortness","briefness","conciseness","succinctness","terseness","economy"]},
  {w:"Complacent",d:"Smug and uncritically satisfied",pos:"adj",t:"med",syn:["smug","self-satisfied","content","lazy","overconfident","unconcerned","satisfied"]},
  {w:"Disparage",d:"To regard as being of little worth",pos:"v",t:"med",syn:["belittle","criticize","demean","mock","denigrate","undervalue","diminish","put down","deride"]},
  {w:"Fluctuate",d:"To rise and fall irregularly",pos:"v",t:"med",syn:["vary","change","shift","oscillate","swing","waver","alternate","seesaw"]},
  {w:"Gratuitous",d:"Uncalled for; lacking good reason",pos:"adj",t:"med",syn:["unnecessary","unwarranted","unjustified","needless","excessive","unprovoked","baseless","free"]},
  {w:"Hypothesis",d:"A proposed explanation with limited evidence",pos:"n",t:"med",syn:["theory","guess","assumption","proposition","thesis","conjecture","supposition","speculation"]},
  {w:"Malleable",d:"Easily influenced or shaped",pos:"adj",t:"med",syn:["flexible","pliable","moldable","adaptable","impressionable","compliant","yielding","soft"]},
  {w:"Nostalgic",d:"Feeling longing for things of the past",pos:"adj",t:"med",syn:["sentimental","wistful","longing","homesick","reminiscent","yearning"]},
  {w:"Orthodox",d:"Conforming to traditional beliefs or practices",pos:"adj",t:"med",syn:["traditional","conventional","conservative","standard","established","mainstream","conformist"]},
  {w:"Pragmatic",d:"Dealing with things in a practical way",pos:"adj",t:"med",syn:["practical","realistic","sensible","logical","down-to-earth","matter-of-fact","rational"]},
  {w:"Repudiate",d:"To refuse to accept or be associated with",pos:"v",t:"med",syn:["reject","deny","disown","renounce","disavow","refuse","abandon","disclaim"]},
  {w:"Superfluous",d:"More than what is needed; unnecessary",pos:"adj",t:"med",syn:["unnecessary","excess","extra","redundant","unneeded","surplus","excessive","spare"]},
  {w:"Tenacious",d:"Holding firmly to something; persistent",pos:"adj",t:"med",syn:["persistent","determined","stubborn","resolute","dogged","relentless","steadfast","unyielding"]},
  {w:"Verbose",d:"Using or expressed in more words than needed",pos:"adj",t:"med",syn:["wordy","long-winded","rambling","talkative","garrulous","loquacious","prolix","overlong"]},
  {w:"Ambivalent",d:"Having mixed feelings about something",pos:"adj",t:"med",syn:["uncertain","undecided","torn","conflicted","unsure","hesitant","mixed","indecisive"]},
  {w:"Benign",d:"Gentle and kindly; not harmful",pos:"adj",t:"med",syn:["harmless","gentle","kind","mild","innocent","safe","nonthreatening","favorable"]},
  {w:"Catalyst",d:"A person or thing that causes change",pos:"n",t:"med",syn:["trigger","spark","stimulus","cause","driver","impetus","agent","spur"]},
  {w:"Disdain",d:"A feeling that someone is unworthy of respect",pos:"n",t:"med",syn:["contempt","scorn","disrespect","derision","arrogance","disregard","loathing","sneering"]},
  {w:"Exacerbate",d:"To make a problem or situation worse",pos:"v",t:"med",syn:["worsen","aggravate","intensify","inflame","escalate","compound","heighten"]},
  {w:"Forlorn",d:"Pitifully sad and abandoned or lonely",pos:"adj",t:"med",syn:["sad","lonely","miserable","dejected","hopeless","desolate","wretched","despondent","abandoned"]},
  {w:"Gregarious",d:"Fond of company; sociable",pos:"adj",t:"med",syn:["sociable","outgoing","friendly","social","extroverted","convivial","companionable"]},
  {w:"Heresy",d:"Belief or opinion contrary to orthodox doctrine",pos:"n",t:"med",syn:["blasphemy","dissent","unorthodoxy","sacrilege","apostasy","nonconformity"]},
  {w:"Impervious",d:"Unable to be affected or disturbed",pos:"adj",t:"med",syn:["immune","resistant","unaffected","invulnerable","impenetrable","insensitive","proof against"]},
  {w:"Languish",d:"To lose or lack vitality; to grow weak",pos:"v",t:"med",syn:["weaken","wilt","decline","fade","deteriorate","wither","suffer","stagnate","droop"]},
  {w:"Mitigate",d:"To make less severe or serious",pos:"v",t:"med",syn:["reduce","lessen","ease","alleviate","diminish","moderate","soften","temper"]},
  {w:"Nuance",d:"A subtle difference in meaning or expression",pos:"n",t:"med",syn:["subtlety","distinction","shade","refinement","detail","gradation","nicety","variation"]},
  {w:"Preclude",d:"To prevent from happening; to make impossible",pos:"v",t:"med",syn:["prevent","stop","rule out","exclude","prohibit","block","forestall","bar"]},
  {w:"Querulous",d:"Complaining in a whining manner",pos:"adj",t:"med",syn:["whiny","complaining","grumbling","petulant","fretful","peevish","cranky","grouchy"]},
  {w:"Reverence",d:"Deep respect for someone or something",pos:"n",t:"med",syn:["respect","admiration","awe","honor","veneration","devotion","esteem","worship"]},
  {w:"Stoic",d:"Enduring pain without showing feelings",pos:"adj",t:"med",syn:["unemotional","calm","composed","unflinching","impassive","patient","resigned","unfeeling"]},
  {w:"Transient",d:"Lasting only for a short time",pos:"adj",t:"med",syn:["temporary","fleeting","brief","short-lived","passing","momentary","ephemeral","impermanent"]},
  {w:"Unequivocal",d:"Leaving no doubt; unambiguous",pos:"adj",t:"med",syn:["clear","definite","absolute","certain","unmistakable","decisive","unambiguous","explicit"]},
  {w:"Venerate",d:"To regard with great respect",pos:"v",t:"med",syn:["respect","revere","admire","honor","worship","esteem","idolize","exalt"]},
  {w:"Aesthetic",d:"Concerned with beauty or art appreciation",pos:"adj",t:"med",syn:["artistic","beautiful","visual","stylistic","decorative","tasteful","pleasing"]},
  {w:"Conundrum",d:"A confusing and difficult problem or question",pos:"n",t:"med",syn:["puzzle","riddle","mystery","dilemma","enigma","problem","quandary"]},
  {w:"Dogmatic",d:"Inclined to lay down principles as true",pos:"adj",t:"med",syn:["opinionated","stubborn","rigid","inflexible","authoritarian","assertive","doctrinaire","dictatorial"]},
  {w:"Empirical",d:"Based on observation rather than theory",pos:"adj",t:"med",syn:["observed","experimental","practical","evidence-based","factual","measured","scientific"]},
  {w:"Frivolous",d:"Not having any serious purpose or value",pos:"adj",t:"med",syn:["silly","trivial","petty","unimportant","superficial","flippant","lighthearted","pointless"]},
  {w:"Hedonist",d:"A person who pursues pleasure above all else",pos:"n",t:"med",syn:["pleasure-seeker","sensualist","bon vivant","epicurean","sybarite","indulgent"]},
  {w:"Inquisitive",d:"Curious or inquiring",pos:"adj",t:"med",syn:["curious","nosy","questioning","probing","inquiring","prying","interested","investigative"]},
  {w:"Judiciously",d:"With good judgment or sense",pos:"adv",t:"med",syn:["wisely","carefully","sensibly","prudently","shrewdly","thoughtfully","smartly"]},
  {w:"Laud",d:"To praise someone or something highly",pos:"v",t:"med",syn:["praise","applaud","commend","celebrate","honor","extol","acclaim","glorify","exalt"]},
  {w:"Maverick",d:"An independent-minded person",pos:"n",t:"med",syn:["rebel","nonconformist","individualist","free spirit","dissenter","loner","renegade"]},
  {w:"Negate",d:"To nullify or make ineffective",pos:"v",t:"med",syn:["cancel","nullify","void","undo","invalidate","counteract","deny","reverse","neutralize"]},
  {w:"Penchant",d:"A strong habitual liking for something",pos:"n",t:"med",syn:["fondness","liking","preference","taste","inclination","tendency","affinity","weakness"]},
  {w:"Refute",d:"To prove a statement or theory to be wrong",pos:"v",t:"med",syn:["disprove","deny","counter","rebut","contradict","debunk","discredit","challenge"]},
  {w:"Abnegate",d:"To renounce or reject something",pos:"v",t:"hard",syn:["renounce","reject","give up","surrender","abandon","relinquish","deny","forgo","sacrifice"]},
  {w:"Bellicose",d:"Demonstrating aggression and willingness to fight",pos:"adj",t:"hard",syn:["aggressive","hostile","warlike","combative","belligerent","pugnacious","militant","confrontational"]},
  {w:"Capitulate",d:"To cease to resist an opponent; to surrender",pos:"v",t:"hard",syn:["surrender","yield","give in","submit","concede","relent","cave","acquiesce"]},
  {w:"Deleterious",d:"Causing harm or damage",pos:"adj",t:"hard",syn:["harmful","damaging","destructive","detrimental","injurious","bad","toxic","noxious","hurtful"]},
  {w:"Enervate",d:"To cause someone to feel drained of energy",pos:"v",t:"hard",syn:["exhaust","drain","tire","weaken","fatigue","sap","debilitate","deplete"]},
  {w:"Fastidious",d:"Very attentive to accuracy and detail",pos:"adj",t:"hard",syn:["meticulous","particular","picky","fussy","finicky","precise","exacting","scrupulous","perfectionist"]},
  {w:"Grandiloquent",d:"Pompous or extravagant in language or style",pos:"adj",t:"hard",syn:["pompous","bombastic","pretentious","verbose","flowery","overblown","inflated","grandiose"]},
  {w:"Hegemony",d:"Dominance of one group over others",pos:"n",t:"hard",syn:["dominance","supremacy","control","leadership","authority","power","rule","dominion"]},
  {w:"Iconoclast",d:"A person who attacks cherished beliefs",pos:"n",t:"hard",syn:["rebel","nonconformist","dissenter","critic","radical","heretic","skeptic"]},
  {w:"Laconic",d:"Using very few words; terse",pos:"adj",t:"hard",syn:["brief","concise","short","terse","curt","succinct","pithy","taciturn"]},
  {w:"Malfeasance",d:"Wrongdoing, especially by a public official",pos:"n",t:"hard",syn:["misconduct","wrongdoing","corruption","crime","misbehavior","abuse of power","malpractice"]},
  {w:"Nefarious",d:"Wicked or criminal in nature",pos:"adj",t:"hard",syn:["wicked","evil","villainous","criminal","vile","sinister","malicious","heinous","corrupt"]},
  {w:"Obsequious",d:"Excessively obedient or attentive; servile",pos:"adj",t:"hard",syn:["servile","submissive","fawning","groveling","sycophantic","subservient","bootlicking","flattering"]},
  {w:"Perfunctory",d:"Carried out with little effort or reflection",pos:"adj",t:"hard",syn:["cursory","superficial","halfhearted","careless","mechanical","routine","negligent","hasty"]},
  {w:"Recalcitrant",d:"Having an obstinately uncooperative attitude",pos:"adj",t:"hard",syn:["stubborn","defiant","uncooperative","rebellious","resistant","disobedient","obstinate","intractable"]},
  {w:"Sycophant",d:"A person who flatters someone important",pos:"n",t:"hard",syn:["flatterer","bootlicker","brown-noser","yes-man","toady","kiss-up","lackey","fawner"]},
  {w:"Truculent",d:"Eager or quick to argue or fight",pos:"adj",t:"hard",syn:["aggressive","hostile","combative","belligerent","confrontational","defiant","fierce","pugnacious"]},
  {w:"Unconscionable",d:"Not right or reasonable; excessive",pos:"adj",t:"hard",syn:["unreasonable","outrageous","unjust","excessive","immoral","unethical","unfair","inexcusable"]},
  {w:"Vacillate",d:"To alternate between opinions; to waver",pos:"v",t:"hard",syn:["hesitate","waver","fluctuate","dither","oscillate","seesaw","waffle","equivocate"]},
  {w:"Acrimonious",d:"Angry and bitter in tone or manner",pos:"adj",t:"hard",syn:["bitter","hostile","angry","resentful","harsh","caustic","venomous","spiteful","nasty"]},
  {w:"Bombastic",d:"High-sounding language with little meaning",pos:"adj",t:"hard",syn:["pompous","pretentious","grandiose","overblown","inflated","grandiloquent","verbose","flowery"]},
  {w:"Chicanery",d:"The use of trickery to achieve an end",pos:"n",t:"hard",syn:["trickery","deception","fraud","deceit","dishonesty","scheming","manipulation","subterfuge"]},
  {w:"Didactic",d:"Intended to teach a moral lesson",pos:"adj",t:"hard",syn:["instructive","educational","preachy","moralistic","pedagogical","informative","teacherly"]},
  {w:"Equivocate",d:"To use ambiguous language to conceal truth",pos:"v",t:"hard",syn:["hedge","evade","dodge","prevaricate","waffle","mislead","be vague","sidestep"]},
  {w:"Furtive",d:"Attempting to avoid notice; secretive",pos:"adj",t:"hard",syn:["sneaky","secretive","stealthy","sly","covert","clandestine","surreptitious","hidden","shifty"]},
  {w:"Hubris",d:"Excessive pride or self-confidence",pos:"n",t:"hard",syn:["arrogance","pride","ego","conceit","overconfidence","vanity","presumption","cockiness"]},
  {w:"Incorrigible",d:"Not able to be corrected or reformed",pos:"adj",t:"hard",syn:["hopeless","unreformable","incurable","hardened","unrepentant","persistent","inveterate"]},
  {w:"Jingoism",d:"Extreme patriotism in aggressive foreign policy",pos:"n",t:"hard",syn:["nationalism","chauvinism","patriotism","hawkishness","xenophobia","flag-waving","warmongering"]},
  {w:"Kowtow",d:"To act in an excessively submissive manner",pos:"v",t:"hard",syn:["grovel","submit","bow down","defer","fawn","toady","pander","brown-nose"]},
  {w:"Loquacious",d:"Tending to talk a great deal; talkative",pos:"adj",t:"hard",syn:["talkative","chatty","garrulous","verbose","wordy","gossipy","mouthy","voluble"]},
  {w:"Magnanimous",d:"Very generous or forgiving toward rivals",pos:"adj",t:"hard",syn:["generous","forgiving","noble","big-hearted","charitable","gracious","benevolent","merciful"]},
  {w:"Obfuscate",d:"To render obscure or unclear",pos:"v",t:"hard",syn:["confuse","obscure","muddle","cloud","complicate","bewilder","blur","mystify","muddy"]},
  {w:"Pernicious",d:"Having a harmful effect, especially gradually",pos:"adj",t:"hard",syn:["harmful","destructive","damaging","dangerous","toxic","deadly","evil","insidious","malignant"]},
  {w:"Reticent",d:"Not revealing thoughts or feelings readily",pos:"adj",t:"hard",syn:["reserved","quiet","shy","secretive","taciturn","private","withdrawn","tight-lipped","uncommunicative"]},
  {w:"Sanguine",d:"Optimistic or positive in a difficult situation",pos:"adj",t:"hard",syn:["optimistic","hopeful","positive","confident","cheerful","upbeat","buoyant","assured"]},
  {w:"Trepidation",d:"A feeling of fear about something that may happen",pos:"n",t:"hard",syn:["fear","anxiety","dread","nervousness","worry","apprehension","unease","alarm"]},
  {w:"Abrogate",d:"To repeal or do away with formally",pos:"v",t:"hard",syn:["repeal","abolish","cancel","revoke","annul","overturn","void","rescind","invalidate"]},
  {w:"Churlish",d:"Rude in a mean-spirited and surly way",pos:"adj",t:"hard",syn:["rude","surly","grumpy","ill-mannered","boorish","uncouth","impolite","ungracious","grouchy"]},
  {w:"Diffident",d:"Modest or shy due to a lack of confidence",pos:"adj",t:"hard",syn:["shy","timid","modest","reserved","bashful","unconfident","meek","self-conscious","hesitant"]},
  {w:"Ebullient",d:"Cheerful and full of energy",pos:"adj",t:"hard",syn:["enthusiastic","lively","bubbly","exuberant","energetic","excited","effervescent","animated","vivacious"]},
  {w:"Garrulous",d:"Excessively talkative about trivial things",pos:"adj",t:"hard",syn:["talkative","chatty","loquacious","verbose","mouthy","gossipy","rambling","long-winded"]},
  {w:"Harangue",d:"A lengthy and aggressive speech",pos:"n",t:"hard",syn:["tirade","rant","lecture","diatribe","sermon","outburst","tongue-lashing","scolding"]},
  {w:"Insipid",d:"Lacking flavor, vigor, or interest",pos:"adj",t:"hard",syn:["bland","dull","boring","tasteless","flat","uninteresting","vapid","lifeless","flavorless"]},
  {w:"Lugubrious",d:"Looking or sounding sad and dismal",pos:"adj",t:"hard",syn:["sad","gloomy","mournful","melancholy","sorrowful","somber","dreary","dismal","doleful"]},
  {w:"Mendacious",d:"Not telling the truth; lying",pos:"adj",t:"hard",syn:["lying","dishonest","deceitful","false","untruthful","deceptive","fraudulent","insincere"]},
  {w:"Obstreperous",d:"Noisy and difficult to control",pos:"adj",t:"hard",syn:["rowdy","noisy","unruly","disorderly","loud","boisterous","wild","turbulent","raucous"]},
  {w:"Parsimonious",d:"Extremely unwilling to spend money; miserly",pos:"adj",t:"hard",syn:["stingy","cheap","miserly","tight","penny-pinching","frugal","mean","niggardly","tightfisted"]},
  {w:"Quixotic",d:"Exceedingly idealistic; unrealistic",pos:"adj",t:"hard",syn:["idealistic","unrealistic","impractical","romantic","utopian","dreamy","naive","visionary","fanciful"]},
  {w:"Recondite",d:"Little known or obscure; abstruse",pos:"adj",t:"hard",syn:["obscure","esoteric","arcane","abstruse","complex","cryptic","deep","mysterious","hidden"]},
  {w:"Sagacious",d:"Having or showing keen discernment and judgment",pos:"adj",t:"hard",syn:["wise","shrewd","astute","perceptive","insightful","clever","judicious","intelligent","discerning"]},
  {w:"Temerity",d:"Excessive confidence or boldness; audacity",pos:"n",t:"hard",syn:["audacity","nerve","boldness","gall","impudence","recklessness","cheek","brazenness","daring"]},
  {w:"Unctuous",d:"Excessively flattering or ingratiating",pos:"adj",t:"hard",syn:["sycophantic","oily","smarmy","fawning","insincere","slick","gushing","smooth","obsequious"]},
  {w:"Verisimilitude",d:"The appearance of being true or real",pos:"n",t:"hard",syn:["realism","authenticity","plausibility","believability","credibility","lifelikeness","truthfulness"]},
  {w:"Winsome",d:"Attractive or appealing in a fresh way",pos:"adj",t:"hard",syn:["charming","appealing","endearing","lovely","delightful","sweet","engaging","likable","cute"]},
  {w:"Assiduously",d:"With great care, attention, and effort",pos:"adv",t:"hard",syn:["diligently","carefully","thoroughly","meticulously","industriously","painstakingly","tirelessly"]},
  {w:"Calumny",d:"The making of false statements to damage reputation",pos:"n",t:"hard",syn:["slander","libel","defamation","smear","lies","vilification","mudslinging","character assassination"]},
  {w:"Desultory",d:"Lacking a plan or purpose; random",pos:"adj",t:"hard",syn:["random","aimless","unfocused","haphazard","disconnected","scattered","halfhearted","erratic"]},
  {w:"Effrontery",d:"Insolent or impertinent behavior",pos:"n",t:"hard",syn:["nerve","audacity","gall","impudence","cheek","brazenness","insolence","boldness","chutzpah"]},
  {w:"Fatuous",d:"Silly and pointless",pos:"adj",t:"hard",syn:["silly","foolish","stupid","idiotic","absurd","inane","mindless","vacuous","asinine"]},
  {w:"Ignominious",d:"Deserving or causing public disgrace",pos:"adj",t:"hard",syn:["disgraceful","shameful","humiliating","dishonorable","embarrassing","degrading","infamous"]},
  {w:"Litigious",d:"Tending or too inclined to bring lawsuits",pos:"adj",t:"hard",syn:["lawsuit-happy","quarrelsome","contentious","combative","argumentative","disputatious"]},
  {w:"Munificent",d:"Larger or more generous than usual",pos:"adj",t:"hard",syn:["generous","lavish","liberal","bountiful","charitable","magnanimous","openhanded","philanthropic"]},
  {w:"Opprobrium",d:"Harsh criticism or censure",pos:"n",t:"hard",syn:["criticism","condemnation","censure","scorn","disgrace","shame","reproach","contempt","denunciation"]},
  {w:"Pusillanimous",d:"Showing a lack of courage; timid",pos:"adj",t:"hard",syn:["cowardly","timid","fearful","spineless","gutless","weak","faint-hearted","chicken","lily-livered"]},
  {w:"Risible",d:"Relating to laughter; laughable",pos:"adj",t:"hard",syn:["laughable","funny","ridiculous","absurd","comical","amusing","hilarious","ludicrous"]},
  {w:"Specious",d:"Superficially plausible but actually wrong",pos:"adj",t:"hard",syn:["misleading","deceptive","false","fallacious","flawed","unsound","bogus","hollow"]},
  {w:"Tendentious",d:"Expressing a strong opinion; biased",pos:"adj",t:"hard",syn:["biased","partisan","one-sided","prejudiced","slanted","opinionated","partial","skewed"]},
  {w:"Vituperative",d:"Bitter and abusive in language",pos:"adj",t:"hard",syn:["abusive","harsh","scathing","venomous","caustic","nasty","hostile","malicious","insulting"]},
  {w:"Atavistic",d:"Relating to reversion to an ancestral type",pos:"adj",t:"hard",syn:["primitive","primal","ancestral","regressive","throwback","prehistoric","instinctive","archaic"]},
  {w:"Circumlocution",d:"Using many words where fewer would do",pos:"n",t:"hard",syn:["wordiness","verbosity","long-windedness","rambling","beating around the bush","indirectness"]},
  // ── Flashcard words ──
  {w:"Evoke",d:"To bring a feeling, memory, or image to mind",pos:"v",t:"cards",syn:["recall","summon","conjure","elicit","arouse","stir","invoke","awaken","trigger"]},
  {w:"Evince",d:"To reveal the presence of a quality or feeling",pos:"v",t:"cards",syn:["show","reveal","demonstrate","display","exhibit","manifest","indicate","express"]},
  {w:"Hapless",d:"Unfortunate; having no luck",pos:"adj",t:"cards",syn:["unlucky","unfortunate","luckless","ill-fated","poor","wretched","miserable","cursed"]},
  {w:"Hackneyed",d:"Lacking originality; overused and trite",pos:"adj",t:"cards",syn:["cliche","overused","trite","stale","unoriginal","banal","tired","worn-out","stock"]},
  {w:"Decree",d:"An official order issued by an authority",pos:"n",t:"cards",syn:["order","ruling","edict","mandate","law","command","proclamation","directive","judgment","ordinance"]},
  {w:"Decorous",d:"In keeping with good taste and propriety",pos:"adj",t:"cards",syn:["proper","polite","dignified","tasteful","refined","appropriate","seemly","correct","respectable"]},
  {w:"Constitution",d:"The fundamental principles governing a state or organization",pos:"n",t:"cards",syn:["charter","framework","founding document","laws","rules","principles","bylaws","structure"]},
  {w:"Constitute",d:"To be a component or part of something",pos:"v",t:"cards",syn:["make up","form","compose","comprise","represent","amount to","establish","create"]},
  {w:"Abscond",d:"To leave hurriedly and secretly to escape",pos:"v",t:"cards",syn:["flee","escape","run away","bolt","disappear","vanish","skip town","take off"]},
  {w:"Abridge",d:"To shorten without losing the sense",pos:"v",t:"cards",syn:["shorten","condense","abbreviate","cut","reduce","summarize","truncate","compress","trim"]},
  {w:"Vicarious",d:"Experienced through the feelings of another person",pos:"adj",t:"cards",syn:["indirect","secondhand","surrogate","empathetic","substitute","through others"]},
  {w:"Vex",d:"To make someone feel annoyed or frustrated",pos:"v",t:"cards",syn:["annoy","irritate","frustrate","bother","aggravate","anger","irk","exasperate","bug"]},
  {w:"Flout",d:"To openly disregard a rule or convention",pos:"v",t:"cards",syn:["defy","disobey","violate","disregard","ignore","break","scorn","mock","rebel against"]},
  {w:"Flourish",d:"To grow or develop in a healthy or vigorous way",pos:"v",t:"cards",syn:["thrive","prosper","bloom","blossom","succeed","grow","boom","do well"]},
  {w:"Predecessor",d:"A person who held a position before the current holder",pos:"n",t:"cards",syn:["forerunner","precursor","antecedent","former holder","ancestor","prior occupant"]},
  {w:"Precocious",d:"Unusually advanced or mature at an early age",pos:"adj",t:"cards",syn:["advanced","mature","gifted","talented","prodigious","bright","ahead","early developer"]},
  {w:"Bane",d:"A cause of great distress or annoyance",pos:"n",t:"cards",syn:["curse","plague","scourge","nuisance","torment","pest","ruin","affliction","nightmare"]},
  {w:"Banal",d:"So lacking in originality as to be obvious",pos:"adj",t:"cards",syn:["trite","cliche","unoriginal","boring","dull","hackneyed","commonplace","stale","predictable"]},
  {w:"Juxtaposition",d:"The act of placing things close together for contrast",pos:"n",t:"cards",syn:["contrast","comparison","side by side","proximity","adjacency","pairing"]},
  {w:"Just",d:"Based on or behaving according to what is morally right and fair",pos:"adj",t:"cards",syn:["fair","righteous","equitable","moral","ethical","impartial","honorable","upright","virtuous"]},
  {w:"Complicit",d:"Involved with others in an unlawful or wrong activity",pos:"adj",t:"cards",syn:["involved","guilty","colluding","conspiring","accomplice","accessory","participating","in on it"]},
  {w:"Complement",d:"Something that completes or goes well with something",pos:"n",t:"cards",syn:["addition","companion","counterpart","supplement","match","partner","completion","enhancement"]},
  {w:"Summit",d:"The highest point of a hill or mountain; a meeting of leaders",pos:"n",t:"cards",syn:["peak","top","pinnacle","apex","crest","zenith","conference","meeting"]},
  {w:"Impinge",d:"To have an effect, especially a negative one",pos:"v",t:"cards",syn:["affect","impact","encroach","infringe","intrude","trespass","influence","interfere"]},
  {w:"Impetuous",d:"Acting quickly without thought or care",pos:"adj",t:"cards",syn:["impulsive","rash","hasty","reckless","spontaneous","hotheaded","careless","unthinking"]},
  {w:"Spurious",d:"Not genuine, authentic, or true; false",pos:"adj",t:"cards",syn:["fake","false","bogus","fraudulent","counterfeit","phony","fabricated","sham","untrue"]},
  {w:"Sovereign",d:"A supreme ruler; possessing supreme authority",pos:"n",t:"cards",syn:["ruler","monarch","king","queen","supreme","independent","autonomous","royal","self-governing"]},
  {w:"Foresight",d:"The ability to predict what will happen in the future",pos:"n",t:"cards",syn:["planning","vision","forethought","anticipation","prudence","preparation","prescience","far-sightedness"]},
  {w:"Foreseeable",d:"Able to be predicted or expected",pos:"adj",t:"cards",syn:["predictable","expected","anticipated","likely","probable","imaginable","calculable"]},
  {w:"Discern",d:"To perceive or recognize something clearly",pos:"v",t:"cards",syn:["perceive","detect","recognize","distinguish","identify","notice","see","observe","spot","tell"]},
  {w:"Disavow",d:"To deny any responsibility or support for",pos:"v",t:"cards",syn:["deny","reject","disown","repudiate","renounce","disclaim","retract","disassociate"]},
  {w:"Superfluous",d:"More than what is needed; unnecessary",pos:"adj",t:"cards",syn:["unnecessary","excess","extra","redundant","unneeded","surplus","excessive","spare"]},
  {w:"Irreverence",d:"A lack of respect for things usually treated with seriousness",pos:"n",t:"cards",syn:["disrespect","impudence","cheekiness","flippancy","impertinence","mockery","insolence"]},
  {w:"Jocular",d:"Fond of or characterized by joking; humorous",pos:"adj",t:"cards",syn:["humorous","funny","witty","playful","jovial","comical","lighthearted","amusing","facetious"]},
  {w:"Amicable",d:"Having a spirit of friendliness; without serious disagreement",pos:"adj",t:"cards",syn:["friendly","cordial","harmonious","civil","pleasant","agreeable","cooperative","peaceable"]},
  {w:"Genial",d:"Friendly and cheerful in manner",pos:"adj",t:"cards",syn:["friendly","cheerful","warm","affable","amiable","cordial","pleasant","good-natured","jovial"]},
  {w:"Peculiar",d:"Strange or odd; unusual",pos:"adj",t:"cards",syn:["strange","odd","unusual","weird","bizarre","curious","eccentric","quirky","uncommon"]},
  {w:"Paucity",d:"The presence of something in only small or insufficient quantities",pos:"n",t:"cards",syn:["scarcity","shortage","lack","dearth","insufficiency","deficiency","sparseness","rarity"]},
  {w:"Mean",d:"The average value; calculated by dividing the sum of values by their number",pos:"n",t:"cards",syn:["average","midpoint","median","norm","middle","center","standard","par"]},
  {w:"Construe",d:"To interpret or understand in a particular way",pos:"v",t:"cards",syn:["interpret","understand","read","take","perceive","explain","deduce","infer","translate"]},
  {w:"Constrain",d:"To compel or force toward a particular course of action",pos:"v",t:"cards",syn:["restrict","limit","restrain","confine","curb","inhibit","compel","force","bind"]},
  {w:"Amiable",d:"Having a friendly and pleasant manner",pos:"adj",t:"cards",syn:["friendly","pleasant","likable","agreeable","warm","genial","good-natured","affable"]},
  {w:"Garrulous",d:"Excessively talkative about trivial things",pos:"adj",t:"cards",syn:["talkative","chatty","loquacious","verbose","mouthy","gossipy","rambling","long-winded"]},
  {w:"Maverick",d:"An independent-minded person",pos:"n",t:"cards",syn:["rebel","nonconformist","individualist","free spirit","dissenter","loner","renegade"]},
  {w:"Stark",d:"Severe or bare in appearance; complete or sheer",pos:"adj",t:"cards",syn:["harsh","bare","bleak","grim","severe","sharp","utter","complete","absolute","desolate"]},
  {w:"Stagnate",d:"To cease developing; to become inactive or dull",pos:"v",t:"cards",syn:["stall","decline","idle","languish","deteriorate","vegetate","stand still","plateau"]},
  {w:"Exigent",d:"Pressing; demanding immediate attention or action",pos:"adj",t:"cards",syn:["urgent","pressing","critical","imperative","acute","demanding","crucial","compelling"]},
  {w:"Exorbitant",d:"Unreasonably high in price or amount",pos:"adj",t:"cards",syn:["excessive","extravagant","outrageous","steep","inflated","unreasonable","astronomical","overpriced"]},
  {w:"Quagmire",d:"A soft, boggy area of land; a complex or difficult situation",pos:"n",t:"cards",syn:["swamp","marsh","bog","predicament","dilemma","mess","morass","mire","muddle"]},
  {w:"Quaint",d:"Attractively unusual or old-fashioned",pos:"adj",t:"cards",syn:["charming","picturesque","old-fashioned","queer","peculiar","whimsical","rustic","cute","antiquated"]},
  {w:"Clout",d:"Influence or power, especially in politics or business",pos:"n",t:"cards",syn:["influence","power","authority","sway","pull","leverage","weight","standing"]},
  {w:"Cloying",d:"Excessively sweet, sentimental, or flattering",pos:"adj",t:"cards",syn:["sickly","saccharine","nauseating","excessive","overdone","sugary","treacly","sentimental"]},
  {w:"Truncate",d:"To shorten by cutting off the top or end",pos:"v",t:"cards",syn:["shorten","cut","trim","abbreviate","curtail","crop","clip","abridge","reduce"]},
  {w:"Trite",d:"Overused and lacking original thought",pos:"adj",t:"cards",syn:["cliche","hackneyed","stale","banal","unoriginal","stock","tired","worn-out","predictable","commonplace"]},
  {w:"Diverge",d:"To separate from another route and go in a different direction",pos:"v",t:"cards",syn:["separate","split","branch","deviate","differ","part","fork","veer","stray","depart"]},
  {w:"Diversification",d:"The act of varying or expanding into different forms or areas",pos:"n",t:"cards",syn:["variety","expansion","variation","broadening","spread","range","mix","assortment"]},
];

// ── SAT dictionary for auto-fill ──
var SAT_DICT = {
  "acrimony": {d:"Bitterness or ill feeling",pos:"n",syn:["bitterness","hostility","resentment","animosity","rancor","spite","venom","harshness"]},
  "admonish": {d:"To warn or reprimand someone firmly",pos:"v",syn:["warn","reprimand","rebuke","scold","caution","chide","reprove","upbraid"]},
  "affable": {d:"Friendly, good-natured, and easy to talk to",pos:"adj",syn:["friendly","approachable","genial","amiable","cordial","sociable","warm","pleasant"]},
  "alacrity": {d:"Brisk and cheerful readiness",pos:"n",syn:["eagerness","willingness","readiness","enthusiasm","promptness","quickness","zeal","swiftness"]},
  "ambivalent": {d:"Having mixed feelings or contradictory ideas about something",pos:"adj",syn:["uncertain","conflicted","undecided","torn","indecisive","equivocal","unsure","hesitant"]},
  "ameliorate": {d:"To make something bad or unsatisfactory better",pos:"v",syn:["improve","better","enhance","alleviate","help","relieve","upgrade","remedy"]},
  "anachronism": {d:"A thing belonging to a period other than that in which it exists",pos:"n",syn:["archaism","relic","throwback","misplacement","incongruity","obsolescence"]},
  "anomaly": {d:"Something that deviates from what is standard or expected",pos:"n",syn:["irregularity","oddity","deviation","aberration","exception","peculiarity","inconsistency"]},
  "antithesis": {d:"A person or thing that is the direct opposite of another",pos:"n",syn:["opposite","contrast","reverse","contrary","inverse","contradiction","foil"]},
  "apocryphal": {d:"Of doubtful authenticity, although widely circulated",pos:"adj",syn:["dubious","questionable","spurious","fictitious","legendary","unverified","mythical","false"]},
  "appease": {d:"To pacify or placate someone by giving in to their demands",pos:"v",syn:["pacify","mollify","placate","calm","satisfy","soothe","conciliate","propitiate"]},
  "arduous": {d:"Involving or requiring strenuous effort; difficult",pos:"adj",syn:["difficult","strenuous","taxing","laborious","grueling","tough","demanding","exhausting"]},
  "ascetic": {d:"Characterized by severe self-discipline and abstention from pleasure",pos:"adj",syn:["austere","self-denying","abstinent","puritanical","spartan","frugal","rigorous","abstemious"]},
  "assiduous": {d:"Showing great care and perseverance",pos:"adj",syn:["diligent","industrious","careful","persistent","thorough","meticulous","dedicated","tireless"]},
  "auspicious": {d:"Conducive to success; favorable",pos:"adj",syn:["favorable","promising","propitious","encouraging","fortunate","bright","optimistic","hopeful"]},
  "austere": {d:"Severe or strict in manner; having no comforts or luxuries",pos:"adj",syn:["severe","stern","strict","harsh","spartan","plain","simple","ascetic","rigorous"]},
  "avarice": {d:"Extreme greed for wealth or material gain",pos:"n",syn:["greed","greediness","cupidity","covetousness","rapacity","acquisitiveness","miserliness","parsimony"]},
  "bellicose": {d:"Demonstrating aggression and willingness to fight",pos:"adj",syn:["aggressive","combative","hostile","warlike","pugnacious","belligerent","militant","contentious"]},
  "benevolence": {d:"The quality of being well-meaning and kindly",pos:"n",syn:["kindness","generosity","goodwill","charity","altruism","compassion","goodness","philanthropy"]},
  "bombastic": {d:"High-sounding but with little meaning; inflated",pos:"adj",syn:["pompous","grandiloquent","pretentious","inflated","verbose","turgid","overblown","grandiose"]},
  "bucolic": {d:"Relating to the pleasant aspects of the countryside",pos:"adj",syn:["rural","pastoral","rustic","idyllic","countryside","agricultural","sylvan","arcadian"]},
  "capitulate": {d:"To cease to resist an opponent or demand; to surrender",pos:"v",syn:["surrender","yield","submit","concede","relent","give in","acquiesce","comply"]},
  "caustic": {d:"Sarcastic in a scathing and bitter way",pos:"adj",syn:["biting","scathing","cutting","sharp","mordant","acerbic","sardonic","stinging","trenchant"]},
  "censure": {d:"To express severe disapproval of someone or something",pos:"v",syn:["condemn","criticize","reprimand","rebuke","denounce","blame","reproach","castigate"]},
  "circumscribe": {d:"To restrict something within limits",pos:"v",syn:["restrict","limit","confine","constrain","bound","define","demarcate","delimit"]},
  "circumspect": {d:"Wary and unwilling to take risks",pos:"adj",syn:["cautious","careful","wary","prudent","guarded","discreet","watchful","judicious"]},
  "clandestine": {d:"Kept secret or done secretively",pos:"adj",syn:["secret","covert","hidden","furtive","undercover","surreptitious","stealthy","concealed"]},
  "clemency": {d:"Mercy and leniency shown toward offenders",pos:"n",syn:["mercy","leniency","compassion","forgiveness","mildness","tolerance","grace","pardon"]},
  "coalesce": {d:"To come together and form one mass or whole",pos:"v",syn:["merge","unite","combine","join","fuse","blend","consolidate","converge"]},
  "cogent": {d:"Clear, logical, and convincing",pos:"adj",syn:["convincing","compelling","persuasive","logical","sound","forceful","valid","coherent"]},
  "compendium": {d:"A collection of concise but detailed information",pos:"n",syn:["collection","summary","compilation","anthology","digest","handbook","reference","manual"]},
  "congenial": {d:"Pleasant because of qualities or interests similar to one's own",pos:"adj",syn:["pleasant","agreeable","compatible","friendly","likable","harmonious","sociable","affable"]},
  "conjecture": {d:"An opinion or conclusion formed on incomplete information",pos:"n",syn:["speculation","guess","hypothesis","supposition","assumption","theory","surmise","inference"]},
  "consensus": {d:"General agreement among a group of people",pos:"n",syn:["agreement","accord","unanimity","harmony","concurrence","unity","assent","concord"]},
  "contentious": {d:"Causing or likely to cause argument; quarrelsome",pos:"adj",syn:["controversial","disputed","argumentative","combative","quarrelsome","provocative","divisive","polemical"]},
  "contrite": {d:"Feeling or expressing remorse for wrongdoing",pos:"adj",syn:["remorseful","regretful","penitent","sorry","repentant","guilt-ridden","apologetic","ashamed"]},
  "convoluted": {d:"Extremely complex and difficult to follow",pos:"adj",syn:["complex","complicated","intricate","tangled","tortuous","involved","labyrinthine","perplexing"]},
  "copious": {d:"Abundant in supply or quantity",pos:"adj",syn:["abundant","plentiful","ample","profuse","extensive","lavish","generous","prolific"]},
  "corroborate": {d:"To confirm or give support to a statement or theory",pos:"v",syn:["confirm","verify","support","substantiate","validate","back up","authenticate","affirm"]},
  "credulous": {d:"Too willing to believe things; gullible",pos:"adj",syn:["naive","gullible","trusting","unsuspecting","believing","innocent","easily deceived","accepting"]},
  "cursory": {d:"Hasty and therefore not thorough or detailed",pos:"adj",syn:["hasty","superficial","brief","quick","perfunctory","hurried","shallow","passing"]},
  "debacle": {d:"A sudden disastrous collapse or defeat",pos:"n",syn:["disaster","fiasco","catastrophe","failure","rout","collapse","mess","shambles"]},
  "decorum": {d:"Behavior in keeping with good taste and propriety",pos:"n",syn:["propriety","dignity","decency","etiquette","protocol","politeness","respectability","correctness"]},
  "deference": {d:"Humble submission and respect",pos:"n",syn:["respect","submission","regard","reverence","obedience","compliance","esteem","homage"]},
  "deleterious": {d:"Causing harm or damage",pos:"adj",syn:["harmful","damaging","detrimental","injurious","destructive","ruinous","hurtful","pernicious"]},
  "delineate": {d:"To describe or portray precisely",pos:"v",syn:["describe","outline","depict","define","characterize","sketch","specify","portray"]},
  "denounce": {d:"To publicly declare wrong or evil",pos:"v",syn:["condemn","accuse","criticize","censure","castigate","attack","decry","vilify"]},
  "deplete": {d:"To use up the supply or resources of",pos:"v",syn:["exhaust","drain","consume","use up","reduce","empty","diminish","decrease"]},
  "deprecate": {d:"To express disapproval of; to belittle",pos:"v",syn:["disapprove","belittle","disparage","criticize","deplore","condemn","undervalue","discredit"]},
  "deride": {d:"To express contempt for; to ridicule",pos:"v",syn:["ridicule","mock","scoff","scorn","taunt","jeer","laugh at","dismiss"]},
  "derivative": {d:"Originating from another source; not original",pos:"adj",syn:["unoriginal","copied","borrowed","imitative","secondhand","plagiarized","derived","conventional"]},
  "desiccate": {d:"To remove moisture from; to dry out completely",pos:"v",syn:["dry","dehydrate","parch","wither","shrivel","drain","evaporate","dessicate"]},
  "despondent": {d:"In low spirits from loss of hope or courage",pos:"adj",syn:["dejected","depressed","hopeless","downcast","disheartened","miserable","gloomy","desolate"]},
  "diffident": {d:"Modest or shy due to lack of self-confidence",pos:"adj",syn:["shy","timid","modest","meek","retiring","self-conscious","hesitant","unassertive"]},
  "digress": {d:"To leave the main subject temporarily in speech or writing",pos:"v",syn:["deviate","stray","wander","drift","ramble","depart","diverge","veer"]},
  "diminish": {d:"To make or become less",pos:"v",syn:["reduce","decrease","lessen","shrink","decline","dwindle","weaken","lower"]},
  "discordant": {d:"Disagreeing or incongruous; harsh and jarring in sound",pos:"adj",syn:["clashing","conflicting","inconsistent","incongruous","jarring","dissonant","incompatible","contrary"]},
  "disparate": {d:"Essentially different in kind; not allowing comparison",pos:"adj",syn:["different","distinct","unlike","diverse","varied","contrasting","dissimilar","divergent"]},
  "disseminate": {d:"To spread information or knowledge widely",pos:"v",syn:["spread","distribute","circulate","broadcast","propagate","publicize","disperse","promulgate"]},
  "dissonance": {d:"Lack of harmony among musical notes; tension or conflict",pos:"n",syn:["discord","conflict","tension","inconsistency","incoherence","incompatibility","cacophony","clash"]},
  "diverge": {d:"To develop in a different direction",pos:"v",syn:["differ","separate","branch","deviate","split","vary","depart","stray"]},
  "dormant": {d:"Having normal physical functions suspended; temporarily inactive",pos:"adj",syn:["inactive","sleeping","latent","quiescent","inert","hibernating","idle","suspended"]},
  "dubious": {d:"Hesitating or doubting; not to be relied upon",pos:"adj",syn:["doubtful","uncertain","questionable","suspect","skeptical","unsure","untrustworthy","ambiguous"]},
  "duplicity": {d:"Deceitfulness; double-dealing",pos:"n",syn:["deceit","deception","dishonesty","treachery","trickery","hypocrisy","two-facedness","cunning"]},
  "ebullient": {d:"Cheerful and full of energy",pos:"adj",syn:["exuberant","enthusiastic","bubbly","lively","vivacious","animated","spirited","effervescent"]},
  "eclectic": {d:"Deriving ideas from a broad range of sources",pos:"adj",syn:["diverse","varied","wide-ranging","mixed","catholic","broad","heterogeneous","selective"]},
  "efficacious": {d:"Successful in producing a desired result; effective",pos:"adj",syn:["effective","successful","productive","efficient","potent","powerful","useful","competent"]},
  "egregious": {d:"Outstandingly bad; shocking",pos:"adj",syn:["outrageous","shocking","appalling","flagrant","monstrous","scandalous","atrocious","heinous"]},
  "elicit": {d:"To evoke or draw out a response or reaction",pos:"v",syn:["evoke","draw out","extract","prompt","provoke","induce","call forth","obtain"]},
  "elucidate": {d:"To make something clear; to explain",pos:"v",syn:["explain","clarify","illuminate","expound","interpret","spell out","shed light on","describe"]},
  "embellish": {d:"To make more attractive by adding decorative details",pos:"v",syn:["decorate","adorn","ornament","beautify","enhance","elaborate","exaggerate","embroider"]},
  "empathy": {d:"The ability to understand and share the feelings of another",pos:"n",syn:["understanding","compassion","sympathy","sensitivity","insight","identification","concern","feeling"]},
  "engender": {d:"To cause or give rise to a feeling or situation",pos:"v",syn:["cause","produce","create","generate","provoke","foster","breed","arouse"]},
  "enigma": {d:"A person or thing that is mysterious or difficult to understand",pos:"n",syn:["mystery","puzzle","riddle","conundrum","paradox","problem","question","secret"]},
  "enumerate": {d:"To mention a number of things one by one",pos:"v",syn:["list","name","count","itemize","specify","catalog","detail","number"]},
  "equanimity": {d:"Mental calmness especially in difficult situations",pos:"n",syn:["composure","calmness","serenity","poise","self-possession","tranquility","balance","steadiness"]},
  "equivocal": {d:"Open to more than one interpretation; ambiguous",pos:"adj",syn:["ambiguous","unclear","vague","indefinite","uncertain","dubious","evasive","misleading"]},
  "esoteric": {d:"Intended for or understood by only a few with special knowledge",pos:"adj",syn:["obscure","arcane","abstruse","recondite","specialized","mysterious","cryptic","rarefied"]},
  "eulogy": {d:"A speech or piece of writing praising someone highly",pos:"n",syn:["tribute","praise","commendation","panegyric","encomium","homage","testimonial","accolade"]},
  "exonerate": {d:"To absolve someone from blame or criminal charge",pos:"v",syn:["absolve","clear","acquit","vindicate","pardon","excuse","free","discharge"]},
  "expedient": {d:"Convenient and practical, though possibly improper",pos:"adj",syn:["convenient","practical","advisable","useful","advantageous","suitable","pragmatic","politic"]},
  "extol": {d:"To praise enthusiastically",pos:"v",syn:["praise","laud","commend","celebrate","glorify","exalt","acclaim","applaud"]},
  "extraneous": {d:"Irrelevant or unrelated to the subject being dealt with",pos:"adj",syn:["irrelevant","unrelated","unnecessary","extra","superfluous","peripheral","tangential","incidental"]},
  "facetious": {d:"Treating serious issues with inappropriate humor",pos:"adj",syn:["flippant","joking","playful","frivolous","glib","comical","tongue-in-cheek","satirical"]},
  "fallacious": {d:"Based on a mistaken belief; logically unsound",pos:"adj",syn:["false","incorrect","wrong","misleading","erroneous","deceptive","flawed","unsound"]},
  "fathom": {d:"To understand something difficult after much thought",pos:"v",syn:["understand","comprehend","grasp","perceive","penetrate","work out","figure out","divine"]},
  "furtive": {d:"Attempting to avoid notice; secretive",pos:"adj",syn:["secretive","stealthy","sneaky","covert","sly","shifty","concealed","clandestine"]},
  "germane": {d:"Relevant to a subject under consideration",pos:"adj",syn:["relevant","pertinent","applicable","related","fitting","apt","appropriate","connected"]},
  "grandiloquent": {d:"Using pompous or extravagant language",pos:"adj",syn:["pompous","bombastic","pretentious","grandiose","verbose","florid","magniloquent","inflated"]},
  "heresy": {d:"Belief or opinion contrary to orthodox religious doctrine",pos:"n",syn:["blasphemy","dissent","nonconformity","apostasy","unorthodoxy","heterodoxy","sacrilege","iconoclasm"]},
  "iconoclast": {d:"A person who attacks cherished beliefs or institutions",pos:"n",syn:["rebel","dissenter","radical","nonconformist","challenger","reformer","critic","maverick"]},
  "impasse": {d:"A situation in which no progress is possible; a deadlock",pos:"n",syn:["deadlock","stalemate","standstill","standoff","gridlock","bottleneck","dead end","halt"]},
  "impeccable": {d:"In accordance with the highest standards; faultless",pos:"adj",syn:["flawless","perfect","faultless","exemplary","spotless","irreproachable","immaculate","ideal"]},
  "implacable": {d:"Unable to be appeased or pacified; unrelenting",pos:"adj",syn:["relentless","unappeasable","inflexible","inexorable","merciless","unyielding","ruthless","severe"]},
  "implicit": {d:"Suggested though not directly expressed",pos:"adj",syn:["implied","inferred","indirect","understood","unstated","unspoken","tacit","inherent"]},
  "impudent": {d:"Not showing due respect; impertinent",pos:"adj",syn:["rude","impertinent","insolent","disrespectful","brazen","cheeky","bold","audacious"]},
  "incisive": {d:"Intelligently analytical and clear-thinking",pos:"adj",syn:["sharp","acute","penetrating","keen","perceptive","astute","trenchant","piercing"]},
  "incongruous": {d:"Not in harmony or keeping with the surroundings",pos:"adj",syn:["inconsistent","incompatible","out of place","mismatched","inappropriate","absurd","strange","unsuitable"]},
  "indifferent": {d:"Having no particular interest or sympathy; unconcerned",pos:"adj",syn:["unconcerned","apathetic","detached","neutral","disinterested","unmoved","aloof","impassive"]},
  "indigenous": {d:"Originating or occurring naturally in a particular place",pos:"adj",syn:["native","original","local","aboriginal","endemic","autochthonous","homegrown","innate"]},
  "indolent": {d:"Wanting to avoid activity or exertion; lazy",pos:"adj",syn:["lazy","idle","slothful","lethargic","sluggish","inactive","inert","apathetic"]},
  "ineffable": {d:"Too great or extreme to be expressed in words",pos:"adj",syn:["indescribable","unspeakable","inexpressible","unutterable","beyond words","transcendent","overwhelming","sublime"]},
  "inexorable": {d:"Impossible to stop or prevent; relentless",pos:"adj",syn:["relentless","unstoppable","inevitable","unavoidable","inflexible","unyielding","implacable","unalterable"]},
  "infer": {d:"To deduce from evidence and reasoning",pos:"v",syn:["deduce","conclude","reason","surmise","derive","gather","assume","extrapolate"]},
  "innuendo": {d:"An indirect reference to something questionable",pos:"n",syn:["hint","insinuation","suggestion","implication","allusion","whisper","aspersion","overtone"]},
  "innocuous": {d:"Not harmful or offensive",pos:"adj",syn:["harmless","inoffensive","benign","safe","gentle","bland","mild","unobjectionable"]},
  "intrepid": {d:"Fearless and adventurous",pos:"adj",syn:["fearless","brave","bold","courageous","daring","adventurous","audacious","valiant"]},
  "inundate": {d:"To overwhelm with things to be dealt with; to flood",pos:"v",syn:["overwhelm","flood","swamp","deluge","overload","submerge","drown","bury"]},
  "invective": {d:"Insulting, abusive, or highly critical language",pos:"n",syn:["abuse","insults","criticism","tirade","vituperation","denunciation","censure","diatribe"]},
  "irrevocable": {d:"Not able to be changed, reversed, or recovered",pos:"adj",syn:["irreversible","permanent","final","absolute","unalterable","unchangeable","definitive","binding"]},
  "judicious": {d:"Having, showing, or done with good judgment",pos:"adj",syn:["wise","sensible","prudent","sound","careful","reasonable","discerning","sagacious"]},
  "laconic": {d:"Using very few words; brief and concise",pos:"adj",syn:["brief","concise","terse","short","succinct","crisp","pithy","monosyllabic"]},
  "laudable": {d:"Deserving praise and commendation",pos:"adj",syn:["praiseworthy","commendable","admirable","worthy","creditable","meritorious","honorable","exemplary"]},
  "litigious": {d:"Too ready to go to law to settle disputes",pos:"adj",syn:["argumentative","combative","disputatious","contentious","quarrelsome","belligerent","aggrieved"]},
  "magnanimous": {d:"Generous or forgiving, especially toward a rival",pos:"adj",syn:["generous","forgiving","noble","big-hearted","charitable","gracious","benevolent","unselfish"]},
  "malevolent": {d:"Having or showing a wish to do evil to others",pos:"adj",syn:["evil","wicked","malicious","hostile","spiteful","sinister","vindictive","hateful"]},
  "mollify": {d:"To appease the anger or anxiety of someone",pos:"v",syn:["appease","pacify","calm","soothe","placate","conciliate","assuage","soften"]},
  "morose": {d:"Sullen and ill-tempered",pos:"adj",syn:["gloomy","sullen","glum","depressed","melancholy","somber","sulky","dour"]},
  "myriad": {d:"A countless or extremely great number",pos:"adj",syn:["countless","innumerable","numerous","many","multitudinous","varied","diverse","multifarious"]},
  "nefarious": {d:"Wicked or criminal",pos:"adj",syn:["wicked","criminal","villainous","sinister","evil","corrupt","vile","iniquitous"]},
  "nuance": {d:"A subtle difference in meaning, expression, or sound",pos:"n",syn:["subtlety","shade","distinction","refinement","gradation","suggestion","overtone","delicacy"]},
  "obfuscate": {d:"To render obscure, unclear, or unintelligible",pos:"v",syn:["confuse","obscure","muddle","muddy","cloud","bewilder","complicate","perplex"]},
  "opaque": {d:"Not transparent; not clearly understood or expressed",pos:"adj",syn:["unclear","obscure","murky","cloudy","cryptic","impenetrable","ambiguous","dense"]},
  "palpable": {d:"So intense as to seem almost tangible; easily perceptible",pos:"adj",syn:["tangible","obvious","evident","perceptible","clear","manifest","real","plain"]},
  "parsimonious": {d:"Unwilling to spend money; extremely frugal",pos:"adj",syn:["miserly","stingy","tight-fisted","frugal","cheap","penny-pinching","niggardly","mean"]},
  "perfidious": {d:"Deceitful and untrustworthy",pos:"adj",syn:["treacherous","disloyal","deceitful","traitorous","faithless","false","duplicitous","dishonest"]},
  "permeate": {d:"To spread throughout; to pervade",pos:"v",syn:["pervade","penetrate","saturate","spread through","infuse","fill","suffuse","infiltrate"]},
  "pertinacious": {d:"Holding firmly to an opinion or course of action",pos:"adj",syn:["persistent","stubborn","obstinate","tenacious","determined","dogged","resolute","unyielding"]},
  "placate": {d:"To make less angry or hostile",pos:"v",syn:["appease","pacify","mollify","calm","soothe","conciliate","assuage","satisfy"]},
  "plethora": {d:"A large or excessive amount of something",pos:"n",syn:["abundance","excess","surplus","overabundance","profusion","glut","superabundance","surfeit"]},
  "polemical": {d:"Strongly critical of something; involving heated argument",pos:"adj",syn:["controversial","disputatious","argumentative","contentious","combative","divisive","provocative","combative"]},
  "preclude": {d:"To prevent from happening; to make impossible",pos:"v",syn:["prevent","rule out","exclude","forestall","prohibit","bar","obstruct","foreclose"]},
  "prodigal": {d:"Spending money or resources recklessly; wasteful",pos:"adj",syn:["wasteful","extravagant","spendthrift","lavish","reckless","improvident","profligate","excessive"]},
  "prodigious": {d:"Remarkably or impressively great in extent or size",pos:"adj",syn:["enormous","huge","massive","extraordinary","remarkable","impressive","tremendous","staggering"]},
  "prolific": {d:"Producing many works or results; fertile",pos:"adj",syn:["productive","fruitful","fertile","abundant","creative","generative","inventive","fecund"]},
  "propensity": {d:"An inclination or natural tendency to behave in a certain way",pos:"n",syn:["tendency","inclination","predisposition","proclivity","aptitude","leaning","bent","disposition"]},
  "prosaic": {d:"Having the style of prose; lacking imagination; dull",pos:"adj",syn:["dull","ordinary","unimaginative","mundane","uninspired","flat","dry","tedious"]},
  "prudence": {d:"The quality of being prudent; cautiousness",pos:"n",syn:["caution","wisdom","care","discretion","foresight","sagacity","common sense","circumspection"]},
  "querulous": {d:"Complaining in a petulant or whining manner",pos:"adj",syn:["complaining","whining","petulant","fretful","grumbling","peevish","irritable","discontented"]},
  "rancor": {d:"Bitterness or resentfulness after a conflict",pos:"n",syn:["bitterness","resentment","animosity","spite","malice","hostility","grudge","ill will"]},
  "rebuke": {d:"To express sharp disapproval or criticism",pos:"v",syn:["reprimand","scold","censure","criticize","chide","admonish","reproach","berate"]},
  "reticent": {d:"Not revealing one's thoughts or feelings readily",pos:"adj",syn:["reserved","quiet","uncommunicative","withdrawn","secretive","reluctant","introverted","guarded"]},
  "sagacious": {d:"Having or showing keen mental discernment and good judgment",pos:"adj",syn:["wise","shrewd","perceptive","astute","discerning","intelligent","judicious","perspicacious"]},
  "salient": {d:"Most noticeable or important; prominent",pos:"adj",syn:["prominent","notable","important","significant","conspicuous","striking","chief","major"]},
  "solicitous": {d:"Characterized by care and attention toward others",pos:"adj",syn:["caring","attentive","considerate","concerned","anxious","worried","mindful","thoughtful"]},
  "soporific": {d:"Tending to induce drowsiness or sleep",pos:"adj",syn:["sleep-inducing","drowsy","boring","tedious","dull","hypnotic","sedating","narcotic"]},
  "specious": {d:"Superficially plausible but actually wrong",pos:"adj",syn:["misleading","deceptive","false","plausible-sounding","dishonest","fallacious","fraudulent","hollow"]},
  "substantiate": {d:"To provide evidence to support or prove the truth of",pos:"v",syn:["prove","confirm","verify","validate","support","corroborate","authenticate","establish"]},
  "supplant": {d:"To supersede and replace",pos:"v",syn:["replace","displace","oust","usurp","succeed","overthrow","take over","supersede"]},
  "surreptitious": {d:"Kept secret because it would not be approved of",pos:"adj",syn:["secretive","stealthy","covert","furtive","sneaky","hidden","clandestine","underhanded"]},
  "symbiotic": {d:"Relating to a mutually beneficial relationship between entities",pos:"adj",syn:["mutually beneficial","cooperative","interdependent","reciprocal","complementary","synergistic"]},
  "temperate": {d:"Showing moderation or self-restraint; mild",pos:"adj",syn:["moderate","mild","restrained","measured","controlled","calm","reasonable","sober"]},
  "temerity": {d:"Excessive confidence or boldness; audacity",pos:"n",syn:["audacity","boldness","nerve","impudence","rashness","recklessness","gall","presumption"]},
  "transient": {d:"Lasting only for a short time; impermanent",pos:"adj",syn:["temporary","fleeting","brief","short-lived","passing","momentary","ephemeral","impermanent"]},
  "trepidation": {d:"A feeling of fear or agitation about something uncertain",pos:"n",syn:["fear","anxiety","apprehension","nervousness","dread","alarm","unease","worry"]},
  "truculent": {d:"Eager to argue or fight; aggressively defiant",pos:"adj",syn:["aggressive","combative","belligerent","hostile","pugnacious","fierce","defiant","contentious"]},
  "tumultuous": {d:"Making a loud, confused noise; excited or disorderly",pos:"adj",syn:["chaotic","turbulent","noisy","rowdy","stormy","disorderly","raucous","unruly"]},
  "turpitude": {d:"Wickedness and moral depravity",pos:"n",syn:["wickedness","depravity","baseness","vileness","corruption","immorality","villainy","iniquity"]},
  "unctuous": {d:"Excessively flattering in a way that is insincere",pos:"adj",syn:["sycophantic","obsequious","fawning","ingratiating","flattering","oily","servile","groveling"]},
  "undermine": {d:"To weaken or damage gradually; to subvert",pos:"v",syn:["weaken","subvert","sabotage","erode","damage","destabilize","compromise","impair"]},
  "unequivocal": {d:"Leaving no doubt; unambiguous",pos:"adj",syn:["clear","definite","absolute","certain","explicit","unmistakable","categorical","unambiguous"]},
  "vacillate": {d:"To waver between different opinions or actions; to be indecisive",pos:"v",syn:["waver","hesitate","fluctuate","oscillate","dither","sway","alternate","equivocate"]},
  "vapid": {d:"Offering nothing stimulating or challenging; bland",pos:"adj",syn:["bland","dull","insipid","flat","boring","empty","lifeless","tedious"]},
  "verbose": {d:"Using or expressed in more words than are needed",pos:"adj",syn:["wordy","long-winded","prolix","garrulous","rambling","loquacious","talkative","diffuse"]},
  "veracity": {d:"Conformity to facts; accuracy",pos:"n",syn:["truthfulness","accuracy","honesty","truth","correctness","reliability","integrity","authenticity"]},
  "vilify": {d:"To speak or write about in an abusively critical manner",pos:"v",syn:["defame","slander","malign","denounce","denigrate","criticize","abuse","smear"]},
  "visceral": {d:"Relating to deep inward feelings rather than intellect",pos:"adj",syn:["instinctive","gut-level","raw","primal","emotional","innate","intuitive","deep-seated"]},
  "vituperate": {d:"To blame or insult someone in strong, harsh language",pos:"v",syn:["berate","abuse","castigate","rebuke","denounce","revile","lambaste","censure"]},
  "wanton": {d:"Deliberate and unprovoked; having no moral restraint",pos:"adj",syn:["deliberate","malicious","senseless","unprovoked","reckless","willful","gratuitous","immoral"]},
  "xenophobic": {d:"Having an intense dislike or fear of foreigners",pos:"adj",syn:["prejudiced","biased","racist","intolerant","insular","chauvinistic","nativist","isolationist"]},
  "abjure": {d:"To formally reject or disavow a belief or claim",pos:"v",syn:["renounce","reject","forswear","disavow","retract","recant","abandon","repudiate"]},
  "abstruse": {d:"Difficult to understand; obscure",pos:"adj",syn:["obscure","arcane","complex","difficult","incomprehensible","esoteric","recondite","impenetrable"]},
  "acumen": {d:"The ability to make good judgments and quick decisions",pos:"n",syn:["shrewdness","insight","wisdom","sharpness","astuteness","intelligence","perception","discernment"]},
  "adulation": {d:"Excessive admiration or praise",pos:"n",syn:["flattery","praise","worship","idolization","fawning","veneration","sycophancy","reverence"]},
  "aloof": {d:"Not friendly or forthcoming; cool and distant",pos:"adj",syn:["distant","detached","remote","cold","reserved","standoffish","indifferent","unfriendly"]},
  "amalgamate": {d:"To combine or unite to form one organization or structure",pos:"v",syn:["merge","combine","unite","integrate","consolidate","blend","fuse","join"]},
  "amorphous": {d:"Without a clearly defined shape or form",pos:"adj",syn:["shapeless","formless","undefined","vague","nebulous","unstructured","unclear","fluid"]},
  "anecdote": {d:"A short account of a particular incident or event",pos:"n",syn:["story","tale","account","incident","narrative","yarn","memoir","sketch"]},
  "animosity": {d:"Strong hostility or resentment",pos:"n",syn:["hostility","hatred","resentment","ill will","antagonism","bitterness","dislike","antipathy"]},
  "annul": {d:"To declare invalid; to cancel officially",pos:"v",syn:["cancel","invalidate","void","nullify","revoke","abolish","rescind","repeal"]},
  "articulate": {d:"Having or showing the ability to speak fluently and clearly",pos:"adj",syn:["eloquent","fluent","well-spoken","expressive","coherent","clear","lucid","communicative"]},
  "aspersion": {d:"An attack on the reputation or integrity of someone",pos:"n",syn:["slur","slander","defamation","smear","insult","criticism","calumny","disparagement"]},
  "astute": {d:"Having an ability to accurately assess situations; clever",pos:"adj",syn:["shrewd","clever","sharp","perceptive","wise","intelligent","cunning","discerning"]},
  "atrophy": {d:"To gradually waste away; to weaken through lack of use",pos:"v",syn:["waste away","wither","degenerate","weaken","deteriorate","decline","shrink","shrivel"]},
  "audacious": {d:"Showing a willingness to take bold risks",pos:"adj",syn:["bold","daring","brave","courageous","fearless","adventurous","reckless","intrepid"]},
  "austere": {d:"Having no comforts or luxuries; plain and simple",pos:"adj",syn:["severe","plain","simple","stark","spartan","harsh","strict","unadorned"]},
  "belie": {d:"To fail to give a true impression of something",pos:"v",syn:["contradict","misrepresent","deny","disguise","mask","conceal","falsify","distort"]},
  "belittle": {d:"To make someone or something seem unimportant",pos:"v",syn:["diminish","minimize","undermine","disparage","demean","trivialize","devalue","disrespect"]},
  "boon": {d:"Something beneficial; a welcome benefit",pos:"n",syn:["benefit","blessing","advantage","gift","asset","godsend","windfall","favor"]},
  "boorish": {d:"Rough and bad-mannered; coarse",pos:"adj",syn:["rude","crude","coarse","vulgar","uncouth","rough","loutish","unmannerly"]},
  "burgeon": {d:"To begin to grow or increase rapidly",pos:"v",syn:["flourish","grow","expand","bloom","thrive","develop","multiply","proliferate"]},
  "byzantine": {d:"Excessively complicated; intricate",pos:"adj",syn:["complex","complicated","intricate","convoluted","labyrinthine","tortuous","elaborate","tangled"]},
  "callous": {d:"Showing or having an insensitive disregard for others",pos:"adj",syn:["insensitive","heartless","cold","unfeeling","unsympathetic","cruel","indifferent","ruthless"]},
  "candor": {d:"The quality of being open and honest",pos:"n",syn:["frankness","honesty","openness","directness","truthfulness","sincerity","transparency","straightforwardness"]},
  "charlatan": {d:"A person falsely claiming to have special knowledge or skill",pos:"n",syn:["fraud","impostor","fake","quack","swindler","con artist","deceiver","phony"]},
  "chide": {d:"To scold or rebuke gently",pos:"v",syn:["scold","rebuke","reprimand","criticize","reproach","admonish","upbraid","berate"]},
  "chicanery": {d:"The use of trickery to achieve goals",pos:"n",syn:["trickery","deception","fraud","dishonesty","manipulation","deceit","duplicity","subterfuge"]},
  "circumvent": {d:"To find a way around an obstacle; to outwit",pos:"v",syn:["bypass","avoid","evade","sidestep","outmaneuver","get around","thwart","outwit"]},
  "clamor": {d:"A loud and confused noise; to shout loudly and insistently",pos:"n",syn:["noise","uproar","din","commotion","racket","outcry","tumult","hubbub"]},
  "coerce": {d:"To persuade someone to do something by using force or threats",pos:"v",syn:["force","compel","pressure","intimidate","threaten","bully","browbeat","dragoon"]},
  "condone": {d:"To accept and allow to continue; to forgive",pos:"v",syn:["tolerate","accept","excuse","overlook","forgive","permit","allow","sanction"]},
  "confound": {d:"To cause surprise or confusion; to prove wrong",pos:"v",syn:["confuse","perplex","puzzle","bewilder","baffle","mystify","surprise","bedevil"]},
  "connive": {d:"To secretly allow wrongdoing; to scheme",pos:"v",syn:["conspire","scheme","plot","collude","collaborate","tolerate","allow","permit"]},
  "consummate": {d:"Showing great skill; complete or perfect",pos:"adj",syn:["perfect","supreme","ultimate","accomplished","expert","skilled","complete","masterful"]},
  "contemptuous": {d:"Showing disdain or lack of respect",pos:"adj",syn:["scornful","disdainful","dismissive","derisive","haughty","condescending","superior","sneering"]},
  "contend": {d:"To struggle or compete; to assert as a position in argument",pos:"v",syn:["argue","claim","assert","maintain","compete","struggle","wrestle","dispute"]},
  "convivial": {d:"Friendly, lively, and enjoyable",pos:"adj",syn:["sociable","friendly","festive","jovial","cheerful","merry","genial","lively"]},
  "corrosive": {d:"Destructive and damaging; tending to weaken or destroy",pos:"adj",syn:["destructive","damaging","erosive","caustic","harmful","acidic","ruinous","deteriorating"]},
  "credence": {d:"Belief in or acceptance of something as true",pos:"n",syn:["belief","trust","faith","acceptance","recognition","confidence","reliance","credibility"]},
  "culpable": {d:"Deserving blame; guilty",pos:"adj",syn:["blameworthy","responsible","guilty","at fault","liable","answerable","censurable","accountable"]},
  "cupidity": {d:"Greed for money or possessions",pos:"n",syn:["greed","avarice","covetousness","acquisitiveness","rapaciousness","materialism","hunger","desire"]},
  "cynical": {d:"Distrusting or disparaging the motives of others",pos:"adj",syn:["skeptical","distrustful","pessimistic","suspicious","scornful","critical","sardonic","jaded"]},
  "daunt": {d:"To make someone feel intimidated or apprehensive",pos:"v",syn:["intimidate","discourage","frighten","unnerve","dishearten","scare","deter","dismay"]},
  "dearth": {d:"A scarcity or lack of something",pos:"n",syn:["scarcity","shortage","lack","deficiency","insufficiency","famine","paucity","absence"]},
  "debunk": {d:"To expose the falseness or sham of",pos:"v",syn:["expose","disprove","discredit","refute","contradict","deflate","unmask","challenge"]},
  "demagogue": {d:"A political leader who appeals to emotions rather than reason",pos:"n",syn:["agitator","rabble-rouser","populist","firebrand","manipulator","demagog","instigator"]},
  "denigrate": {d:"To criticize unfairly; to disparage",pos:"v",syn:["disparage","belittle","criticize","defame","slander","malign","vilify","undermine"]},
  "denounce": {d:"To publicly declare something to be wrong or evil",pos:"v",syn:["condemn","criticize","censure","decry","castigate","attack","accuse","indict"]},
  "depravity": {d:"Moral corruption; wickedness",pos:"n",syn:["corruption","wickedness","immorality","debauchery","vice","sinfulness","perversion","degradation"]},
  "derogatory": {d:"Showing a critical or disrespectful attitude",pos:"adj",syn:["insulting","offensive","disparaging","demeaning","disrespectful","critical","negative","degrading"]},
  "diatribe": {d:"A forceful and bitter verbal attack",pos:"n",syn:["tirade","rant","harangue","attack","denunciation","invective","criticism","polemic"]},
  "didactic": {d:"Intended to teach or moralize; preachy",pos:"adj",syn:["instructive","educational","preachy","moralistic","pedantic","teacherly","informative","prescriptive"]},
  "diffuse": {d:"Spread over a large area; wordy and unclear",pos:"adj",syn:["spread out","scattered","diluted","verbose","wordy","vague","dispersed","widespread"]},
  "discredit": {d:"To harm the reputation of; to reject as unworthy of trust",pos:"v",syn:["undermine","damage","tarnish","smear","disgrace","dishonor","defame","debunk"]},
  "disdain": {d:"The feeling that someone or something is unworthy of regard",pos:"n",syn:["contempt","scorn","derision","disrespect","arrogance","condescension","indifference","disregard"]},
  "dissidence": {d:"Disagreement with official policy or doctrine",pos:"n",syn:["disagreement","rebellion","nonconformity","protest","opposition","dissent","defiance","resistance"]},
  "docile": {d:"Ready to accept control or instruction; submissive",pos:"adj",syn:["submissive","obedient","compliant","tame","manageable","meek","passive","tractable"]},
  "dogma": {d:"A principle or set of principles laid down by authority",pos:"n",syn:["doctrine","belief","tenet","principle","conviction","creed","ideology","teaching"]},
  "draconian": {d:"Excessively harsh or severe",pos:"adj",syn:["harsh","severe","strict","extreme","oppressive","ruthless","drastic","punitive"]},
  "evanescent": {d:"Soon passing out of sight or memory; short-lived",pos:"adj",syn:["fleeting","transient","temporary","short-lived","fading","vanishing","ephemeral","brief"]},
  "excoriate": {d:"To censure or criticize severely",pos:"v",syn:["criticize","censure","denounce","berate","condemn","castigate","lambaste","rebuke"]},
  "exemplary": {d:"Serving as a desirable model; representing best practice",pos:"adj",syn:["model","ideal","perfect","admirable","outstanding","commendable","excellent","worthy"]},
  "exigent": {d:"Requiring immediate attention; demanding",pos:"adj",syn:["urgent","pressing","critical","demanding","essential","necessary","crucial","imperative"]},
  "expirate": {d:"To atone for guilt; to make amends",pos:"v",syn:["atone","make amends","redeem","compensate","rectify","pay for","repent","absolve"]},
  "fatuous": {d:"Silly and pointless; self-satisfied and empty",pos:"adj",syn:["foolish","stupid","silly","inane","empty","absurd","mindless","nonsensical"]},
  "flagrant": {d:"Conspicuously or obviously offensive; blatant",pos:"adj",syn:["blatant","obvious","glaring","outrageous","egregious","brazen","scandalous","open"]},
  "fledgling": {d:"A person or organization that is immature or inexperienced",pos:"adj",syn:["new","emerging","developing","novice","young","budding","nascent","inexperienced"]},
  "florid": {d:"Elaborately ornate; excessively elaborate",pos:"adj",syn:["ornate","elaborate","flowery","excessive","showy","extravagant","overwrought","decorative"]},
  "foment": {d:"To incite or stir up trouble or disorder",pos:"v",syn:["instigate","stir up","incite","provoke","agitate","arouse","encourage","promote"]},
  "forthright": {d:"Direct and outspoken; frank",pos:"adj",syn:["direct","honest","open","candid","frank","plain-spoken","straightforward","blunt"]},
  "gainsay": {d:"To deny or contradict; to speak against",pos:"v",syn:["deny","contradict","oppose","refute","dispute","challenge","negate","disagree"]},
  "garner": {d:"To gather or collect something, especially information or approval",pos:"v",syn:["gather","collect","accumulate","amass","obtain","acquire","earn","harvest"]},
  "glacial": {d:"Extremely slow; relating to or characteristic of ice ages",pos:"adj",syn:["slow","sluggish","frozen","icy","cold","frigid","deliberate","unhurried"]},
  "hubris": {d:"Excessive pride or self-confidence",pos:"n",syn:["arrogance","pride","conceit","egotism","vanity","presumption","overconfidence","self-importance"]},
  "hypocritical": {d:"Behaving in a way that contradicts stated beliefs",pos:"adj",syn:["two-faced","insincere","sanctimonious","dishonest","deceitful","fake","false","inconsistent"]},
  "ignoble": {d:"Not honorable in character or purpose",pos:"adj",syn:["dishonorable","shameful","base","degrading","humble","undignified","contemptible","low"]},
  "illuminate": {d:"To make something clearer; to shed light on",pos:"v",syn:["clarify","explain","enlighten","elucidate","reveal","expose","illustrate","shed light on"]},
  "immutable": {d:"Unchanging over time; not able to be changed",pos:"adj",syn:["unchangeable","fixed","permanent","constant","stable","invariable","unalterable","eternal"]},
  "impassive": {d:"Not feeling or showing emotion",pos:"adj",syn:["emotionless","expressionless","stoic","calm","detached","unmoved","unresponsive","cold"]},
  "impede": {d:"To delay or prevent progress by obstruction",pos:"v",syn:["obstruct","block","hinder","hamper","delay","slow","thwart","impair"]},
  "impetuous": {d:"Acting or done quickly without thought or care",pos:"adj",syn:["rash","hasty","impulsive","reckless","spontaneous","quick","passionate","headstrong"]},
  "impugn": {d:"To dispute the truth, validity, or honesty of something",pos:"v",syn:["challenge","question","dispute","attack","criticize","oppose","contradict","deny"]},
  "inane": {d:"Lacking sense or meaning; stupid or silly",pos:"adj",syn:["stupid","silly","senseless","empty","vapid","pointless","absurd","foolish"]},
  "inchoate": {d:"Just begun and not fully formed or developed",pos:"adj",syn:["undeveloped","incomplete","embryonic","formless","nascent","rudimentary","partial","elementary"]},
  "inimical": {d:"Tending to obstruct or harm; hostile",pos:"adj",syn:["hostile","unfriendly","harmful","damaging","adverse","threatening","detrimental","antagonistic"]},
  "iniquity": {d:"Immoral or grossly unfair behavior; wickedness",pos:"n",syn:["wickedness","injustice","evil","sin","immorality","wrongdoing","villainy","corruption"]},
  "inscrutable": {d:"Impossible to understand or interpret; mysterious",pos:"adj",syn:["mysterious","enigmatic","impenetrable","unfathomable","puzzling","cryptic","baffling","opaque"]},
  "intransigent": {d:"Unwilling to change one's views or agree to compromise",pos:"adj",syn:["stubborn","inflexible","unyielding","obstinate","uncompromising","rigid","determined","recalcitrant"]},
  "inveterate": {d:"Having a long-established habit; firmly established",pos:"adj",syn:["habitual","deep-rooted","established","confirmed","chronic","entrenched","incorrigible","hardened"]},
  "irascible": {d:"Having or showing a tendency to be easily angered",pos:"adj",syn:["irritable","short-tempered","hot-tempered","touchy","testy","angry","bad-tempered","choleric"]},
  "laud": {d:"To praise highly, especially in a public context",pos:"v",syn:["praise","commend","extol","applaud","celebrate","acclaim","honor","glorify"]},
  "loquacious": {d:"Tending to talk a great deal; talkative",pos:"adj",syn:["talkative","verbose","chatty","garrulous","long-winded","voluble","wordy","communicative"]},
  "lugubrious": {d:"Looking or sounding sad and dismal",pos:"adj",syn:["mournful","sad","somber","gloomy","doleful","melancholy","dismal","woeful"]},
  "malediction": {d:"A curse; the utterance of a curse",pos:"n",syn:["curse","damnation","hex","execration","imprecation","anathema","condemnation","denunciation"]},
  "mendacious": {d:"Not telling the truth; lying",pos:"adj",syn:["dishonest","lying","untruthful","deceitful","false","deceptive","duplicitous","fraudulent"]},
  "mendacity": {d:"Untruthfulness; the tendency to be dishonest",pos:"n",syn:["dishonesty","lying","deception","untruthfulness","falseness","deceit","duplicity","fabrication"]},
  "mercurial": {d:"Subject to sudden or unpredictable changes of mood",pos:"adj",syn:["volatile","unpredictable","erratic","capricious","unstable","changeable","impulsive","variable"]},
  "meretricious": {d:"Apparently attractive but having in reality no value",pos:"adj",syn:["showy","flashy","tawdry","superficial","gaudy","false","hollow","specious"]},
  "meritorious": {d:"Deserving reward or praise",pos:"adj",syn:["praiseworthy","commendable","worthy","admirable","excellent","laudable","creditable","honorable"]},
  "militate": {d:"To be a powerful factor in preventing or promoting something",pos:"v",syn:["work against","operate against","counter","oppose","influence","affect","weigh against","hinder"]},
  "misanthropic": {d:"Disliking humankind and avoiding human society",pos:"adj",syn:["antisocial","reclusive","cynical","unfriendly","unsociable","hostile","bitter","alienated"]},
  "misnomer": {d:"A wrong or inaccurate name or designation",pos:"n",syn:["wrong name","error","misname","misnaming","inaccuracy","misconception","misapplication"]},
  "modicum": {d:"A small quantity of something",pos:"n",syn:["small amount","bit","little","trace","hint","touch","particle","minimum"]},
  "mordant": {d:"Having or showing a sharp or critical quality; biting",pos:"adj",syn:["caustic","biting","sharp","cutting","acerbic","scathing","sardonic","acrid"]},
  "moratorium": {d:"A temporary prohibition of an activity",pos:"n",syn:["suspension","ban","halt","freeze","postponement","delay","pause","embargo"]},
  "munificent": {d:"Larger or more generous than is usual or necessary",pos:"adj",syn:["generous","lavish","bountiful","liberal","magnanimous","openhanded","charitable","philanthropic"]},
  "obdurate": {d:"Stubbornly refusing to change one's opinion",pos:"adj",syn:["stubborn","obstinate","inflexible","rigid","unyielding","hardened","unrelenting","intransigent"]},
  "oblivious": {d:"Not aware of or concerned about what is happening",pos:"adj",syn:["unaware","unconscious","ignorant","inattentive","unmindful","heedless","negligent","forgetful"]},
  "obviate": {d:"To remove a need or difficulty; to prevent",pos:"v",syn:["prevent","eliminate","remove","preclude","avoid","forestall","nullify","counteract"]},
  "odious": {d:"Extremely unpleasant; repulsive",pos:"adj",syn:["hateful","detestable","loathsome","repulsive","disgusting","abhorrent","revolting","horrible"]},
  "onerous": {d:"Involving an oppressive amount of effort and difficulty",pos:"adj",syn:["burdensome","demanding","taxing","arduous","troublesome","oppressive","heavy","difficult"]},
  "ostracize": {d:"To exclude from a society or group",pos:"v",syn:["exclude","shun","isolate","banish","reject","exile","expel","blackball"]},
  "overwrought": {d:"In a state of excessive nervousness or agitation",pos:"adj",syn:["agitated","nervous","anxious","emotional","tense","overwrought","distressed","overexcited"]},
  "palliate": {d:"To make less severe without removing the cause",pos:"v",syn:["alleviate","relieve","ease","lessen","reduce","mitigate","soothe","temper"]},
  "palpitate": {d:"To beat irregularly or rapidly, as of the heart",pos:"v",syn:["flutter","throb","beat rapidly","race","pound","tremble","quiver","pulsate"]},
  "paternalistic": {d:"Restricting freedom in a way that suggests a father's role",pos:"adj",syn:["patronizing","protective","domineering","controlling","authoritarian","overbearing","overprotective"]},
  "pejorative": {d:"Expressing contempt or disapproval; derogatory",pos:"adj",syn:["derogatory","disparaging","negative","critical","insulting","offensive","dismissive","belittling"]},
  "pellucid": {d:"Translucently clear; easily understood",pos:"adj",syn:["clear","transparent","lucid","plain","simple","intelligible","comprehensible","limpid"]},
  "penchant": {d:"A strong or habitual liking for something",pos:"n",syn:["liking","fondness","preference","inclination","taste","predilection","affinity","partiality"]},
  "penurious": {d:"Extremely poor; not willing to spend money",pos:"adj",syn:["destitute","impoverished","miserly","stingy","poor","penniless","indigent","mean"]},
  "percipient": {d:"Having a ready insight; discerning",pos:"adj",syn:["perceptive","discerning","astute","insightful","observant","sharp","acute","clever"]},
  "perfunctory": {d:"Carried out with minimal effort; routine",pos:"adj",syn:["cursory","superficial","routine","hasty","mechanical","minimal","halfhearted","quick"]},
  "pernicious": {d:"Having a harmful effect, especially in a gradual way",pos:"adj",syn:["harmful","destructive","damaging","deadly","malicious","toxic","lethal","sinister"]},
  "perpetuate": {d:"To make something continue indefinitely",pos:"v",syn:["maintain","preserve","continue","sustain","keep alive","extend","prolong","immortalize"]},
  "perspicacious": {d:"Having a ready insight into things; shrewd",pos:"adj",syn:["astute","shrewd","perceptive","discerning","insightful","sagacious","wise","sharp"]},
  "petulant": {d:"Childishly sulky or bad-tempered",pos:"adj",syn:["sulky","irritable","fretful","bad-tempered","querulous","peevish","grumpy","touchy"]},
  "phlegmatic": {d:"Having an unemotional and stolidly calm disposition",pos:"adj",syn:["calm","stoic","unresponsive","impassive","stolid","unflappable","composed","unemotional"]},
  "pique": {d:"A feeling of irritation or resentment; to stimulate interest",pos:"n",syn:["irritation","resentment","annoyance","offense","displeasure","anger","hurt","umbrage"]},
  "platitude": {d:"A remark that is too frequently stated to be interesting",pos:"n",syn:["cliche","truism","commonplace","banality","bromide","generality","proverb","saying"]},
  "plebeian": {d:"Of or belonging to the lower social classes; ordinary",pos:"adj",syn:["common","ordinary","lowly","vulgar","proletarian","humble","ignoble","undistinguished"]},
  "poignant": {d:"Evoking a keen sense of sadness or regret",pos:"adj",syn:["touching","moving","emotional","sad","affecting","heartfelt","bittersweet","plaintive"]},
  "polarize": {d:"To divide into two sharply contrasting groups",pos:"v",syn:["divide","split","separate","alienate","antagonize","bifurcate","conflict","oppose"]},
  "polemic": {d:"A strong verbal or written attack on someone's opinions",pos:"n",syn:["argument","attack","critique","diatribe","harangue","tirade","denunciation","controversy"]},
  "pompous": {d:"Affectedly grand, solemn, or self-important",pos:"adj",syn:["arrogant","self-important","pretentious","conceited","haughty","grandiose","bombastic","puffed up"]},
  "portend": {d:"To be a sign or warning of something imminent",pos:"v",syn:["foreshadow","foretell","predict","presage","signal","indicate","warn","augur"]},
  "precipitous": {d:"Dangerously high or steep; hasty and rash",pos:"adj",syn:["steep","sudden","sharp","abrupt","hasty","rash","sheer","headlong"]},
  "prevaricate": {d:"To speak or act evasively; to lie",pos:"v",syn:["equivocate","evade","dodge","hedge","lie","mislead","be evasive","obfuscate"]},
  "probity": {d:"The quality of having strong moral principles; honesty",pos:"n",syn:["integrity","honesty","righteousness","honor","virtue","uprightness","rectitude","morality"]},
  "proclivity": {d:"A tendency to choose or do something regularly",pos:"n",syn:["tendency","inclination","preference","predisposition","disposition","propensity","leaning","penchant"]},
  "profligate": {d:"Recklessly extravagant or wasteful; immoral",pos:"adj",syn:["extravagant","wasteful","dissolute","reckless","immoral","decadent","degenerate","wanton"]},
  "prolix": {d:"Using or containing too many words",pos:"adj",syn:["verbose","wordy","long-winded","rambling","garrulous","tedious","diffuse","loquacious"]},
  "propitious": {d:"Giving or indicating a good chance of success",pos:"adj",syn:["favorable","auspicious","promising","fortunate","advantageous","positive","hopeful","encouraging"]},
  "provincial": {d:"Of or concerning a province; unsophisticated or narrow-minded",pos:"adj",syn:["narrow-minded","unsophisticated","parochial","rural","insular","limited","regional","small-town"]},
  "puerile": {d:"Childishly silly and trivial",pos:"adj",syn:["childish","immature","juvenile","silly","infantile","babyish","naive","frivolous"]},
  "pugnacious": {d:"Eager or quick to argue, quarrel, or fight",pos:"adj",syn:["aggressive","combative","belligerent","hostile","contentious","argumentative","quarrelsome","truculent"]},
  "pundit": {d:"An expert in a field who commentates publicly",pos:"n",syn:["expert","authority","commentator","analyst","critic","specialist","intellectual","scholar"]},
  "quixotic": {d:"Exceedingly idealistic; unrealistic and impractical",pos:"adj",syn:["idealistic","unrealistic","romantic","impractical","dreamy","fanciful","visionary","utopian"]},
  "recant": {d:"To publicly proclaim one's previous position to be wrong",pos:"v",syn:["retract","withdraw","take back","disavow","renounce","revoke","repudiate","abjure"]},
  "recondite": {d:"Not known by many people; obscure",pos:"adj",syn:["obscure","arcane","esoteric","rare","specialized","abstruse","little-known","deep"]},
  "redoubtable": {d:"Causing awe or fear; formidable",pos:"adj",syn:["formidable","fearsome","impressive","daunting","powerful","strong","intimidating","mighty"]},
  "refulgent": {d:"Shining very brightly",pos:"adj",syn:["brilliant","radiant","gleaming","glowing","bright","luminous","shining","resplendent"]},
  "remonstrate": {d:"To make a strongly worded protest",pos:"v",syn:["protest","object","complain","argue","challenge","dispute","disagree","oppose"]},
  "reprehensible": {d:"Deserving censure or condemnation",pos:"adj",syn:["disgraceful","contemptible","terrible","deplorable","shameful","unacceptable","inexcusable","blameworthy"]},
  "rescind": {d:"To revoke, cancel, or repeal an order or agreement",pos:"v",syn:["cancel","revoke","repeal","withdraw","overturn","annul","abolish","nullify"]},
  "restive": {d:"Unable to remain still or unwilling to cooperate",pos:"adj",syn:["restless","uneasy","unruly","agitated","anxious","fidgety","impatient","obstinate"]},
  "rhetoric": {d:"Language designed to persuade; the art of effective speaking",pos:"n",syn:["persuasion","oratory","eloquence","speech","language","style","delivery","expression"]},
  "sanctimonious": {d:"Making a show of being morally superior",pos:"adj",syn:["self-righteous","preachy","holier-than-thou","hypocritical","smug","moralistic","superior","priggish"]},
  "sedulous": {d:"Showing dedication and diligence",pos:"adj",syn:["diligent","hardworking","assiduous","industrious","persistent","tireless","dedicated","thorough"]},
  "sinister": {d:"Giving the impression of harmful or evil intent",pos:"adj",syn:["ominous","threatening","menacing","evil","dark","wicked","malevolent","foreboding"]},
  "skeptical": {d:"Not easily convinced; having doubts about something",pos:"adj",syn:["doubtful","dubious","questioning","uncertain","unconvinced","suspicious","disbelieving","cynical"]},
  "slander": {d:"A false and damaging statement about someone",pos:"n",syn:["defamation","libel","calumny","falsehood","smear","lie","misrepresentation","aspersion"]},
  "solvent": {d:"Financially able to pay debts; having enough money",pos:"adj",syn:["financially stable","creditworthy","in the black","prosperous","sound","secure","viable","profitable"]},
  "sophistry": {d:"A clever but false argument intended to deceive",pos:"n",syn:["fallacy","deception","illogic","casuistry","speciousness","deceptive argument","misleading reasoning"]},
  "stagnant": {d:"Having no current of water or air; showing no activity",pos:"adj",syn:["still","motionless","stale","inactive","dormant","sluggish","static","inert"]},
  "steadfast": {d:"Resolutely or dutifully firm and unwavering",pos:"adj",syn:["firm","resolute","unwavering","determined","committed","loyal","dedicated","constant"]},
  "stentorian": {d:"Loud and powerful in sound",pos:"adj",syn:["loud","booming","thunderous","resonant","powerful","deafening","thundering","ear-splitting"]},
  "stigmatize": {d:"To regard as worthy of disgrace or great disapproval",pos:"v",syn:["brand","shame","discredit","mark","disgrace","label","condemn","ostracize"]},
  "stultify": {d:"To make someone appear foolish; to impair by tedium",pos:"v",syn:["frustrate","stifle","numb","bore","impair","undermine","deaden","sap"]},
  "subversive": {d:"Seeking to undermine established power or authority",pos:"adj",syn:["rebellious","disruptive","dangerous","undermining","treasonous","insurgent","radical","seditious"]},
  "supercilious": {d:"Behaving as if one is superior to others",pos:"adj",syn:["arrogant","haughty","condescending","disdainful","snobbish","superior","contemptuous","lordly"]},
  "supine": {d:"Failing to act; passive and inactive",pos:"adj",syn:["passive","inactive","lethargic","indifferent","apathetic","compliant","spineless","submissive"]},
  "sycophantic": {d:"Acting in an excessively flattering way toward powerful people",pos:"adj",syn:["fawning","flattering","obsequious","servile","ingratiating","unctuous","groveling","bootlicking"]},
  "tacit": {d:"Understood or implied without being directly stated",pos:"adj",syn:["implicit","unstated","implied","understood","silent","unspoken","inferred","assumed"]},
  "tendentious": {d:"Promoting a particular point of view; biased",pos:"adj",syn:["biased","one-sided","partisan","slanted","prejudiced","partial","opinionated","polemical"]},
  "terse": {d:"Sparing in the use of words; abrupt",pos:"adj",syn:["brief","concise","short","curt","abrupt","succinct","to the point","clipped"]},
  "tortuous": {d:"Full of twists and turns; excessively complex",pos:"adj",syn:["winding","twisted","complex","convoluted","complicated","indirect","meandering","circuitous"]},
  "tractable": {d:"Easy to control or influence; manageable",pos:"adj",syn:["manageable","controllable","compliant","docile","obedient","flexible","submissive","cooperative"]},
  "transitory": {d:"Not permanent; lasting only for a short time",pos:"adj",syn:["temporary","fleeting","brief","short-lived","transient","momentary","passing","impermanent"]},
  "trite": {d:"Overused and consequently lacking in interest",pos:"adj",syn:["cliche","banal","hackneyed","unoriginal","overused","stale","dull","commonplace"]},
  "turbid": {d:"Cloudy, opaque, or thick with suspended matter",pos:"adj",syn:["murky","cloudy","muddy","unclear","opaque","thick","hazy","dirty"]},
  "unconscionable": {d:"Not right or reasonable; shockingly unfair",pos:"adj",syn:["unreasonable","excessive","outrageous","unjust","unethical","indefensible","monstrous","wicked"]},
  "understate": {d:"To express something less strongly than the facts justify",pos:"v",syn:["minimize","downplay","play down","belittle","diminish","trivialize","soft-pedal","tone down"]},
  "undulate": {d:"To move with a smooth wave-like motion",pos:"v",syn:["wave","ripple","flow","oscillate","roll","surge","swell","undulate"]},
  "unfetter": {d:"To release from restrictions or restraints",pos:"v",syn:["free","liberate","release","emancipate","unchain","unconstrain","unshackle","untie"]},
  "unilateral": {d:"Performed by only one party; one-sided",pos:"adj",syn:["one-sided","independent","singular","unilateral","sole","individual","solo","autonomous"]},
  "usurp": {d:"To take a position of power illegally or by force",pos:"v",syn:["seize","take over","assume","appropriate","arrogate","commandeer","snatch","wrest"]},
  "vacuous": {d:"Having or showing a lack of thought or intelligence",pos:"adj",syn:["empty","blank","mindless","unintelligent","stupid","inane","hollow","vapid"]},
  "venal": {d:"Showing or motivated by susceptibility to bribery",pos:"adj",syn:["corrupt","bribable","dishonest","mercenary","fraudulent","dishonest","unscrupulous","self-seeking"]},
  "vexatious": {d:"Causing annoyance or distress; troublesome",pos:"adj",syn:["annoying","troublesome","irritating","bothersome","aggravating","irksome","exasperating","trying"]},
  "viable": {d:"Capable of working successfully; feasible",pos:"adj",syn:["feasible","workable","practical","possible","achievable","sustainable","realistic","valid"]},
  "vindictive": {d:"Having or showing a strong desire for revenge",pos:"adj",syn:["vengeful","spiteful","retaliatory","malicious","unforgiving","bitter","resentful","revengeful"]},
  "virulent": {d:"Extremely harmful or malignant; bitterly hostile",pos:"adj",syn:["deadly","harmful","toxic","bitter","hostile","malicious","poisonous","lethal"]},
  "viscous": {d:"Having a thick, sticky consistency between solid and liquid",pos:"adj",syn:["thick","sticky","gluey","gelatinous","syrupy","glutinous","gummy","adhesive"]},
  "voluble": {d:"Talking fluently, readily, or incessantly",pos:"adj",syn:["talkative","fluent","verbose","loquacious","chatty","garrulous","articulate","forthcoming"]},
  "waver": {d:"To be undecided between two options; to vacillate",pos:"v",syn:["hesitate","vacillate","fluctuate","falter","oscillate","dither","sway","equivocate"]},
  "zealotry": {d:"Excessive and uncompromising pursuit of ideals",pos:"n",syn:["fanaticism","extremism","fervor","obsession","passion","radicalism","devotion","conviction"]}
};

function lookupWord(w) {
  var existing = WORDS.find(function(x){ return x.w.toLowerCase() === w.toLowerCase(); });
  if (existing) return existing;
  var key = w.toLowerCase();
  if (SAT_DICT[key]) return { w: w.charAt(0).toUpperCase() + w.slice(1), d: SAT_DICT[key].d, pos: SAT_DICT[key].pos, syn: SAT_DICT[key].syn };
  return null;
}

// ── Custom cards & deleted words (localStorage cache, keyed by deckId) ──
function customCardsKey(deckId) {
  return deckId ? "lexicon_custom_cards_" + deckId : "lexicon_custom_cards";
}
function getCustomCards(deckId) {
  try {
    var raw = JSON.parse(localStorage.getItem(customCardsKey(deckId)) || "[]");
    // Sanitize: drop cards missing a word or definition (legacy bug)
    var clean = raw.filter(function(c){ return c && c.w && c.d && String(c.d).trim(); });
    if(clean.length !== raw.length) localStorage.setItem(customCardsKey(deckId), JSON.stringify(clean));
    return clean;
  } catch(e) { return []; }
}
function saveCustomCards(deckId, cards) {
  localStorage.setItem(customCardsKey(deckId), JSON.stringify(cards));
}
function getDeletedWords() {
  try { return JSON.parse(localStorage.getItem("lexicon_deleted_words") || "[]"); } catch(e) { return []; }
}
function saveDeletedWords(words) {
  localStorage.setItem("lexicon_deleted_words", JSON.stringify(words));
}

const TIERS = [{value:"all",label:"All"},{value:"cards",label:"Cards"},{value:"easy",label:"Easy"},{value:"med",label:"Medium"},{value:"hard",label:"Hard"}];
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
const posLabel = function(p) { return p==="n"?"noun":p==="v"?"verb":p==="adv"?"adverb":"adjective"; };

function scoreTier(s){
  if(s>=70) return {tier:"full",pts:1,color:"#5cb870",bg:"rgba(92,184,112,0.1)",label:"Nailed it",icon:"\u2713"};
  if(s>=40) return {tier:"partial",pts:0.5,color:"#d4a843",bg:"rgba(212,168,67,0.06)",label:"Close",icon:"\u2248"};
  return {tier:"miss",pts:0,color:"#d45555",bg:"rgba(212,85,85,0.08)",label:"Off target",icon:"\u2717"};
}

function normalizeWord(s) {
  return s.toLowerCase().replace(/[^a-z\s-]/g, "").trim();
}

function stemWord(w) {
  return w.replace(/(ing|tion|sion|ment|ness|ous|ive|ful|less|able|ible|ity|ally|ly|ed|er|est|al|ism|ist|ent|ant|ary|ory|ic|ical|ize|ise|ify|ate)$/, "");
}

// Jaccard similarity on word sets (0-1)
function wordSetSimilarity(a, b) {
  var setA = a.split(/\s+/).filter(function(w) { return w.length > 2; });
  var setB = b.split(/\s+/).filter(function(w) { return w.length > 2; });
  if (setA.length === 0 || setB.length === 0) return 0;
  var intersection = 0;
  for (var i = 0; i < setA.length; i++) {
    for (var j = 0; j < setB.length; j++) {
      if (setA[i] === setB[j] || (setA[i].length > 3 && setB[j].length > 3 && stemWord(setA[i]) === stemWord(setB[j]))) {
        intersection++;
        break;
      }
    }
  }
  var union = setA.length + setB.length - intersection;
  return union > 0 ? intersection / union : 0;
}

// Load user-learned definitions from localStorage
function getLearnedDefs(word) {
  try {
    var all = JSON.parse(localStorage.getItem("lexicon_learned") || "{}");
    return all[word.toLowerCase()] || [];
  } catch(e) { return []; }
}

function saveLearnedDef(word, def) {
  try {
    var all = JSON.parse(localStorage.getItem("lexicon_learned") || "{}");
    var key = word.toLowerCase();
    if (!all[key]) all[key] = [];
    var normalized = normalizeWord(def);
    // Don't add duplicates
    var exists = all[key].some(function(d) { return normalizeWord(d) === normalized; });
    if (!exists) all[key].push(def);
    localStorage.setItem("lexicon_learned", JSON.stringify(all));
  } catch(e) { console.error("Failed to save learned def:", e); }
}

function offlineJudge(wordEntry, userAnswer) {
  var ua = normalizeWord(userAnswer);
  var def = normalizeWord(wordEntry.d);
  var synonyms = (wordEntry.syn || []).map(normalizeWord);
  var uaWords = ua.split(/\s+/).filter(function(w) { return w.length > 0; });

  // Reject answers too short to be meaningful
  var meaningfulWords = uaWords.filter(function(w) { return w.length >= 3; });
  if (ua.length < 3 || meaningfulWords.length === 0) {
    return { score: 0, note: "Answer too short" };
  }

  // Evaluate ALL signals, keep the best — no early returns
  var bestScore = 0;
  var bestNote = "No match found";
  function consider(score, note) {
    score = Math.round(score);
    if (score > bestScore) { bestScore = score; bestNote = note; }
  }

  // Helper: compute what fraction of words in `source` appear in `target` (precision-like)
  function wordPrecision(sourceWords, targetWords) {
    var hits = 0;
    for (var i = 0; i < sourceWords.length; i++) {
      for (var j = 0; j < targetWords.length; j++) {
        if (sourceWords[i] === targetWords[j] ||
            (sourceWords[i].length > 3 && targetWords[j].length > 3 &&
             stemWord(sourceWords[i]) === stemWord(targetWords[j]))) {
          hits++;
          break;
        }
      }
    }
    return sourceWords.length > 0 ? hits / sourceWords.length : 0;
  }

  // === LEARNED DEFINITIONS ===
  var learned = getLearnedDefs(wordEntry.w);
  for (var ld = 0; ld < learned.length; ld++) {
    var learnedNorm = normalizeWord(learned[ld]);
    if (ua === learnedNorm) {
      consider(95, "Matches your learned definition");
      continue;
    }
    // Continuous scoring based on word-set similarity
    var learnedSim = wordSetSimilarity(ua, learnedNorm);
    if (learnedSim >= 0.25) {
      // 0.25→61, 0.5→80, 0.7→90, 1.0→95
      consider(Math.min(95, 50 + learnedSim * 45), "Matches your learned definition");
    }
    // Phrase containment — only when substantial
    if (learnedNorm.length >= 4) {
      if (ua.includes(learnedNorm) && learnedNorm.length / ua.length >= 0.5) {
        consider(88, "Matches your learned definition");
      } else if (learnedNorm.includes(ua) && ua.length / learnedNorm.length >= 0.6) {
        consider(82, "Matches your learned definition");
      }
    }
  }

  // === DEFINITION SIMILARITY ===
  // Blend Jaccard (symmetric overlap) with precision (what % of user's words hit the definition).
  // This rewards concise correct answers: "great distress" for "a cause of great distress"
  // gets low Jaccard (2/5) but high precision (2/2 = 1.0).
  var defWords = def.split(/\s+/).filter(function(w) { return w.length > 2; });
  var defSim = wordSetSimilarity(ua, def);
  var precision = wordPrecision(meaningfulWords, defWords);
  var blended = defSim * 0.4 + precision * 0.6;
  if (blended >= 0.08) {
    // Continuous: 0.1→14, 0.3→33, 0.5→51, 0.7→69, 0.85→83, 1.0→97
    var defScore = Math.min(97, Math.round(blended * 97));
    var defLabel = defScore >= 85 ? "Excellent definition" :
                   defScore >= 70 ? "Great definition" :
                   defScore >= 50 ? "Good definition" : "Partially correct";
    consider(defScore, defLabel);
  }

  // === SYNONYM MATCHING ===
  var bestSynOverlap = 0;

  for (var i = 0; i < synonyms.length; i++) {
    var syn = synonyms[i];
    var synWordsSplit = syn.split(/\s+/).filter(function(w) { return w.length > 0; });
    var synMeaningful = synWordsSplit.filter(function(w) { return w.length >= 3; });

    // Exact full match — scale score by word length for granularity
    // "prodigious" (10) → 92, "fake" (4) → 86, "big" (3) → 85
    if (ua === syn) {
      consider(Math.min(92, 82 + Math.min(ua.length, 10)), "Synonym match");
      continue;
    }

    // Single-word matching: exact or stem only (NO substrings — this prevents "ash" matching "rash")
    if (synMeaningful.length === 1) {
      for (var mw = 0; mw < meaningfulWords.length; mw++) {
        if (meaningfulWords[mw] === synMeaningful[0]) {
          // Exact word inside user's answer — "a scourge" matches synonym "scourge"
          consider(Math.min(90, 80 + Math.min(meaningfulWords[mw].length, 10)), "Synonym match");
        } else if (meaningfulWords[mw].length >= 4 && synMeaningful[0].length >= 4) {
          var uwStem = stemWord(meaningfulWords[mw]);
          var swStem = stemWord(synMeaningful[0]);
          if (uwStem.length >= 3 && swStem.length >= 3 && uwStem === swStem) {
            // Stem match — "fabricating" matches "fabricated" — slightly lower than exact
            consider(Math.min(85, 73 + Math.min(meaningfulWords[mw].length, 12)), "Synonym match");
          }
        }
      }
    }

    // Multi-word synonym or multi-word answer: use word set similarity
    if (synWordsSplit.length > 1 || uaWords.length > 1) {
      var synSim = wordSetSimilarity(ua, syn);
      if (synSim >= 0.25) {
        // 0.25→53, 0.5→66, 0.75→79, 1.0→92
        consider(Math.min(92, Math.round(40 + synSim * 52)), "Synonym match");
      }

      // Track partial word overlap for weak signal
      var overlap = 0;
      for (var k = 0; k < synWordsSplit.length; k++) {
        for (var m = 0; m < uaWords.length; m++) {
          if (synWordsSplit[k].length > 2 && uaWords[m].length > 2 &&
              (synWordsSplit[k] === uaWords[m] ||
               (synWordsSplit[k].length > 3 && uaWords[m].length > 3 &&
                stemWord(synWordsSplit[k]) === stemWord(uaWords[m])))) {
            overlap++;
            break;
          }
        }
      }
      if (overlap > bestSynOverlap) bestSynOverlap = overlap;
    }

    // Phrase containment — only for multi-word phrases where shorter ≥ 40% of longer
    if (syn.length >= 6 && ua.length >= 6) {
      if (ua.includes(syn) && syn.length / ua.length >= 0.4) {
        consider(Math.min(82, Math.round(62 + (syn.length / ua.length) * 20)), "Synonym match");
      } else if (syn.includes(ua) && ua.length / syn.length >= 0.6) {
        consider(Math.min(75, Math.round(55 + (ua.length / syn.length) * 20)), "Partial synonym match");
      }
    }
  }

  // === STEM HITS ACROSS ALL SYNONYMS ===
  var uaStems = meaningfulWords.filter(function(w) { return w.length >= 4; }).map(stemWord).filter(function(s) { return s.length >= 3; });
  var allSynStems = [];
  for (var s = 0; s < synonyms.length; s++) {
    synonyms[s].split(/\s+/).forEach(function(sw) {
      if (sw.length >= 4) {
        var st = stemWord(sw);
        if (st.length >= 3) allSynStems.push(st);
      }
    });
  }
  if (uaStems.length > 0 && allSynStems.length > 0) {
    var stemHits = 0;
    for (var a = 0; a < uaStems.length; a++) {
      if (allSynStems.indexOf(uaStems[a]) !== -1) stemHits++;
    }
    if (stemHits > 0) {
      var stemRatio = stemHits / uaStems.length;
      consider(Math.min(75, Math.round(45 + stemHits * 8 + stemRatio * 15)), "Partial synonym match");
    }
  }

  // === WEAK SIGNAL: partial synonym word overlap ===
  if (bestSynOverlap > 0) {
    consider(Math.min(40, 20 + bestSynOverlap * 10), "Loosely related");
  }

  return { score: bestScore, note: bestNote };
}

async function aiJudge(word, correctDef, userAnswer, wordEntry, onAiUnavailable, mode) {
  mode = mode || "definition";
  var offline;
  if (mode === "definition") {
    offline = offlineJudge(wordEntry, userAnswer);
    if (offline.score >= 80) return offline;
  } else {
    // Sentence mode has no meaningful offline judge — at best we can check whether
    // the word (or its stem) actually appears in the sentence.
    var wordNorm = normalizeWord(word);
    var wStem = stemWord(wordNorm);
    var sentenceWords = normalizeWord(userAnswer).split(/\s+/);
    var hasWord = sentenceWords.some(function(w) {
      return w === wordNorm || (w.length >= 4 && wStem.length >= 3 && stemWord(w) === wStem);
    });
    offline = hasWord
      ? { score: 50, note: "Word used — AI judge offline" }
      : { score: 0, note: "Word not found in sentence" };
  }

  try {
    var res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word, definition: correctDef, answer: userAnswer, mode: mode })
    });
    if (res.status === 402) {
      if (onAiUnavailable) onAiUnavailable();
      return offline;
    }
    if (!res.ok) return offline;
    var data = await res.json();
    if (typeof data.score !== "number") return offline;
    if (data.score > offline.score) return { score: Math.round(data.score), note: data.note || "AI judged" };
    return offline;
  } catch (e) {
    return offline;
  }
}

// Levenshtein distance — small, used only for typing-the-word mode
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  var row = [];
  for (var i = 0; i <= b.length; i++) row[i] = i;
  for (var i = 1; i <= a.length; i++) {
    var prev = i;
    for (var j = 1; j <= b.length; j++) {
      var val = a.charCodeAt(i-1) === b.charCodeAt(j-1) ? row[j-1] : Math.min(row[j-1], Math.min(prev, row[j])) + 1;
      row[j-1] = prev; prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Judge the def→word typing mode: user types the target word (or close variant)
function wordMatchJudge(targetWord, userAnswer) {
  var target = normalizeWord(targetWord);
  var user = normalizeWord(userAnswer);
  if (!user) return { score: 0, note: "Empty answer" };
  if (user === target) return { score: 100, note: "Exact match" };
  var tStem = stemWord(target);
  var uStem = stemWord(user);
  if (tStem.length >= 3 && uStem.length >= 3 && tStem === uStem) return { score: 90, note: "Same root word" };
  var dist = levenshtein(target, user);
  if (dist === 1 && target.length >= 4) return { score: 80, note: "Close — typo?" };
  if (dist === 2 && target.length >= 6) return { score: 60, note: "Close — typo?" };
  return { score: 0, note: "Wrong word" };
}

var C = {
  bg:"#0c0c0e",card:"#131316",cardBorder:"#1e1e22",
  text:"#dcdce0",textMuted:"#9a9aa0",textDim:"#7a7a82",
  white:"#e4e4e8",accent:"#b8b8be",btnBg:"#a0a0a6",btnText:"#0c0c0e",
  green:"#5cb870",greenBg:"rgba(92,184,112,0.1)",
  red:"#d45555",redBg:"rgba(212,85,85,0.08)",
  gold:"#d4a843",goldBg:"rgba(212,168,67,0.06)",
  inputBg:"#0e0e11",inputBorder:"#222228",
  purple:"#9b8ec4",purpleBg:"rgba(155,142,196,0.08)",
};
var styles = {
  app:{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Roboto', sans-serif",fontWeight:300,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px",boxSizing:"border-box"},
  title:{fontSize:"32px",fontWeight:100,letterSpacing:"8px",textTransform:"uppercase",marginBottom:"4px",color:C.white},
  subtitle:{fontSize:"11px",letterSpacing:"4px",textTransform:"uppercase",color:C.textMuted,marginBottom:"40px"},
  card:{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:"3px",padding:"24px 20px",width:"100%",maxWidth:"680px",boxSizing:"border-box"},
  cardTitle:{fontSize:"15px",fontWeight:400,letterSpacing:"3px",textTransform:"uppercase",color:C.white,marginBottom:"18px",paddingBottom:"12px",borderBottom:"1px solid "+C.cardBorder},
  label:{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:C.textMuted,marginBottom:"10px",display:"block"},
  btn:{background:C.btnBg,color:C.btnText,border:"none",padding:"14px 32px",fontSize:"12px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s"},
  btnOutline:{background:"transparent",color:C.text,border:"1px solid "+C.inputBorder,padding:"10px 20px",fontSize:"11px",fontFamily:"'Roboto', sans-serif",fontWeight:300,letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s"},
  input:{background:C.inputBg,border:"1px solid "+C.inputBorder,borderBottom:"2px solid #333",color:C.white,padding:"14px 16px",fontSize:"18px",fontFamily:"'Roboto', sans-serif",fontWeight:300,borderRadius:"2px",width:"100%",outline:"none",boxSizing:"border-box",textAlign:"center"},
  timer:{fontFamily:"'Roboto Mono', monospace",fontSize:"42px",fontWeight:100,color:C.white,letterSpacing:"2px",textAlign:"center"},
  choiceBtn:{flex:"1 1 100%",minWidth:"0",background:"#18181c",border:"1px solid "+C.inputBorder,color:C.text,padding:"14px 16px",fontSize:"14px",fontFamily:"'Roboto', sans-serif",fontWeight:300,cursor:"pointer",borderRadius:"2px",textAlign:"left",transition:"all 0.15s",lineHeight:"1.35"},
};

function ScoreBar(props){
  var score = props.score;
  var height = props.height || 8;
  var t = scoreTier(score);
  var grad = score >= 70 ? "linear-gradient(90deg, "+C.green+", #7dd98f)" : score >= 40 ? "linear-gradient(90deg, "+C.gold+", #f0d878)" : "linear-gradient(90deg, "+C.red+", #ff8a8a)";
  return(
    <div style={{display:"flex",alignItems:"center",gap:"10px",width:"100%"}}>
      <div style={{flex:1,height:height+"px",background:"#1e1e22",borderRadius:height/2+"px",overflow:"hidden"}}>
        <div style={{width:score+"%",height:"100%",borderRadius:height/2+"px",background:grad,transition:"width 0.6s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
      <span style={{fontSize:"13px",fontWeight:400,color:t.color,minWidth:"36px",textAlign:"right",fontFamily:"'Roboto Mono', monospace"}}>{score}%</span>
    </div>
  );
}

function Timer(props){
  var running = props.running, onTick = props.onTick, resetKey = props.resetKey;
  var [ms, setMs] = useState(0);
  var ref = useRef(null);
  var startRef = useRef(0);
  useEffect(function(){ setMs(0); if(ref.current) cancelAnimationFrame(ref.current); }, [resetKey]);
  useEffect(function(){
    if(running){
      startRef.current = performance.now() - ms;
      var tick = function(){ var e = performance.now() - startRef.current; setMs(e); if(onTick) onTick(e); ref.current = requestAnimationFrame(tick); };
      ref.current = requestAnimationFrame(tick);
    } else { if(ref.current) cancelAnimationFrame(ref.current); }
    return function(){ if(ref.current) cancelAnimationFrame(ref.current); };
  }, [running]);
  var fmt = function(t){ var tot=Math.floor(t); var m=Math.floor(tot/60000); var s=Math.floor((tot%60000)/1000); var cs=Math.floor((tot%1000)/10); return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+"."+String(cs).padStart(2,"0"); };
  return <div style={styles.timer}>{fmt(ms)}</div>;
}

function SegmentedControl(props){
  var options = props.options, value = props.value, onChange = props.onChange;
  return(
    <div style={{display:"flex",border:"1px solid "+C.inputBorder,borderRadius:"2px",overflow:"hidden"}}>
      {options.map(function(opt){
        return <button key={opt.value} onClick={function(){ onChange(opt.value); }} style={{
          flex:1,padding:"10px 12px",fontSize:"11px",fontFamily:"'Roboto', sans-serif",
          fontWeight:value===opt.value?400:300,letterSpacing:"1.5px",textTransform:"uppercase",
          background:value===opt.value?C.accent:"transparent",color:value===opt.value?C.bg:C.textMuted,
          border:"none",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",
        }}>{opt.label}</button>;
      })}
    </div>
  );
}

function FeedbackCard(props) {
  var answered = props.answered;
  var word = props.word;
  var userAnswer = props.userAnswer;
  var [learned, setLearned] = useState(false);
  if (!answered || !answered.score && answered.score !== 0) return null;
  var learnMode = props.learnMode;
  var t = scoreTier(answered.score);
  // Learn mode saves the typed phrase as an acceptable definition for this word.
  // It only makes sense for definition-typing; skip it for sentence / Final Frontier results.
  var canLearn = props.canLearn !== false && !(answered && (answered.defResult || answered.sentResult));
  var showLearn = learnMode && canLearn && userAnswer && userAnswer.trim().length > 0;
  var handleLearn = function() {
    saveLearnedDef(word.w, userAnswer.trim());
    setLearned(true);
  };
  var hasBoth = answered.defResult && answered.sentResult;
  return (
    <div style={{marginTop:"16px"}}>
      {hasBoth ? <div style={{marginBottom:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.textDim,minWidth:"70px",textAlign:"left"}}>Definition</span>
          <div style={{flex:1}}><ScoreBar score={answered.defResult.score}/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.textDim,minWidth:"70px",textAlign:"left"}}>Sentence</span>
          <div style={{flex:1}}><ScoreBar score={answered.sentResult.score}/></div>
        </div>
      </div> : <div style={{marginBottom:"12px"}}><ScoreBar score={answered.score}/></div>}
      <div style={{padding:"12px 16px",borderRadius:"2px",marginBottom:"8px",background:t.bg,border:"1px solid "+t.color}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:"13px",fontWeight:400,color:t.color}}>
            {t.icon + " " + t.label + " \u2014 " + (t.pts===1?"1 point":t.pts===0.5?"0.5 points":"0 points")}
          </div>
          <div style={{fontSize:"18px",fontWeight:400,color:t.color,fontFamily:"'Roboto Mono', monospace"}}>{answered.score}%</div>
        </div>
        {answered.note ? <div style={{fontSize:"11px",color:C.textDim,marginTop:"4px"}}>{answered.note}</div> : null}
      </div>
      <div style={{fontSize:"12px",color:C.textMuted,lineHeight:"1.5"}}>
        <span style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.textDim}}>Definition: </span>{word.d}
      </div>
      {showLearn ? (
        <div style={{marginTop:"10px"}}>
          {learned ? (
            <div style={{fontSize:"11px",color:C.green,letterSpacing:"1px",padding:"8px 12px",background:C.greenBg,borderRadius:"2px",border:"1px solid rgba(92,184,112,0.2)"}}>
              {"\u2713 Learned! Your answer will be accepted next time."}
            </div>
          ) : (
            <button onClick={handleLearn} style={{
              background:learnMode?"rgba(155,142,196,0.2)":C.purpleBg,
              border:learnMode?"2px solid rgba(155,142,196,0.5)":"1px solid rgba(155,142,196,0.25)",
              color:C.purple,
              padding:learnMode?"12px 16px":"8px 16px",
              fontSize:learnMode?"13px":"11px",
              fontFamily:"'Roboto', sans-serif",fontWeight:400,
              letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",
              transition:"all 0.2s",width:"100%",
            }}
              onMouseEnter={function(e){e.target.style.background="rgba(155,142,196,0.25)"}}
              onMouseLeave={function(e){e.target.style.background=learnMode?"rgba(155,142,196,0.2)":C.purpleBg}}>
              {learnMode ? "\u2714 Learn this answer" : "I was right \u2014 Learn this answer"}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function LearnRowButton(props) {
  var [saved, setSaved] = useState(false);
  return saved ? (
    <span style={{fontSize:"9px",color:C.green,letterSpacing:"1px"}}>{"\u2713 Learned"}</span>
  ) : (
    <button onClick={function(){ saveLearnedDef(props.word, props.answer); setSaved(true); }} style={{
      background:C.purpleBg,border:"1px solid rgba(155,142,196,0.3)",color:C.purple,
      padding:"4px 10px",fontSize:"9px",fontFamily:"'Roboto', sans-serif",fontWeight:400,
      letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",
      transition:"all 0.15s",whiteSpace:"nowrap",
    }}
      onMouseEnter={function(e){e.target.style.background="rgba(155,142,196,0.2)"}}
      onMouseLeave={function(e){e.target.style.background=C.purpleBg}}>
      Learn
    </button>
  );
}

export default function SATVocab(){
  var [screen, setScreen] = useState("setup");
  var [mode, setMode] = useState("race");
  var [learnMode, setLearnMode] = useState(false);
  var [direction, setDirection] = useState("w2d"); // "w2d" = word→def, "d2w" = def→word
  var [inputMode, setInputMode] = useState("choice"); // "choice" = multiple choice, "type" = typed
  var [typeTarget, setTypeTarget] = useState("definition"); // "definition" | "sentence" | "both" — only active when usesAI
  var [aiUnavailable, setAiUnavailable] = useState(false);
  // Back-compat shim: keep isTyped/isReverse/usesAI derived so the existing render logic is cleaner.
  var isTyped = inputMode === "type";
  var isReverse = direction === "d2w"; // prompt shows the definition
  var usesAI = direction === "w2d" && inputMode === "type"; // only w2d+type goes through /api/judge
  var isSentence = usesAI && typeTarget === "sentence";
  var isBoth = usesAI && typeTarget === "both";
  var [tier, setTier] = useState("cards");
  var [numChoices, setNumChoices] = useState(4);
  var [raceCount, setRaceCount] = useState(9999);
  var [playerCount, setPlayerCount] = useState(1);
  var [playerNames, setPlayerNames] = useState(["Player 1"]);
  var [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  var [results, setResults] = useState([]);
  var [questions, setQuestions] = useState([]);
  var [qIndex, setQIndex] = useState(0);
  var [mistakes, setMistakes] = useState(0);
  var [points, setPoints] = useState(0);
  var [totalAnswered, setTotalAnswered] = useState(0);
  var [totalScoreSum, setTotalScoreSum] = useState(0);
  var [streak, setStreak] = useState(0);
  var [bestStreak, setBestStreak] = useState(0);
  var [timerRunning, setTimerRunning] = useState(false);
  var [timerKey, setTimerKey] = useState(0);
  var [answered, setAnswered] = useState(null);
  var [wordLog, setWordLog] = useState([]);
  var [gameOver, setGameOver] = useState(false);
  var [typedAnswer, setTypedAnswer] = useState("");
  var [typedSentence, setTypedSentence] = useState(""); // Only used when typeTarget==="both"
  var [judging, setJudging] = useState(false);
  var [customCards, setCustomCards] = useState(function(){ return getCustomCards(getDeckId(getCurrentUser())); });
  var [deletedWords, setDeletedWords] = useState(getDeletedWords);
  var [showAddCard, setShowAddCard] = useState(false);
  var [showCurrentWords, setShowCurrentWords] = useState(false);
  var [userName, setUserName] = useState(getCurrentUser);
  var [streaks, setStreaks] = useState({});
  var [masteredOrder, setMasteredOrder] = useState([]);
  var [progressLoaded, setProgressLoaded] = useState(false);
  var [cardsView, setCardsView] = useState("active"); // "active" | "mastered-{batchIndex}"
  var [nameInput, setNameInput] = useState("");
  var streaksRef = useRef({});
  var masteredOrderRef = useRef([]);
  useEffect(function(){ streaksRef.current = streaks; }, [streaks]);
  useEffect(function(){ masteredOrderRef.current = masteredOrder; }, [masteredOrder]);
  var [newWord, setNewWord] = useState("");
  var [newDef, setNewDef] = useState("");
  var [newPos, setNewPos] = useState("adj");
  var [newSyn, setNewSyn] = useState("");
  var [addingCard, setAddingCard] = useState(false);
  var [addError, setAddError] = useState("");
  var [suggestedWord, setSuggestedWord] = useState("");
  var timeRef = useRef(0);
  var inputRef = useRef(null);

  // ── REFS to solve stale closures in setTimeout callbacks ──
  var mistakesRef = useRef(0);
  var pointsRef = useRef(0);
  var totalAnsweredRef = useRef(0);
  var totalScoreSumRef = useRef(0);
  var streakRef = useRef(0);
  var bestStreakRef = useRef(0);
  var wordLogRef = useRef([]);
  var qIndexRef = useRef(0);

  // Keep refs in sync with state
  useEffect(function(){ mistakesRef.current = mistakes; }, [mistakes]);
  useEffect(function(){ pointsRef.current = points; }, [points]);
  useEffect(function(){ totalAnsweredRef.current = totalAnswered; }, [totalAnswered]);
  useEffect(function(){ totalScoreSumRef.current = totalScoreSum; }, [totalScoreSum]);
  useEffect(function(){ streakRef.current = streak; }, [streak]);
  useEffect(function(){ bestStreakRef.current = bestStreak; }, [bestStreak]);
  useEffect(function(){ wordLogRef.current = wordLog; }, [wordLog]);
  useEffect(function(){ qIndexRef.current = qIndex; }, [qIndex]);

  // Load progress from Firestore whenever userName changes
  useEffect(function(){
    if(!userName){ setProgressLoaded(false); return; }
    setProgressLoaded(false);
    loadProgress(userName).then(function(p){
      setStreaks(p.streaks);
      setMasteredOrder(p.masteredOrder);
      streaksRef.current = p.streaks;
      masteredOrderRef.current = p.masteredOrder;
      setProgressLoaded(true);
    });
  }, [userName]);

  // Load this user's deck from Firestore whenever userName changes.
  // Show the local cache immediately, then reconcile with the remote deck.
  var deckId = useMemo(function(){ return getDeckId(userName); }, [userName]);
  var deckLabel = deckId === "family" ? "Family Deck" : "My Deck";
  useEffect(function(){
    if(!deckId){ setCustomCards([]); return; }
    setCustomCards(getCustomCards(deckId));
    loadCustomCardsForDeck(deckId).then(function(remoteCards){
      var cleanRemote = (remoteCards||[]).filter(function(c){ return c && c.w && c.d && String(c.d).trim(); });
      setCustomCards(cleanRemote);
      saveCustomCards(deckId, cleanRemote);
    });
  }, [deckId]);

  var masteredBatches = useMemo(function(){ return getMasteredBatches(masteredOrder); }, [masteredOrder]);

  // When Cards tier is selected and cardsView is not in range (batches changed), reset to active
  useEffect(function(){
    if(cardsView !== "active" && cardsView.indexOf("mastered-")===0){
      var idx = parseInt(cardsView.slice("mastered-".length),10);
      if(!masteredBatches[idx]) setCardsView("active");
    }
  }, [masteredBatches, cardsView]);

  var allWords = useMemo(function(){
    return WORDS.filter(function(w){ return deletedWords.indexOf(w.w)===-1; })
      .concat(customCards)
      .filter(function(w){ return w && w.w && w.d && String(w.d).trim(); });
  }, [customCards, deletedWords]);
  var pool = useMemo(function(){
    if(tier==="all") return allWords;
    if(tier!=="cards") return allWords.filter(function(w){ return w.t===tier; });
    // Cards tier: split by cardsView
    var allCards = allWords.filter(function(w){ return w.t==="cards"; });
    if(cardsView === "active"){
      return allCards.filter(function(w){ return masteredOrder.indexOf(w.w)===-1; });
    }
    if(cardsView.indexOf("mastered-")===0){
      var idx = parseInt(cardsView.slice("mastered-".length),10);
      var batch = masteredBatches[idx] || [];
      var set = {}; batch.forEach(function(w){ set[w]=true; });
      return allCards.filter(function(w){ return set[w.w]; });
    }
    return allCards;
  }, [tier, cardsView, allWords, masteredOrder, masteredBatches]);
  var totalAvailable = pool.length;
  var raceOptions = useMemo(function(){
    var o = [10,15,20,25,40,50].filter(function(n){ return n<=totalAvailable; });
    if(o.indexOf(totalAvailable)===-1) o.push(totalAvailable);
    return Array.from(new Set(o)).sort(function(a,b){ return a-b; });
  }, [totalAvailable]);
  useEffect(function(){ if(raceCount>totalAvailable) setRaceCount(totalAvailable); }, [totalAvailable]);

  var generateQuestions = useCallback(function(){
    var sh = shuffle(pool);
    var count = mode==="race" ? raceCount : sh.length;
    return sh.slice(0,count).map(function(word){
      var dist = shuffle(pool.filter(function(w){ return w.w!==word.w; })).slice(0,numChoices-1);
      return {word:word, options:shuffle([word].concat(dist))};
    });
  }, [pool, mode, raceCount, numChoices]);

  var startGame = function(){
    var names = Array.from({length:playerCount}, function(_,i){ return playerNames[i] || "Player "+(i+1); });
    setPlayerNames(names); setResults([]); setCurrentPlayerIdx(0); startPlayerRound();
  };
  var startPlayerRound = function(){
    setQuestions(generateQuestions()); setQIndex(0); setMistakes(0); setPoints(0);
    setTotalAnswered(0); setTotalScoreSum(0);
    setStreak(0); setBestStreak(0); setAnswered(null); setTypedAnswer(""); setTypedSentence("");
    setWordLog([]); setGameOver(false); setTimerKey(function(k){ return k+1; });
    // Reset refs too
    mistakesRef.current=0; pointsRef.current=0; totalAnsweredRef.current=0;
    totalScoreSumRef.current=0; streakRef.current=0; bestStreakRef.current=0;
    wordLogRef.current=[]; qIndexRef.current=0;
    setTimerRunning(true); setScreen("playing");
  };

  useEffect(function(){
    if(screen==="playing" && isTyped && !answered && !judging && inputRef.current) inputRef.current.focus();
  }, [qIndex, screen, isTyped, answered, judging]);

  var processResult = function(score, q, yourAnswer){
    var t = scoreTier(score);
    // Update state
    setTotalAnswered(function(n){ return n+1; });
    setTotalScoreSum(function(s){ return s+score; });
    setPoints(function(p){ return p+t.pts; });
    setWordLog(function(prev){ return prev.concat([{w:q.word.w,d:q.word.d,pos:q.word.pos,t:q.word.t,yourAnswer:yourAnswer,score:score,tier:t.tier}]); });
    // Update refs immediately (these are read in setTimeout)
    totalAnsweredRef.current += 1;
    totalScoreSumRef.current += score;
    pointsRef.current += t.pts;
    wordLogRef.current = wordLogRef.current.concat([{w:q.word.w,d:q.word.d,pos:q.word.pos,t:q.word.t,yourAnswer:yourAnswer,score:score,tier:t.tier}]);

    if(t.tier==="full" || t.tier==="partial"){
      var ns = streakRef.current + 1;
      streakRef.current = ns;
      bestStreakRef.current = Math.max(bestStreakRef.current, ns);
      setStreak(ns);
      setBestStreak(bestStreakRef.current);
    } else {
      mistakesRef.current += 1;
      streakRef.current = 0;
      setMistakes(mistakesRef.current);
      setStreak(0);
    }

    // Per-word streak tracking for Cards tier
    if(userName && q.word.t==="cards"){
      var isCorrect = (t.tier==="full" || t.tier==="partial");
      var next = applyAnswer(streaksRef.current, masteredOrderRef.current, q.word.w, isCorrect);
      streaksRef.current = next.streaks;
      masteredOrderRef.current = next.masteredOrder;
      setStreaks(next.streaks);
      setMasteredOrder(next.masteredOrder);
    }

    return t;
  };

  var advanceAfterAnswer = function(isMiss, questionsLen){
    var delay = isMiss ? 1800 : 900;
    setTimeout(function(){
      var newMistakes = mistakesRef.current;
      var newQ = qIndexRef.current + 1;
      if((mode==="survival" && newMistakes>=3) || (mode==="race" && newQ>=questionsLen)){
        setTimerRunning(false);
        finishRound();
      } else {
        qIndexRef.current = newQ;
        setQIndex(newQ);
        setAnswered(null);
        setTypedAnswer("");
        setTypedSentence("");
      }
    }, delay);
  };

  var handleChoiceAnswer = function(selectedWord){
    if(answered) return;
    var q = questions[qIndex];
    var score = selectedWord===q.word.w ? 100 : 0;
    var t = processResult(score, q, selectedWord);
    setAnswered({score:score, note:""});
    advanceAfterAnswer(t.tier==="miss", questions.length);
  };

  var handleTypedSubmit = async function(){
    if(answered || judging || !typedAnswer.trim()) return;
    if(isBoth && !typedSentence.trim()) return;
    var q = questions[qIndex];
    var onUnavail = function(){ setAiUnavailable(true); };
    var result;
    var loggedAnswer = typedAnswer.trim();
    if(direction === "d2w"){
      // Typed the WORD given its definition — local match only
      result = wordMatchJudge(q.word.w, typedAnswer.trim());
    } else if(isBoth){
      // Final Frontier: both definition and sentence, scored independently, min wins
      setTimerRunning(false); setJudging(true);
      var pair = await Promise.all([
        aiJudge(q.word.w, q.word.d, typedAnswer.trim(), q.word, onUnavail, "definition"),
        aiJudge(q.word.w, q.word.d, typedSentence.trim(), q.word, onUnavail, "sentence"),
      ]);
      setTimerRunning(true); setJudging(false);
      var defR = pair[0], sentR = pair[1];
      result = {
        score: Math.min(defR.score, sentR.score),
        note: "Def " + defR.score + "% · Sentence " + sentR.score + "%",
        defResult: defR,
        sentResult: sentR,
      };
      loggedAnswer = typedAnswer.trim() + "  //  " + typedSentence.trim();
    } else {
      // Definition-only or sentence-only — single AI call
      setTimerRunning(false); setJudging(true);
      var mode = isSentence ? "sentence" : "definition";
      result = await aiJudge(q.word.w, q.word.d, typedAnswer.trim(), q.word, onUnavail, mode);
      setTimerRunning(true); setJudging(false);
    }
    var t = processResult(result.score, q, loggedAnswer);
    setAnswered({ score: result.score, note: result.note, defResult: result.defResult, sentResult: result.sentResult });
    advanceAfterAnswer(t.tier==="miss", questions.length);
  };

  var handleTypeKeyDown = function(e){ if(e.key==="Enter") handleTypedSubmit(); };

  var finishRound = function(){
    setGameOver(true);
    var avg = totalAnsweredRef.current > 0 ? Math.round(totalScoreSumRef.current / totalAnsweredRef.current) : 0;
    setResults(function(prev){ return prev.concat([{
      player: playerNames[currentPlayerIdx],
      points: pointsRef.current,
      mistakes: mistakesRef.current,
      time: timeRef.current,
      bestStreak: bestStreakRef.current,
      wordLog: wordLogRef.current.slice(),
      exited: false,
      avgScore: avg,
      totalAnswered: totalAnsweredRef.current,
    }]); });
    if(userName) saveProgress(userName, streaksRef.current, masteredOrderRef.current);
    setTimeout(function(){ setScreen(currentPlayerIdx+1<playerCount ? "transition" : "results"); }, 1500);
  };

  var nextPlayer = function(){ setCurrentPlayerIdx(function(i){ return i+1; }); startPlayerRound(); };
  var resetAll = function(){ setScreen("setup"); setResults([]); setCurrentPlayerIdx(0); };
  var exitGame = function(){
    setTimerRunning(false); setGameOver(true);
    var avg = totalAnsweredRef.current > 0 ? Math.round(totalScoreSumRef.current / totalAnsweredRef.current) : 0;
    setResults(function(prev){ return prev.concat([{
      player: playerNames[currentPlayerIdx],
      points: pointsRef.current,
      mistakes: mistakesRef.current,
      time: timeRef.current,
      bestStreak: bestStreakRef.current,
      wordLog: wordLogRef.current.slice(),
      exited: true,
      avgScore: avg,
      totalAnswered: totalAnsweredRef.current,
    }]); });
    if(userName) saveProgress(userName, streaksRef.current, masteredOrderRef.current);
    if(currentPlayerIdx+1<playerCount) setScreen("transition"); else setScreen("results");
  };

  var fmtTime = function(t){ var tot=Math.floor(t); var m=Math.floor(tot/60000); var s=Math.floor((tot%60000)/1000); var cs=Math.floor((tot%1000)/10); return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+"."+String(cs).padStart(2,"0"); };

  // Handler for adding a custom card. Tries local dict first,
  // then falls back to online dictionary API if needed.
  var handleAddCard = async function(overrideWord){
    var override = typeof overrideWord === "string" ? overrideWord : "";
    var w = (override || newWord).trim();
    if(!w || addingCard) return;
    setAddError("");
    setSuggestedWord("");
    var found = lookupWord(w);
    var d = (override ? "" : newDef.trim()) || (found ? found.d : "") || "";
    var pos = found ? found.pos : "adj";
    var syns = (!override && newSyn) ? newSyn.split(",").map(function(s){return s.trim()}).filter(Boolean) : (found ? found.syn : []);

    // If no definition yet, try the online dictionary
    var remoteWord = null;
    if(!d){
      setAddingCard(true);
      var remote = await fetchDefinition(w);
      setAddingCard(false);
      if(remote && remote.d){
        d = remote.d;
        if(remote.w) remoteWord = remote.w;
        if(!found) pos = remote.pos;
        if(!syns.length) syns = remote.syn;
      } else if(remote && remote.suggestion){
        setSuggestedWord(remote.suggestion);
        setAddError("\""+w+"\" isn't in the dictionary.");
        return;
      } else {
        setAddError("Couldn't find a definition for \""+w+"\". Please type one.");
        return;
      }
    }

    var card = {
      w: found ? found.w : (remoteWord || (w.charAt(0).toUpperCase() + w.slice(1))),
      d: d,
      pos: pos,
      t: "cards",
      syn: syns
    };
    var updated = customCards.concat([card]);
    setCustomCards(updated);
    saveCustomCards(deckId, updated);
    saveCustomCardsForDeck(deckId, updated);
    setNewWord(""); setNewDef(""); setNewSyn(""); setAddError(""); setSuggestedWord("");
  };

  var currentQ = questions[qIndex];
  var fontLink = <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500&family=Roboto+Mono:wght@100;300;400&display=swap" rel="stylesheet"/>;
  var pulseCSS = <style>{"@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}"}</style>;

  // ══════ WHO'S PLAYING? ══════
  if(!userName){
    var submitName = function(){
      var n = nameInput.trim();
      if(!n) return;
      setCurrentUser(n);
      setUserName(n);
    };
    return(
      <div style={styles.app}>{fontLink}{pulseCSS}
        <div style={styles.title}>Lexicon</div>
        <div style={styles.subtitle}>Who's playing?</div>
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={styles.label}>Your name</div>
          <input autoFocus value={nameInput} onChange={function(e){setNameInput(e.target.value)}}
            onKeyDown={function(e){if(e.key==="Enter")submitName()}}
            placeholder="e.g. Alfie" style={Object.assign({},styles.input,{width:"100%",marginTop:"8px"})}/>
          <div style={{fontSize:"11px",color:C.textDim,marginTop:"8px"}}>Your progress syncs across devices.</div>
          <button onClick={submitName} disabled={!nameInput.trim()} style={{
            marginTop:"16px",width:"100%",background:nameInput.trim()?C.btnBg:C.cardBorder,
            border:"1px solid "+C.inputBorder,color:C.white,padding:"12px",fontSize:"12px",
            fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"2px",
            textTransform:"uppercase",cursor:nameInput.trim()?"pointer":"not-allowed",borderRadius:"2px"
          }}>Continue</button>
        </div>
      </div>
    );
  }

  // ══════ SETUP ══════
  if(screen==="setup"){
    return(
      <div style={styles.app}>{fontLink}{pulseCSS}
        <div style={styles.title}>Lexicon</div>
        <div style={styles.subtitle}>{allWords.length} SAT vocabulary words</div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"16px",marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 22px",background:C.purpleBg,border:"1px solid rgba(155,142,196,0.5)",borderRadius:"3px"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:C.purple}}/>
            <span style={{fontSize:"22px",fontWeight:500,color:C.white,letterSpacing:"2px",textTransform:"uppercase",lineHeight:1}}>{userName}{progressLoaded?"":"\u2026"}</span>
            <span style={{fontSize:"11px",fontWeight:400,color:C.purple,letterSpacing:"1.5px",textTransform:"uppercase"}}>{deckLabel}</span>
          </div>
          <button onClick={function(){ setCurrentUser(""); setUserName(""); setNameInput(""); setStreaks({}); setMasteredOrder([]); }}
            style={{background:"transparent",border:"1px solid "+C.inputBorder,color:C.textDim,padding:"6px 14px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px"}}
            onMouseEnter={function(e){e.target.style.borderColor=C.purple;e.target.style.color=C.purple}}
            onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=C.textDim}}>Switch</button>
        </div>
        {aiUnavailable ? <div style={{width:"100%",maxWidth:"680px",boxSizing:"border-box",padding:"12px 16px",marginBottom:"16px",background:C.redBg,border:"1px solid "+C.red,borderRadius:"2px"}}>
          <div style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:C.red,marginBottom:"4px"}}>AI scoring unavailable</div>
          <div style={{fontSize:"12px",color:C.textMuted,lineHeight:"1.5"}}>Anthropic credit balance is empty. Typed answers will use basic scoring until you add credits at <span style={{color:C.purple}}>console.anthropic.com</span>.</div>
        </div> : null}
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={styles.cardTitle}>Question Style</div>
          <div style={{display:"flex",flexDirection:"column",gap:"22px"}}>
            <div>
              <div style={styles.label}>Direction</div>
              <SegmentedControl options={[{value:"w2d",label:"Word → Def"},{value:"d2w",label:"Def → Word"}]} value={direction} onChange={setDirection}/>
              <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>{direction==="w2d" ? "You see the word. Answer with its definition." : "You see the definition. Answer with the word."}</div>
            </div>
            <div>
              <div style={styles.label}>Input</div>
              <SegmentedControl options={[{value:"choice",label:"Multiple Choice"},{value:"type",label:"Type It"}]} value={inputMode} onChange={setInputMode}/>
              {/* Sub-options that belong to Input — indented with a left rule for visual grouping */}
              {!isTyped ? <div style={{marginTop:"12px",paddingLeft:"14px",borderLeft:"2px solid "+C.cardBorder}}>
                <div style={styles.label}>Number of Choices</div>
                <SegmentedControl options={[{value:3,label:"3"},{value:4,label:"4"},{value:6,label:"6"}]} value={numChoices} onChange={setNumChoices}/>
              </div> : null}
              {usesAI ? <div style={{marginTop:"12px",paddingLeft:"14px",borderLeft:"2px solid "+C.cardBorder}}>
                <div style={styles.label}>Type What?</div>
                <SegmentedControl options={[{value:"definition",label:"Definition"},{value:"sentence",label:"Sentence"},{value:"both",label:"Both"}]} value={typeTarget} onChange={setTypeTarget}/>
                <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>{typeTarget==="definition" ? "Type the word's definition. AI scores meaning match." : typeTarget==="sentence" ? "Use the word in a sentence. AI scores usage." : "Type both. Lower of the two scores counts — Final Frontier."}</div>
                <div style={{fontSize:"11px",color:C.textDim,marginTop:"4px"}}>
                  <span style={{color:C.green}}>70-100%</span>{" full · "}
                  <span style={{color:C.gold}}>40-69%</span>{" partial · "}
                  <span style={{color:C.red}}>0-39%</span>{" miss"}
                </div>
              </div> : null}
              {isTyped && direction==="d2w" ? <div style={{marginTop:"8px",fontSize:"11px",color:C.textDim}}>Type the word. Judged locally — typos and word-forms get partial credit.</div> : null}
            </div>
          </div>
        </div>
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={styles.cardTitle}>Round</div>
          <div style={{display:"flex",flexDirection:"column",gap:"22px"}}>
            <div>
              <div style={styles.label}>Game Mode</div>
              <SegmentedControl options={[{value:"race",label:"Race"},{value:"survival",label:"Survival"}]} value={mode} onChange={setMode}/>
              <div style={{fontSize:"12px",color:C.textMuted,marginTop:"8px"}}>{mode==="race"?"Answer a set number of words as fast as possible.":"How many can you get right? Three strikes and you're out."}</div>
              {mode==="race" ? <div style={{marginTop:"12px",paddingLeft:"14px",borderLeft:"2px solid "+C.cardBorder}}>
                <div style={styles.label}>Number of Words ({totalAvailable} available)</div>
                <SegmentedControl options={raceOptions.map(function(n){ return {value:n,label:n===totalAvailable?"All "+n:String(n)}; })} value={raceCount} onChange={setRaceCount}/>
              </div> : null}
            </div>
            <div>
              <div style={styles.label}>Difficulty</div>
              <SegmentedControl options={TIERS} value={tier} onChange={setTier}/>
              <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>{totalAvailable} words available</div>
              {tier==="cards" ? (function(){
                var activeCount = allWords.filter(function(w){ return w.t==="cards" && masteredOrder.indexOf(w.w)===-1; }).length;
                var viewOptions = [{value:"active",label:"Active ("+activeCount+")"}];
                masteredBatches.forEach(function(b,i){
                  var lo = i*BATCH_SIZE+1;
                  var hi = i*BATCH_SIZE+b.length;
                  viewOptions.push({value:"mastered-"+i,label:"Mastered "+lo+"-"+hi});
                });
                return <div style={{marginTop:"12px",paddingLeft:"14px",borderLeft:"2px solid "+C.cardBorder}}>
                  <div style={styles.label}>Cards View</div>
                  <SegmentedControl options={viewOptions} value={cardsView} onChange={setCardsView}/>
                  <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>
                    {cardsView==="active"
                      ? "Words you're still learning. Get one right "+MASTERY_THRESHOLD+" in a row to master it."
                      : "Review mastered words. A miss drops the word back to Active."}
                  </div>
                </div>;
              })() : null}
            </div>
          </div>
        </div>
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:showAddCard?"16px":"0"}}>
            <div style={styles.label}>{deckLabel} {customCards.length>0?"("+customCards.length+")":""}</div>
            <button style={{background:"transparent",border:"1px solid "+C.inputBorder,color:showAddCard?C.purple:C.textDim,padding:"4px 12px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.15s"}}
              onClick={function(){ setShowAddCard(!showAddCard); }}
              onMouseEnter={function(e){e.target.style.borderColor=C.purple;e.target.style.color=C.purple}}
              onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=showAddCard?C.purple:C.textDim}}>
              {showAddCard?"Close":"+ Add Word"}
            </button>
          </div>
          {showAddCard ? <div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"12px"}}>
              <input style={Object.assign({},styles.input,{fontSize:"14px",textAlign:"left"})} placeholder="Word" value={newWord} onChange={function(e){setNewWord(e.target.value); setAddError(""); setSuggestedWord("");}} onKeyDown={function(e){if(e.key==="Enter")handleAddCard();}}/>
              <input style={Object.assign({},styles.input,{fontSize:"13px",textAlign:"left",color:C.textMuted})} placeholder="Definition (optional — auto-fills if known)" value={newDef} onChange={function(e){setNewDef(e.target.value)}}/>
              <input style={Object.assign({},styles.input,{fontSize:"13px",textAlign:"left",color:C.textMuted})} placeholder="Synonyms, comma-separated (optional)" value={newSyn} onChange={function(e){setNewSyn(e.target.value)}}/>
            </div>
            {addError ? <div style={{fontSize:"11px",color:C.red,marginBottom:"8px"}}>{addError}</div> : null}
            {suggestedWord ? <div style={{fontSize:"12px",color:C.textDim,marginBottom:"8px"}}>
              Did you mean{" "}
              <button onClick={function(){ setNewWord(suggestedWord); handleAddCard(suggestedWord); }}
                style={{background:"transparent",border:"none",color:C.purple,cursor:"pointer",fontSize:"12px",fontFamily:"inherit",padding:0,textDecoration:"underline"}}>{suggestedWord}</button>?
            </div> : null}
            <button disabled={addingCard||!newWord.trim()} style={Object.assign({},styles.btn,{width:"100%",opacity:(newWord.trim()&&!addingCard)?"1":"0.4",cursor:(newWord.trim()&&!addingCard)?"pointer":"not-allowed"})} onClick={handleAddCard} onMouseEnter={function(e){if(newWord.trim()&&!addingCard)e.target.style.background="#909096"}} onMouseLeave={function(e){e.target.style.background=C.btnBg}}>{addingCard?"Looking up\u2026":"Add"}</button>
          </div> : null}
          <div style={{marginTop:showAddCard?"16px":"0"}}>
            {(function(){
              var cardsPool = WORDS.filter(function(w){return w.t==="cards" && deletedWords.indexOf(w.w)===-1;});
              var totalCount = cardsPool.length + customCards.length;
              return <div>
                <button style={{background:"transparent",border:"1px solid "+C.inputBorder,color:showCurrentWords?C.purple:C.textDim,padding:"4px 12px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.15s",width:"100%"}}
                  onClick={function(){ setShowCurrentWords(!showCurrentWords); }}
                  onMouseEnter={function(e){e.target.style.borderColor=C.purple;e.target.style.color=C.purple}}
                  onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=showCurrentWords?C.purple:C.textDim}}>
                  {showCurrentWords?"Hide":"Current Words"} ({totalCount})
                </button>
                {deletedWords.length>0 ? <button style={{background:"transparent",border:"1px solid "+C.inputBorder,color:C.textDim,padding:"4px 12px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"1.5px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.15s",width:"100%",marginTop:"8px"}}
                  onClick={function(){ setDeletedWords([]); saveDeletedWords([]); }}
                  onMouseEnter={function(e){e.target.style.borderColor=C.purple;e.target.style.color=C.purple}}
                  onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=C.textDim}}>
                  Restore Deleted Words ({deletedWords.length})
                </button> : null}
                {showCurrentWords ? <div style={{marginTop:"12px",maxHeight:"500px",overflowY:"auto"}}>
                  {[].concat(cardsPool.map(function(c){return {c:c,custom:false};}), customCards.map(function(c){return {c:c,custom:true};})).map(function(entry,i){
                    var c = entry.c;
                    var streak = streaks[c.w] || 0;
                    var mastered = streak >= MASTERY_THRESHOLD;
                    var streakColor = mastered ? C.green : streak >= 10 ? C.gold : streak > 0 ? C.purple : C.textDim;
                    return <div key={(entry.custom?"cc-":"hw-")+i} style={{display:"flex",alignItems:"center",padding:"10px 4px",borderBottom:"1px solid "+C.cardBorder,gap:"12px"}}>
                      <span style={{color:entry.custom?C.purple:C.white,fontSize:"15px",fontWeight:400,minWidth:"140px",flexShrink:0}}>{c.w}</span>
                      <span title={mastered?"Mastered":streak+" in a row"} style={{fontFamily:"'Roboto Mono', monospace",fontSize:"12px",color:streakColor,minWidth:"48px",textAlign:"center",flexShrink:0}}>{mastered?"✓ "+streak:streak+"/"+MASTERY_THRESHOLD}</span>
                      <span style={{color:C.textMuted,fontSize:"13px",flex:1,textAlign:"right",lineHeight:"1.4"}}>{c.d}</span>
                      <button style={{background:"transparent",border:"none",color:C.textDim,cursor:"pointer",fontSize:"16px",padding:"2px 6px",flexShrink:0}} onClick={function(){
                        if(entry.custom){
                          var updated = customCards.filter(function(_,j){return c.w !== customCards[j].w;});
                          setCustomCards(updated);
                          saveCustomCards(deckId, updated);
                          saveCustomCardsForDeck(deckId, updated);
                        } else {
                          var updated2 = deletedWords.concat([c.w]);
                          setDeletedWords(updated2);
                          saveDeletedWords(updated2);
                        }
                      }} onMouseEnter={function(e){e.target.style.color=C.red}} onMouseLeave={function(e){e.target.style.color=C.textDim}}>&times;</button>
                    </div>;
                  })}
                </div> : null}
              </div>;
            })()}
          </div>
        </div>
        <div style={Object.assign({},styles.card,{marginBottom:"24px"})}>
          <div style={styles.label}>Players</div>
          <SegmentedControl options={[1,2,3,4].map(function(n){ return {value:n,label:String(n)}; })} value={playerCount} onChange={function(n){ setPlayerCount(n); setPlayerNames(function(prev){ var next=prev.slice(); while(next.length<n) next.push("Player "+(next.length+1)); return next.slice(0,n); }); }}/>
          <div style={{display:"flex",gap:"8px",marginTop:"12px",flexWrap:"wrap"}}>
            {Array.from({length:playerCount}).map(function(_,i){
              return <input key={i} style={Object.assign({},styles.input,{fontSize:"13px",flex:"1 1 120px",minWidth:"0"})} value={playerNames[i]||""} onChange={function(e){ var next=playerNames.slice(); next[i]=e.target.value; setPlayerNames(next); }} placeholder={"Player "+(i+1)}/>;
            })}
          </div>
        </div>
        <div style={{marginBottom:"20px",display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={function(){ setLearnMode(!learnMode); }}>
          <div style={{width:"32px",height:"18px",borderRadius:"9px",background:learnMode?"rgba(155,142,196,0.3)":"#1e1e22",border:"1px solid "+(learnMode?"rgba(155,142,196,0.4)":C.inputBorder),position:"relative",transition:"all 0.2s"}}>
            <div style={{width:"14px",height:"14px",borderRadius:"50%",background:learnMode?C.purple:C.textDim,position:"absolute",top:"1px",left:learnMode?"15px":"1px",transition:"all 0.2s"}}/>
          </div>
          <span style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:learnMode?C.purple:C.textDim}}>Learn Mode</span>
          {learnMode ? <span style={{fontSize:"10px",color:C.textDim}}>— teach the scorer your definitions</span> : null}
        </div>
        <button style={styles.btn} onClick={startGame} onMouseEnter={function(e){e.target.style.background="#909096"}} onMouseLeave={function(e){e.target.style.background=C.btnBg}}>Start Game</button>
      </div>
    );
  }

  // ══════ PLAYING ══════
  if(screen==="playing"){
    var progress = mode==="race" ? (qIndex+1)+" / "+questions.length : isTyped ? points+" pts" : points+" correct";
    var inputBorderColor = "#333";
    if(answered) inputBorderColor = scoreTier(answered.score).color;
    else if(judging) inputBorderColor = C.purple;

    return(
      <div style={styles.app}>{fontLink}{pulseCSS}
        <div style={{width:"100%",maxWidth:"680px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 22px",background:C.purpleBg,border:"1px solid rgba(155,142,196,0.5)",borderRadius:"3px"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:C.purple}}/>
            <span style={{fontSize:"22px",fontWeight:500,color:C.white,letterSpacing:"2px",textTransform:"uppercase"}}>{userName}</span>
            <span style={{fontSize:"11px",fontWeight:400,color:C.purple,letterSpacing:"1.5px",textTransform:"uppercase"}}>{deckLabel}</span>
          </div>
          <button onClick={exitGame} style={{background:"transparent",border:"1px solid "+C.inputBorder,color:C.textDim,padding:"6px 14px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s"}}
            onMouseEnter={function(e){e.target.style.borderColor=C.red;e.target.style.color=C.red}}
            onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=C.textDim}}>Exit</button>
        </div>
        {aiUnavailable && usesAI ? <div style={{width:"100%",maxWidth:"680px",boxSizing:"border-box",padding:"10px 14px",marginBottom:"12px",background:C.redBg,border:"1px solid "+C.red,borderRadius:"2px",fontSize:"11px",color:C.textMuted,lineHeight:"1.5"}}>
          <span style={{color:C.red,letterSpacing:"1.5px",textTransform:"uppercase",marginRight:"8px"}}>AI unavailable</span>
          Using basic scoring. Add credits at <span style={{color:C.purple}}>console.anthropic.com</span>.
        </div> : null}
        {playerCount>1 ? <div style={Object.assign({},styles.label,{marginBottom:"12px",color:C.textMuted})}>{playerNames[currentPlayerIdx]}</div> : null}
        <Timer running={timerRunning} onTick={function(t){timeRef.current=t}} resetKey={timerKey}/>
        {mode==="survival" ? <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"8px"}}>
          {[0,1,2].map(function(i){ return <div key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:i<mistakes?C.red:"#1e1e22",border:"1px solid "+C.inputBorder,transition:"background 0.3s"}}/>; })}
        </div> : null}
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",marginTop:"4px"}}>
          <span style={{fontSize:"12px",color:C.textMuted,letterSpacing:"2px"}}>{progress}</span>
          {streak>1 ? <span style={{fontSize:"11px",color:C.green,letterSpacing:"1px",padding:"3px 10px",background:C.greenBg,borderRadius:"2px"}}>{streak} streak</span> : null}
          {usesAI ? <span style={{fontSize:"10px",color:C.purple,letterSpacing:"1px",padding:"3px 10px",background:C.purpleBg,borderRadius:"2px"}}>AI Scored</span> : null}
          {learnMode ? <span style={{fontSize:"10px",color:C.gold,letterSpacing:"1px",padding:"3px 10px",background:C.goldBg,borderRadius:"2px",border:"1px solid rgba(212,168,67,0.2)"}}>Learn Mode</span> : null}
        </div>
        {gameOver ? (
          <div style={Object.assign({},styles.card,{textAlign:"center",padding:"48px"})}>
            <div style={{fontSize:"18px",fontWeight:100,color:C.white,marginBottom:"8px"}}>{mode==="survival"&&mistakes>=3?"Game Over":"Complete"}</div>
            <div style={{fontSize:"13px",color:C.textDim}}>Loading results...</div>
          </div>
        ) : currentQ ? (
          <div style={Object.assign({},styles.card,{textAlign:"center"})}>
            {/* ── PROMPT AREA: word (choice/type) or definition (reverse) ── */}
            {isReverse ? (
              <div style={{marginBottom:"24px"}}>
                <div style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:C.textDim,marginBottom:"10px"}}>{posLabel(currentQ.word.pos)}</div>
                <div style={{fontSize:"18px",fontWeight:300,color:C.white,lineHeight:"1.5",marginBottom:"12px"}}>{currentQ.word.d}</div>
                <span style={{fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",padding:"3px 10px",borderRadius:"2px",
                  background:currentQ.word.t==="easy"?C.greenBg:currentQ.word.t==="med"?C.goldBg:C.redBg,
                  color:currentQ.word.t==="easy"?C.green:currentQ.word.t==="med"?C.gold:C.red,
                }}>{currentQ.word.t==="med"?"Medium":currentQ.word.t}</span>
              </div>
            ) : (
              <div>
                <div style={{marginBottom:"8px"}}>
                  <div style={{fontSize:"36px",fontWeight:100,letterSpacing:"2px",color:C.white,marginBottom:"6px"}}>{currentQ.word.w}</div>
                  <div style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:C.textDim}}>{posLabel(currentQ.word.pos)}</div>
                </div>
                <div style={{marginBottom:"24px"}}>
                  <span style={{fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",padding:"3px 10px",borderRadius:"2px",
                    background:currentQ.word.t==="easy"?C.greenBg:currentQ.word.t==="med"?C.goldBg:C.redBg,
                    color:currentQ.word.t==="easy"?C.green:currentQ.word.t==="med"?C.gold:C.red,
                  }}>{currentQ.word.t==="med"?"Medium":currentQ.word.t}</span>
                </div>
              </div>
            )}

            {/* ── ANSWER AREA ── */}
            {!isTyped && !isReverse ? (
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {currentQ.options.map(function(opt,idx){
                  var bg="#18181c", border=C.inputBorder, color=C.text, opacity=1;
                  if(answered){
                    if(opt.w===currentQ.word.w){bg=C.greenBg;border=C.green;color=C.green;}
                    else{opacity=0.4;}
                  }
                  return <button key={opt.w} onClick={function(){handleChoiceAnswer(opt.w)}} disabled={!!answered}
                    style={Object.assign({},styles.choiceBtn,{background:bg,borderColor:border,color:color,opacity:opacity})}
                    onMouseEnter={function(e){if(!answered)e.target.style.borderColor="#444"}}
                    onMouseLeave={function(e){if(!answered)e.target.style.borderColor=C.inputBorder}}>
                    <span style={{fontSize:"11px",fontWeight:400,color:C.textDim,marginRight:"10px",letterSpacing:"1px"}}>{String.fromCharCode(65+idx)}</span>{opt.d}
                  </button>;
                })}
              </div>
            ) : !isTyped && isReverse ? (
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"}}>
                {currentQ.options.map(function(opt){
                  var bg="#18181c", border=C.inputBorder, color=C.text, opacity=1;
                  if(answered){
                    if(opt.w===currentQ.word.w){bg=C.greenBg;border=C.green;color=C.green;}
                    else{opacity=0.4;}
                  }
                  return <button key={opt.w} onClick={function(){handleChoiceAnswer(opt.w)}} disabled={!!answered}
                    style={{flex:"1 1 calc(50% - 6px)",minWidth:"120px",background:bg,border:"1px solid "+border,color:color,opacity:opacity,
                      padding:"14px 12px",fontSize:"16px",fontFamily:"'Roboto', sans-serif",fontWeight:300,cursor:"pointer",borderRadius:"2px",
                      textAlign:"center",transition:"all 0.15s",letterSpacing:"1px"}}
                    onMouseEnter={function(e){if(!answered)e.target.style.borderColor="#444"}}
                    onMouseLeave={function(e){if(!answered)e.target.style.borderColor=C.inputBorder}}>
                    {opt.w}
                  </button>;
                })}
              </div>
            ) : (
              <div>
                {isBoth ? <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.textDim,marginBottom:"6px",textAlign:"left"}}>Definition</div> : null}
                <input ref={inputRef} style={Object.assign({},styles.input,{fontSize:"16px",textAlign:"left",borderBottomColor:inputBorderColor})}
                  value={typedAnswer} onChange={function(e){setTypedAnswer(e.target.value)}} onKeyDown={isBoth?undefined:handleTypeKeyDown}
                  placeholder={direction==="d2w" ? "Type the word..." : isSentence ? ("Use " + currentQ.word.w + " in a sentence...") : isBoth ? "Type the definition..." : "Type your definition..."} autoFocus disabled={!!answered||judging}/>
                {isBoth ? <div style={{marginTop:"12px"}}>
                  <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.textDim,marginBottom:"6px",textAlign:"left"}}>Sentence using {currentQ.word.w}</div>
                  <input style={Object.assign({},styles.input,{fontSize:"16px",textAlign:"left",borderBottomColor:inputBorderColor})}
                    value={typedSentence} onChange={function(e){setTypedSentence(e.target.value)}} onKeyDown={handleTypeKeyDown}
                    placeholder={"Use " + currentQ.word.w + " in a sentence..."} disabled={!!answered||judging}/>
                </div> : null}
                {!answered && !judging ? (function(){
                  var ready = isBoth ? (typedAnswer.trim() && typedSentence.trim()) : typedAnswer.trim();
                  return <button onClick={handleTypedSubmit} disabled={!ready}
                    style={Object.assign({},styles.btn,{marginTop:"12px",width:"100%",opacity:ready?1:0.4,fontSize:"11px"})}
                    onMouseEnter={function(e){if(ready)e.target.style.background="#909096"}}
                    onMouseLeave={function(e){e.target.style.background=C.btnBg}}>Submit</button>;
                })() : null}
                {judging ? <div style={{marginTop:"16px",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                  <div style={{display:"flex",gap:"4px"}}>{[0,1,2].map(function(i){return <div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:C.purple,animation:"pulse 1.2s ease-in-out infinite",animationDelay:i*0.2+"s"}}/>;})}</div>
                  <span style={{fontSize:"12px",color:C.purple,letterSpacing:"1px"}}>AI is scoring{isBoth?" both":""}...</span>
                </div> : null}
                {answered ? <FeedbackCard answered={answered} word={currentQ.word} userAnswer={isBoth?(typedAnswer+"  //  "+typedSentence):typedAnswer} learnMode={learnMode} canLearn={typeTarget==="definition"}/> : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  // ══════ TRANSITION ══════
  if(screen==="transition"){
    return(
      <div style={styles.app}>{fontLink}
        <div style={Object.assign({},styles.card,{textAlign:"center",padding:"60px 32px"})}>
          <div style={{fontSize:"12px",color:C.textMuted,letterSpacing:"3px",textTransform:"uppercase",marginBottom:"24px"}}>Next Up</div>
          <div style={{fontSize:"32px",fontWeight:100,color:C.white,marginBottom:"8px"}}>{playerNames[currentPlayerIdx+1]}</div>
          <div style={{fontSize:"13px",color:C.textDim,marginBottom:"40px"}}>Pass the device. No peeking.</div>
          <button style={styles.btn} onClick={nextPlayer} onMouseEnter={function(e){e.target.style.background="#909096"}} onMouseLeave={function(e){e.target.style.background=C.btnBg}}>Ready</button>
        </div>
      </div>
    );
  }

  // ══════ RESULTS ══════
  if(screen==="results"){
    var sorted = results.slice().sort(function(a,b){
      if(mode==="race"){if(b.points!==a.points) return b.points-a.points; return a.time-b.time;}
      if(b.points!==a.points) return b.points-a.points;
      return b.bestStreak-a.bestStreak;
    });
    var winner = sorted[0];
    var perfect = mode==="race" && winner && winner.mistakes===0 && !winner.exited && winner.points>=raceCount;

    return(
      <div style={styles.app}>{fontLink}
        {perfect ? <div style={{background:C.goldBg,border:"1px solid rgba(212,168,67,0.2)",borderRadius:"2px",padding:"20px 32px",marginBottom:"24px",textAlign:"center",maxWidth:"680px",width:"100%"}}>
          <div style={{fontSize:"10px",letterSpacing:"6px",color:"rgba(212,168,67,0.6)",textTransform:"uppercase",marginBottom:"6px"}}>Achievement Unlocked</div>
          <div style={{fontSize:"22px",fontWeight:100,color:C.gold,letterSpacing:"4px"}}>{isTyped?"ETYMOLOGIST":"LEXICOGRAPHER"}</div>
          <div style={{fontSize:"11px",color:C.textMuted,marginTop:"4px"}}>{"All "+raceCount+" words \u2014 zero mistakes"+(isTyped?" \u2014 AI scored":"")}</div>
        </div> : null}
        <div style={styles.title}>Results</div>
        <div style={Object.assign({},styles.subtitle,{marginBottom:"24px"})}>
          {(mode==="race"?"Race \u2014 "+raceCount+" words":"Survival \u2014 3 strikes")+" \u00B7 "+(tier==="all"?"All levels":tier==="med"?"Medium":tier.charAt(0).toUpperCase()+tier.slice(1))+" \u00B7 "+((direction==="w2d"?"Word \u2192 Def":"Def \u2192 Word")+" \u00B7 "+(isTyped?(usesAI?"Typed (AI)":"Typed"):numChoices+" choices"))}
        </div>
        {sorted.map(function(r,i){
          var fullCount = r.wordLog.filter(function(w){return w.tier==="full"}).length;
          var partialCount = r.wordLog.filter(function(w){return w.tier==="partial"}).length;
          var missCount = r.wordLog.filter(function(w){return w.tier==="miss"}).length;
          return(
            <div key={i} style={Object.assign({},styles.card,{marginBottom:"12px",borderLeft:i===0&&playerCount>1?"2px solid "+C.accent:"1px solid "+C.cardBorder})}>
              {playerCount>1 ? <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                <span style={{fontSize:"16px",fontWeight:400,color:C.white}}>{r.player}</span>
                {i===0&&!r.exited ? <span style={{fontSize:"10px",letterSpacing:"2px",color:C.gold,textTransform:"uppercase"}}>Winner</span> : null}
                {r.exited ? <span style={{fontSize:"10px",letterSpacing:"2px",color:C.textDim,textTransform:"uppercase"}}>Exited</span> : null}
              </div> : null}
              {playerCount<=1&&r.exited ? <div style={{fontSize:"10px",letterSpacing:"2px",color:C.textDim,textTransform:"uppercase",marginBottom:"12px"}}>Exited early</div> : null}
              <div style={{textAlign:"center",marginBottom:"20px"}}>
                <div style={styles.label}>Time</div>
                <div style={{fontFamily:"'Roboto Mono', monospace",fontSize:"36px",fontWeight:100,color:C.white}}>{fmtTime(r.time)}</div>
              </div>
              {isTyped ? (
                <div>
                  <div style={{display:"flex",justifyContent:"space-around",textAlign:"center",marginBottom:"16px"}}>
                    <div><div style={styles.label}>Points</div><div style={{fontSize:"28px",fontWeight:100,color:C.white}}>{r.points}</div></div>
                    <div><div style={styles.label}>Avg Score</div><div style={{fontSize:"28px",fontWeight:100,color:r.avgScore>=70?C.green:r.avgScore>=40?C.gold:C.red}}>{r.avgScore}%</div></div>
                    <div><div style={styles.label}>Best Streak</div><div style={{fontSize:"28px",fontWeight:100,color:C.white}}>{r.bestStreak}</div></div>
                  </div>
                  <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"4px"}}>
                    <span style={{fontSize:"11px",color:C.green}}>{fullCount} full</span>
                    <span style={{fontSize:"11px",color:C.textDim}}>{"\u00B7"}</span>
                    <span style={{fontSize:"11px",color:C.gold}}>{partialCount} partial</span>
                    <span style={{fontSize:"11px",color:C.textDim}}>{"\u00B7"}</span>
                    <span style={{fontSize:"11px",color:C.red}}>{missCount} missed</span>
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
                  <div><div style={styles.label}>Correct</div><div style={{fontSize:"28px",fontWeight:100,color:C.green}}>{fullCount}</div></div>
                  <div><div style={styles.label}>Mistakes</div><div style={{fontSize:"28px",fontWeight:100,color:r.mistakes>0?C.red:C.textDim}}>{r.mistakes}</div></div>
                  <div><div style={styles.label}>Best Streak</div><div style={{fontSize:"28px",fontWeight:100,color:C.white}}>{r.bestStreak}</div></div>
                </div>
              )}
              {isTyped && r.wordLog.length>0 ? (
                <div style={{marginTop:"20px",borderTop:"1px solid "+C.cardBorder,paddingTop:"16px"}}>
                  <div style={Object.assign({},styles.label,{marginBottom:"12px"})}>Word-by-Word Breakdown</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                    {r.wordLog.map(function(wl,j){
                      var t = scoreTier(wl.score);
                      return(
                        <div key={j} style={{padding:"8px 0",borderBottom:"1px solid "+C.cardBorder}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                            <span style={{fontSize:"14px",fontWeight:400,color:C.white}}>{wl.w}</span>
                            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                              {learnMode && wl.yourAnswer ? <LearnRowButton word={wl.w} answer={wl.yourAnswer}/> : null}
                              <span style={{fontSize:"13px",fontWeight:400,color:t.color,fontFamily:"'Roboto Mono', monospace"}}>{wl.score}%</span>
                            </div>
                          </div>
                          <ScoreBar score={wl.score} height={4}/>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
                            <span style={{fontSize:"10px",color:C.textDim,fontStyle:"italic"}}>{'"'+wl.yourAnswer+'"'}</span>
                            <span style={{fontSize:"10px",color:C.textDim}}>{wl.d}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {!isTyped && r.wordLog.filter(function(w){return w.tier==="miss"}).length>0 ? (
                <div style={{marginTop:"20px",borderTop:"1px solid "+C.cardBorder,paddingTop:"16px"}}>
                  <div style={Object.assign({},styles.label,{marginBottom:"12px"})}>Missed Words</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {r.wordLog.filter(function(w){return w.tier==="miss"}).map(function(mw,j){
                      return <div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"6px 0",borderBottom:"1px solid "+C.cardBorder}}>
                        <span style={{fontSize:"14px",fontWeight:400,color:C.white}}>{mw.w}</span>
                        <span style={{fontSize:"11px",color:C.textDim,textAlign:"right",maxWidth:"60%",lineHeight:"1.3"}}>{mw.d}</span>
                      </div>;
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
        <div style={{display:"flex",gap:"12px",marginTop:"20px"}}>
          <button style={styles.btn} onClick={resetAll} onMouseEnter={function(e){e.target.style.background="#909096"}} onMouseLeave={function(e){e.target.style.background=C.btnBg}}>New Game</button>
          <button style={styles.btnOutline} onClick={function(){setResults([]);setCurrentPlayerIdx(0);startPlayerRound();}}
            onMouseEnter={function(e){e.target.style.borderColor="#444"}} onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder}}>Rematch</button>
        </div>
      </div>
    );
  }

  return null;
}
