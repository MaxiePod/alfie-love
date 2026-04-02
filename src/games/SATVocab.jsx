import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
];

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
  var uaWords = ua.split(/\s+/);

  // 0. Check against user-learned definitions first (with stem matching)
  var learned = getLearnedDefs(wordEntry.w);
  for (var ld = 0; ld < learned.length; ld++) {
    var learnedNorm = normalizeWord(learned[ld]);
    // Exact match
    if (ua === learnedNorm) {
      return { score: 90, note: "Matches your learned definition" };
    }
    // Word-set similarity (handles extra/missing articles, reordering)
    var learnedSim = wordSetSimilarity(ua, learnedNorm);
    if (learnedSim >= 0.4) {
      return { score: 90, note: "Matches your learned definition" };
    }
    // Stem-based: check if core stems of learned def appear in user answer
    var learnedWords = learnedNorm.split(/\s+/).filter(function(w) { return w.length > 2; });
    var learnedStems = learnedWords.filter(function(w) { return w.length > 3; }).map(stemWord);
    var uaStemsL = uaWords.filter(function(w) { return w.length > 3; }).map(stemWord);
    if (learnedStems.length > 0) {
      var stemMatches = 0;
      for (var ls = 0; ls < learnedStems.length; ls++) {
        for (var us = 0; us < uaStemsL.length; us++) {
          if (learnedStems[ls] === uaStemsL[us] || (learnedStems[ls].length > 2 && uaStemsL[us].length > 2 && (learnedStems[ls].startsWith(uaStemsL[us]) || uaStemsL[us].startsWith(learnedStems[ls])))) {
            stemMatches++;
            break;
          }
        }
      }
      var stemRatio = stemMatches / learnedStems.length;
      if (stemRatio >= 0.5) {
        return { score: 85, note: "Matches your learned definition" };
      }
    }
    // Containment check (handles "ruling" learned, user types "a ruling")
    if (ua.includes(learnedNorm) || learnedNorm.includes(ua)) {
      return { score: 85, note: "Matches your learned definition" };
    }
  }

  // 1. Definition similarity — compare directly against the definition text
  var defSim = wordSetSimilarity(ua, def);
  if (defSim >= 0.7) {
    return { score: 95, note: "Excellent definition" };
  }
  if (defSim >= 0.5) {
    return { score: 85, note: "Great definition" };
  }
  if (defSim >= 0.35) {
    return { score: 75, note: "Good definition" };
  }

  // 2. Exact synonym match
  if (synonyms.indexOf(ua) !== -1) {
    return { score: 85, note: "Synonym match" };
  }

  // 3. Check if user answer contains a synonym or vice versa
  var synMatch = false;
  var bestSynOverlap = 0;
  for (var i = 0; i < synonyms.length; i++) {
    var syn = synonyms[i];
    if (ua.includes(syn) || syn.includes(ua)) {
      synMatch = true;
      break;
    }
    for (var j = 0; j < uaWords.length; j++) {
      if (uaWords[j].length > 2 && (syn === uaWords[j] || syn.includes(uaWords[j]) || uaWords[j].includes(syn))) {
        synMatch = true;
        break;
      }
      if (uaWords[j].length > 3 && stemWord(uaWords[j]) === stemWord(syn) && stemWord(uaWords[j]).length > 2) {
        synMatch = true;
        break;
      }
    }
    if (synMatch) break;

    var synWords = syn.split(/\s+/);
    var overlap = 0;
    for (var k = 0; k < synWords.length; k++) {
      for (var m = 0; m < uaWords.length; m++) {
        if (synWords[k].length > 2 && uaWords[m].length > 2 && (synWords[k] === uaWords[m] || stemWord(synWords[k]) === stemWord(uaWords[m]))) {
          overlap++;
          break;
        }
      }
    }
    if (synWords.length > 1 && overlap >= synWords.length * 0.5) {
      synMatch = true;
      break;
    }
    if (overlap > bestSynOverlap) bestSynOverlap = overlap;
  }

  if (synMatch) {
    return { score: 80, note: "Synonym match" };
  }

  // 4. Stem matches against synonyms
  var uaStems = uaWords.filter(function(w) { return w.length > 3; }).map(stemWord);
  var synStems = [];
  for (var s = 0; s < synonyms.length; s++) {
    synonyms[s].split(/\s+/).forEach(function(sw) {
      if (sw.length > 3) synStems.push(stemWord(sw));
    });
  }
  var stemHits = 0;
  for (var a = 0; a < uaStems.length; a++) {
    if (uaStems[a].length > 2 && synStems.indexOf(uaStems[a]) !== -1) stemHits++;
  }
  if (stemHits > 0) {
    var stemScore = Math.min(75, 55 + stemHits * 10);
    return { score: stemScore, note: "Partial synonym match" };
  }

  // 5. Weaker definition keyword matching
  if (defSim >= 0.15) {
    return { score: Math.min(60, Math.round(defSim * 120)), note: "Partially correct" };
  }

  // 6. Partial synonym overlap
  if (bestSynOverlap > 0) {
    return { score: 35, note: "Loosely related" };
  }

  return { score: 0, note: "No match found" };
}

async function aiJudge(word, correctDef, userAnswer, wordEntry) {
  return offlineJudge(wordEntry, userAnswer);
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
  var showLearn = userAnswer && userAnswer.trim().length > 0 && (learnMode || answered.score < 70);
  var handleLearn = function() {
    saveLearnedDef(word.w, userAnswer.trim());
    setLearned(true);
  };
  return (
    <div style={{marginTop:"16px"}}>
      <div style={{marginBottom:"12px"}}><ScoreBar score={answered.score}/></div>
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

export default function SATVocab(){
  var [screen, setScreen] = useState("setup");
  var [mode, setMode] = useState("race");
  var [learnMode, setLearnMode] = useState(false);
  var [inputType, setInputType] = useState("choice");
  var [tier, setTier] = useState("all");
  var [numChoices, setNumChoices] = useState(4);
  var [raceCount, setRaceCount] = useState(20);
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
  var [judging, setJudging] = useState(false);
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

  var pool = useMemo(function(){ return tier==="all" ? WORDS : WORDS.filter(function(w){ return w.t===tier; }); }, [tier]);
  var totalAvailable = pool.length;
  var raceOptions = useMemo(function(){
    var o = [10,15,20,25,40,50].filter(function(n){ return n<=totalAvailable; });
    if(o.indexOf(totalAvailable)===-1) o.push(totalAvailable);
    return Array.from(new Set(o)).sort(function(a,b){ return a-b; });
  }, [totalAvailable]);
  useEffect(function(){ if(raceCount>totalAvailable) setRaceCount(Math.min(20,totalAvailable)); }, [totalAvailable]);

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
    setStreak(0); setBestStreak(0); setAnswered(null); setTypedAnswer("");
    setWordLog([]); setGameOver(false); setTimerKey(function(k){ return k+1; });
    // Reset refs too
    mistakesRef.current=0; pointsRef.current=0; totalAnsweredRef.current=0;
    totalScoreSumRef.current=0; streakRef.current=0; bestStreakRef.current=0;
    wordLogRef.current=[]; qIndexRef.current=0;
    setTimerRunning(true); setScreen("playing");
  };

  useEffect(function(){
    if(screen==="playing" && inputType==="type" && !answered && !judging && inputRef.current) inputRef.current.focus();
  }, [qIndex, screen, inputType, answered, judging]);

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
    var q = questions[qIndex];
    setTimerRunning(false); setJudging(true);
    var result = await aiJudge(q.word.w, q.word.d, typedAnswer.trim(), q.word);
    setTimerRunning(true); setJudging(false);
    var t = processResult(result.score, q, typedAnswer.trim());
    setAnswered({score:result.score, note:result.note});
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
    if(currentPlayerIdx+1<playerCount) setScreen("transition"); else setScreen("results");
  };

  var fmtTime = function(t){ var tot=Math.floor(t); var m=Math.floor(tot/60000); var s=Math.floor((tot%60000)/1000); var cs=Math.floor((tot%1000)/10); return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+"."+String(cs).padStart(2,"0"); };

  var currentQ = questions[qIndex];
  var fontLink = <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500&family=Roboto+Mono:wght@100;300;400&display=swap" rel="stylesheet"/>;
  var pulseCSS = <style>{"@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}"}</style>;

  // ══════ SETUP ══════
  if(screen==="setup"){
    return(
      <div style={styles.app}>{fontLink}{pulseCSS}
        <div style={styles.title}>Lexicon</div>
        <div style={styles.subtitle}>{WORDS.length} SAT vocabulary words</div>
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={styles.label}>Game Mode</div>
          <SegmentedControl options={[{value:"race",label:"Race"},{value:"survival",label:"Survival"}]} value={mode} onChange={setMode}/>
          <div style={{fontSize:"12px",color:C.textMuted,marginTop:"8px"}}>{mode==="race"?"Answer a set number of words as fast as possible.":"How many can you get right? Three strikes and you're out."}</div>
        </div>
        <div style={Object.assign({},styles.card,{marginBottom:"16px"})}>
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            <div>
              <div style={styles.label}>Input Method</div>
              <SegmentedControl options={[{value:"choice",label:"Word \u2192 Def"},{value:"reverse",label:"Def \u2192 Word"},{value:"type",label:"Type It"}]} value={inputType} onChange={setInputType}/>
              <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>{inputType==="type"?"Type any definition — AI scores how close you are (0-100%).":inputType==="reverse"?"See the definition, pick the correct word.":"See the word, pick the correct definition."}</div>
            </div>
            <div>
              <div style={styles.label}>Difficulty</div>
              <SegmentedControl options={TIERS} value={tier} onChange={setTier}/>
              <div style={{fontSize:"11px",color:C.textDim,marginTop:"6px"}}>{totalAvailable} words available</div>
            </div>
            {inputType!=="type" ? <div>
              <div style={styles.label}>Number of Choices</div>
              <SegmentedControl options={[{value:3,label:"3"},{value:4,label:"4"},{value:6,label:"6"}]} value={numChoices} onChange={setNumChoices}/>
            </div> : null}
          </div>
          {mode==="race" ? <div style={{marginTop:"20px"}}>
            <div style={styles.label}>Number of Words ({totalAvailable} available)</div>
            <SegmentedControl options={raceOptions.map(function(n){ return {value:n,label:n===totalAvailable?"All "+n:String(n)}; })} value={raceCount} onChange={setRaceCount}/>
          </div> : null}
          {inputType==="type" ? <div style={{marginTop:"20px",padding:"12px 16px",background:C.purpleBg,border:"1px solid rgba(155,142,196,0.15)",borderRadius:"2px"}}>
            <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:C.purple,marginBottom:"6px"}}>Scoring</div>
            <div style={{fontSize:"12px",color:C.textMuted,lineHeight:"1.6"}}>
              <span style={{color:C.green}}>70-100%</span>{" = Full credit (1 pt)  \u00B7  "}
              <span style={{color:C.gold}}>40-69%</span>{" = Partial (0.5 pt)  \u00B7  "}
              <span style={{color:C.red}}>0-39%</span>{" = Miss (burns a life)"}
            </div>
          </div> : null}
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
    var progress = mode==="race" ? (qIndex+1)+" / "+questions.length : inputType==="type" ? points+" pts" : points+" correct";
    var inputBorderColor = "#333";
    if(answered) inputBorderColor = scoreTier(answered.score).color;
    else if(judging) inputBorderColor = C.purple;

    return(
      <div style={styles.app}>{fontLink}{pulseCSS}
        <div style={{width:"100%",maxWidth:"680px",display:"flex",justifyContent:"flex-end",marginBottom:"8px"}}>
          <button onClick={exitGame} style={{background:"transparent",border:"1px solid "+C.inputBorder,color:C.textDim,padding:"6px 14px",fontSize:"10px",fontFamily:"'Roboto', sans-serif",fontWeight:400,letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",borderRadius:"2px",transition:"all 0.2s"}}
            onMouseEnter={function(e){e.target.style.borderColor=C.red;e.target.style.color=C.red}}
            onMouseLeave={function(e){e.target.style.borderColor=C.inputBorder;e.target.style.color=C.textDim}}>Exit</button>
        </div>
        {playerCount>1 ? <div style={Object.assign({},styles.label,{marginBottom:"12px",color:C.textMuted})}>{playerNames[currentPlayerIdx]}</div> : null}
        <Timer running={timerRunning} onTick={function(t){timeRef.current=t}} resetKey={timerKey}/>
        {mode==="survival" ? <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"8px"}}>
          {[0,1,2].map(function(i){ return <div key={i} style={{width:"10px",height:"10px",borderRadius:"50%",background:i<mistakes?C.red:"#1e1e22",border:"1px solid "+C.inputBorder,transition:"background 0.3s"}}/>; })}
        </div> : null}
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",marginTop:"4px"}}>
          <span style={{fontSize:"12px",color:C.textMuted,letterSpacing:"2px"}}>{progress}</span>
          {streak>1 ? <span style={{fontSize:"11px",color:C.green,letterSpacing:"1px",padding:"3px 10px",background:C.greenBg,borderRadius:"2px"}}>{streak} streak</span> : null}
          {inputType==="type" ? <span style={{fontSize:"10px",color:C.purple,letterSpacing:"1px",padding:"3px 10px",background:C.purpleBg,borderRadius:"2px"}}>AI Scored</span> : null}
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
            {inputType==="reverse" ? (
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
            {inputType==="choice" ? (
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
            ) : inputType==="reverse" ? (
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
                <input ref={inputRef} style={Object.assign({},styles.input,{fontSize:"16px",textAlign:"left",borderBottomColor:inputBorderColor})}
                  value={typedAnswer} onChange={function(e){setTypedAnswer(e.target.value)}} onKeyDown={handleTypeKeyDown}
                  placeholder="Type your definition..." autoFocus disabled={!!answered||judging}/>
                {!answered && !judging ? <button onClick={handleTypedSubmit} disabled={!typedAnswer.trim()}
                  style={Object.assign({},styles.btn,{marginTop:"12px",width:"100%",opacity:typedAnswer.trim()?1:0.4,fontSize:"11px"})}
                  onMouseEnter={function(e){if(typedAnswer.trim())e.target.style.background="#909096"}}
                  onMouseLeave={function(e){e.target.style.background=C.btnBg}}>Submit</button> : null}
                {judging ? <div style={{marginTop:"16px",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                  <div style={{display:"flex",gap:"4px"}}>{[0,1,2].map(function(i){return <div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:C.purple,animation:"pulse 1.2s ease-in-out infinite",animationDelay:i*0.2+"s"}}/>;})}</div>
                  <span style={{fontSize:"12px",color:C.purple,letterSpacing:"1px"}}>AI is scoring...</span>
                </div> : null}
                {answered ? <FeedbackCard answered={answered} word={currentQ.word} userAnswer={typedAnswer} learnMode={learnMode}/> : null}
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
    var isTyped = inputType==="type";

    return(
      <div style={styles.app}>{fontLink}
        {perfect ? <div style={{background:C.goldBg,border:"1px solid rgba(212,168,67,0.2)",borderRadius:"2px",padding:"20px 32px",marginBottom:"24px",textAlign:"center",maxWidth:"680px",width:"100%"}}>
          <div style={{fontSize:"10px",letterSpacing:"6px",color:"rgba(212,168,67,0.6)",textTransform:"uppercase",marginBottom:"6px"}}>Achievement Unlocked</div>
          <div style={{fontSize:"22px",fontWeight:100,color:C.gold,letterSpacing:"4px"}}>{isTyped?"ETYMOLOGIST":"LEXICOGRAPHER"}</div>
          <div style={{fontSize:"11px",color:C.textMuted,marginTop:"4px"}}>{"All "+raceCount+" words \u2014 zero mistakes"+(isTyped?" \u2014 AI scored":"")}</div>
        </div> : null}
        <div style={styles.title}>Results</div>
        <div style={Object.assign({},styles.subtitle,{marginBottom:"24px"})}>
          {(mode==="race"?"Race \u2014 "+raceCount+" words":"Survival \u2014 3 strikes")+" \u00B7 "+(tier==="all"?"All levels":tier==="med"?"Medium":tier.charAt(0).toUpperCase()+tier.slice(1))+" \u00B7 "+(inputType==="type"?"Typed (AI Scored)":inputType==="reverse"?"Def \u2192 Word":numChoices+" choices")}
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
                            <span style={{fontSize:"13px",fontWeight:400,color:t.color,fontFamily:"'Roboto Mono', monospace"}}>{wl.score}%</span>
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
