import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import CookieConsent from "./components/CookieConsent.jsx";
import UnlockGate from "./components/UnlockGate.jsx";
import AdSlot, { AffiliateSlot } from "./components/AdSlot.jsx";
import StickyAdSlot from "./monetization/StickyAdSlot.jsx";

// Lazy-loaded: none of this code is downloaded until someone actually
// navigates to it. On the homepage (the common case, especially on a
// slow connection) only the generator + password tool ship.
const TemplateGallery = lazy(() => import("./templates/TemplateGallery.jsx"));
const TemplateEditor = lazy(() => import("./templates/TemplateEditor.jsx"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy.jsx"));
const CVEditor = lazy(() => import("./documents/CVEditor.jsx"));
const LetterEditor = lazy(() => import("./documents/LetterEditor.jsx"));
const PdfToImages = lazy(() => import("./tools/PdfToImages.jsx"));
const ImagesToPdf = lazy(() => import("./tools/ImagesToPdf.jsx"));
const TextInImageEditor = lazy(() => import("./tools/TextInImageEditor.jsx"));

/* ============================================================
   FITRER — complete build
   React, frontend-only. No backend, no API, no AI, no storage
   of generated content. Theme preference is the only thing
   ever written to localStorage.
   ============================================================ */

/* ---------------- DATASETS ---------------- */

const FIRST_NAMES = [
  "Amara","Amelia","Elena","Nora","Wren","Ivy","Leah","Sage","June","Priya",
  "Zara","Naomi","Freya","Talia","Rosalind","Maren","Isla","Ada","Cleo","Vera",
  "Nadia","Selene","Ingrid","Bianca","Fiona","Odette","Marisol","Junia","Esme","Delphine",
  "Astrid","Camille","Rhiannon","Saoirse","Yara","Zola","Anouk","Briar","Clove","Dagny",
  "Elowen","Faye","Greta","Hazel","Iolanthe","Junia","Kiri","Liora","Mireille","Niamh",
  "Ottilie","Paloma","Queenie","Runa","Solveig","Thora","Ulla","Vesna","Winnow","Xiomara",
  "Yolanda","Zephyrine","Anessa","Bellamy","Cosima","Daria","Eulalia","Farrah","Giselle","Halcyon",
  "Owen","Julian","Kai","Theo","Ezra","Mateo","Silas","Rowan","Dominic","Felix",
  "Amos","Bram","Caspian","Dashiell","Emeka","Gideon","Hassan","Idris","Jasper","Kofi",
  "Lior","Malik","Niklas","Osric","Percy","Quinn","Ronan","Soren","Tobias","Xavier",
  "Alaric","Barnaby","Cedric","Desmond","Emrys","Fenwick","Gustavo","Hendrix","Ignatius","Jorah",
  "Kellan","Lachlan","Magnus","Nikolai","Oberon","Peregrine","Quillan","Roderick","Stellan","Thaddeus",
  "Ulric","Valentin","Wolfgang","Yusuf","Zane","Ambrose","Corwin","Elian","Frostine","Griffin",
];

const LAST_NAMES = [
  "Williams","Okafor","Bennett","Larsen","Moreau","Whitfield","Alvarez","Kessler","Ndiaye","Hollis",
  "Ashworth","Bergström","Castellano","Dubois","Eriksen","Farrow","Giannis","Halloran","Ibarra","Jarrah",
  "Kavanagh","Lindqvist","Mercer","Novak","Osei","Pemberton","Quintero","Renner","Solano","Thackeray",
  "Underwood","Vasquez","Winslow","Yamashita","Zimmer","Adeyemi","Blackwood","Corbin","Delacroix","Ferro",
  "Granger","Holbrook","Isherwood","Jansen","Kilbride","Lachance","Marchetti","Nakamura","Okonkwo","Pruitt",
  "Quirke","Ravensworth","Sørensen","Tremblay","Uzumaki","Vandermeer","Wexford","Xydias","Yilmaz","Zaharia",
  "Abernathy","Beaumont","Cavanaugh","Dietrich","Ellsworth","Fairweather","Gallo","Harrowgate","Iversen","Jacoby",
  "Kimura","Leclerc","Montague","Norrington","Ochoa","Pavlenko","Quiñones","Rastrick","Sandoval","Thorne",
  "Ueda","Valko","Wickersham","Xenakis","Yarrow","Zellweger","Ansaldo","Bramwell","Colquhoun","Dunmore",
  "Everhart","Featherstone","Goldschmidt","Hawksworth","Ilic","Jarnovic","Kondratiev","Lindgren","Marchbanks","Nkemelu",
  "Oyelaran","Petrakis","Quennell","Rousseau","Sundqvist","Tavernier","Ulyanov","Verhoeven","Winterbourne","Xhosa",
];

const CITIES = [
  { city: "Ravenport", country: "Eldoria" }, { city: "Marlowe Hollow", country: "Kastria" },
  { city: "Thornbury", country: "Velenna" }, { city: "Auralane", country: "Norvenna" },
  { city: "Greystone Falls", country: "Adrisk" }, { city: "Ilverath", country: "Solmere" },
  { city: "Cape Nordell", country: "Brakhen" }, { city: "Windmere", country: "Calthia" },
  { city: "Duskharrow", country: "Eldoria" }, { city: "Bellcaster", country: "Solmere" },
  { city: "Fairloch", country: "Kastria" }, { city: "Ashendale", country: "Norvenna" },
  { city: "Cinderport", country: "Velenna" }, { city: "Larkspire", country: "Adrisk" },
  { city: "Northgale", country: "Brakhen" }, { city: "Hollowmere", country: "Calthia" },
  { city: "Sablewick", country: "Eldoria" }, { city: "Everfield", country: "Solmere" },
  { city: "Stonebrook", country: "Kastria" }, { city: "Wrenhaven", country: "Norvenna" },
  { city: "Millthorpe", country: "Adrisk" }, { city: "Cragmoor", country: "Kastria" },
  { city: "Ferngale", country: "Velenna" }, { city: "Ostergard", country: "Brakhen" },
  { city: "Vellmoor", country: "Calthia" }, { city: "Ashenridge", country: "Solmere" },
  { city: "Harrowgate", country: "Eldoria" }, { city: "Brindlewick", country: "Norvenna" },
  { city: "Thistlemere", country: "Adrisk" }, { city: "Corvinhall", country: "Kastria" },
  { city: "Grayspire", country: "Velenna" }, { city: "Nordholm", country: "Brakhen" },
  { city: "Wintermoor", country: "Calthia" }, { city: "Salvenne", country: "Solmere" },
  { city: "Duncastle", country: "Eldoria" }, { city: "Ferrowick", country: "Norvenna" },
  { city: "Lochabern", country: "Adrisk" }, { city: "Marchwood", country: "Kastria" },
  { city: "Ostrivane", country: "Velenna" }, { city: "Bramblegate", country: "Brakhen" },
  { city: "Kestrelmere", country: "Calthia" }, { city: "Talonreach", country: "Solmere" },
  { city: "Vaelbrook", country: "Eldoria" }, { city: "Rowancliff", country: "Norvenna" },
  { city: "Hallowmere", country: "Adrisk" }, { city: "Draventon", country: "Kastria" },
  { city: "Merrowgate", country: "Velenna" }, { city: "Blackthorne", country: "Brakhen" },
  { city: "Foxhollow", country: "Calthia" }, { city: "Silverleigh", country: "Solmere" },
  { city: "Grimwald", country: "Eldoria" }, { city: "Ambervale", country: "Norvenna" },
];

const STREETS = [
  "Cobalt Lane","Marrow Street","Sable Avenue","Thistle Row","Everwind Drive",
  "Halcyon Court","Foxglove Way","Nettlebrook Road","Ashen Path","Quill Street",
  "Larkspur Lane","Windmere Boulevard","Copperfield Alley","Duskwood Trail","Brindle Court",
  "Hollowmere Street","Ferngate Row","Ravensmoor Lane","Cinder Alley","Thornfield Road",
  "Wrenwood Avenue","Saltmarsh Way","Blackbriar Lane","Grimshaw Street","Amberfell Road",
  "Vellwick Court","Cragmoor Drive","Nightingale Row","Stonecross Lane","Fallowfield Street",
  "Ostgate Alley","Bramblewood Road","Millrace Street","Corvin Avenue","Wintermere Court",
  "Hartswell Lane","Foxridge Drive","Kestrel Row","Deepwater Street","Talonmere Way",
];

const NEIGHBORHOODS = [
  "Old Millside","The Hollow District","Cinderwick","Northgate Quarter","Fairview Bend",
  "Thistlewood","The Marrows","Copper Row","Saltmere","Greybrick Row",
  "Ashenfen","Blackgate Quarter","Ferrowick","Rowancroft","The Warrens",
  "Duskveil","Kestrel Park","Stonebridge","Ravenscroft","Wrenfield",
];

const BUSINESSES = [
  "Northstar Creative Studio","Ilverath & Co.","Cinderport Trading House","The Quiet Press",
  "Marlowe Design Collective","Ashen Fields Farm Supply","Greystone Analytics","Duskwood Bakery",
  "Sablewick Legal Group","Everfield Robotics","Cape Nordell Shipping Co.","Thistle & Thorn Botanicals",
  "Larkspire Media House","Bellcaster Financial","Windmere Architecture Studio",
  "Hollowmere Textiles","Ravenwood Consulting","Ferngate Print Works","Corvin Metalworks","Vellbrook Logistics",
  "Ashenridge Software","Fairloch Roasters","Brindlewick Ceramics","Kestrel Digital Agency","Nordholm Brewery",
  "Thornbury Bookbindery","Saltmere Fisheries","Grayspire Engineering","Millthorpe Furniture Co.","Wrenhaven Studios",
];

const SCHOOLS = [
  "Ravenport Academy","University of Ilverath","Marlowe Institute of Arts","Cinderport Technical College",
  "Everfield Grammar School","Northgale University","Ashendale School of Design","Solmere State College",
  "Greystone Conservatory","Thornbury Polytechnic","Fairloch Academy","Bellcaster Institute of Technology",
  "Hollowmere College of Music","Duskharrow University","Larkspire School of Architecture",
];

const LANDMARKS = [
  "The Halloway Bridge","Ilverath Clock Tower","The Sunken Garden","Marrow Lighthouse",
  "The Old Grain Exchange","Cinderport Harbor Wall","The Bellcaster Observatory","Thistle Market Square",
  "The Greystone Aqueduct","Ravenwood Amphitheater","The Ferngate Arch","Windmere Botanical Gardens",
  "The Corvin Museum","Saltmere Pier","The Hollowmere Belltower",
];

const OCCUPATIONS = [
  "Documentary Photographer","Structural Engineer","Marine Biologist","Pastry Chef","Data Analyst",
  "Landscape Architect","Voice Actor","Furniture Restorer","Investigative Journalist","Cartographer",
  "Sound Designer","Botanist","Paramedic","Museum Curator","Software Developer",
  "Urban Planner","Tailor","Wildlife Rehabilitator","Translator","Ceramicist",
  "Aerospace Technician","Beekeeper","Choreographer","Diplomat","Ethnobotanist",
  "Film Editor","Glassblower","Horologist","Illustrator","Jazz Musician",
  "Kinesiologist","Locksmith","Meteorologist","Naturalist","Optometrist",
  "Puppeteer","Quantity Surveyor","Radiologist","Set Designer","Typographer",
  "Upholsterer","Violin Maker","Watchmaker","Xylographer","Yacht Captain",
  "Zoologist","Archivist","Blacksmith","Cryptographer","Diver",
];

const PERSONALITY_TRAITS = [
  "Curious","Calm","Adventurous","Reserved","Meticulous","Warm","Blunt","Idealistic",
  "Pragmatic","Restless","Gentle","Stubborn","Witty","Guarded","Generous","Observant",
  "Impulsive","Methodical","Playful","Skeptical","Resourceful","Introspective","Assertive","Compassionate",
  "Analytical","Spontaneous","Diplomatic","Fierce","Whimsical","Steadfast","Perceptive","Candid",
  "Tenacious","Serene","Mischievous","Earnest","Wary","Magnetic","Unassuming","Relentless",
  "Tender","Sardonic","Devoted","Restrained","Exuberant","Contemplative","Bold","Meticulous",
  "Forthright","Wistful",
];

const HOBBIES = [
  "Photography","Hiking","Music","Woodworking","Chess","Pottery","Rock climbing","Birdwatching",
  "Baking","Sketching","Sailing","Gardening","Running","Reading","Cycling","Fencing",
  "Astronomy","Calligraphy","Fishing","Dancing","Origami","Kayaking","Beekeeping","Foraging",
  "Blacksmithing","Diving","Archery","Surfing","Quilting","Brewing","Falconry","Juggling",
  "Taxidermy","Bookbinding","Skateboarding","Weaving","Wine tasting","Model building","Yoga","Climbing",
  "Painting","Volunteering","Bouldering","Cooking","Journaling","Camping","Distance running","Chess strategy",
  "Whittling","Amateur astronomy",
];

const LIFESTYLES = [
  "Creative","Minimalist","Nomadic","Routine-driven","Outdoorsy","Homebody","Fast-paced","Balanced",
  "Frugal","Adventurous",
];

const SKILLS = [
  "Public speaking","Negotiation","Coding","Editing","Budgeting","Teaching","Sketching","Repair work",
  "Cooking","Strategic planning",
];

const GOALS = [
  "Start their own studio","Travel to every continent","Write a book","Master a new language",
  "Buy a home by the coast","Run a marathon","Mentor young professionals","Learn to sail",
];

const STORY_TITLES = [
  "The Weight of Small Things","Everything After the Rain","What the Tide Left Behind",
  "The Last Lighthouse Keeper","Static and Silence","The Cartographer's Mistake",
  "Between Two Winters","The Hollow Season","A Map of Missing Places","The Quiet Defection",
];

const STORY_PREMISES = [
  "A lighthouse keeper discovers the sea has stopped sending back what it takes.",
  "A mapmaker realizes a town on her map no longer exists — and never did, until now.",
  "Two estranged siblings inherit a house that seems to be shrinking one room at a time.",
  "A translator begins receiving letters in a language that doesn't officially exist.",
  "A city's power grid fails only in the exact places someone is lying.",
  "An archivist finds her own obituary filed decades before her birth.",
];

const CONFLICTS = [
  "A promise made under false pretenses threatens to unravel everything.",
  "Two people want the same outcome for entirely opposing reasons.",
  "The truth would save one relationship and destroy another.",
  "Something is coming due, and no one agrees on who owes it.",
];

const PLOT_TWISTS = [
  "The narrator has been the antagonist's target all along, not their ally.",
  "The missing person was never missing — they were the one searching.",
  "The event everyone feared has already happened, quietly, off-page.",
  "The map wasn't wrong. Reality moved to match it.",
];

const GENRES = [
  "Literary fiction","Magical realism","Slow-burn mystery","Speculative fiction","Quiet horror","Character drama",
];

const WHAT_IF_QUESTIONS = [
  "What if every lie you told left a permanent, visible mark only you could see?",
  "What if cities aged like people, and yours was entering its final years?",
  "What if you could hear a house's memory of everyone who ever lived in it?",
  "What if grief had a currency, and some people were quietly wealthy in it?",
];

const RANDOM_CHALLENGES = [
  "Write a scene with no dialogue that still reveals a secret.",
  "Describe a room using only sound.",
  "Introduce a character through what they refuse to throw away.",
  "Write the last line of a story first, then build toward it.",
];

/* ---------------- HELPERS ---------------- */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

function generateName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function generateLocation() {
  const c = pick(CITIES);
  return `${c.city}, ${c.country}`;
}

function generateAddress() {
  const c = pick(CITIES);
  return `${Math.floor(Math.random() * 900) + 100} ${pick(STREETS)}, ${pick(NEIGHBORHOODS)}, ${c.city}`;
}

function generateWorkplace() {
  return pick(BUSINESSES);
}

function generateOccupation() {
  return pick(OCCUPATIONS);
}

function generateBio(name, age, occupation, city) {
  return `${name} is a ${age}-year-old ${occupation.toLowerCase()} based in ${city}, known for being ${pick(PERSONALITY_TRAITS).toLowerCase()} and endlessly curious about the world just outside their routine.`;
}

function generateFictionalPerson() {
  const name = generateName();
  const age = Math.floor(Math.random() * 45) + 19;
  const occupation = generateOccupation();
  const workplace = generateWorkplace();
  const traits = pickN(PERSONALITY_TRAITS, 3).join(", ");
  const hobbies = pickN(HOBBIES, 3).join(", ");
  const lifestyle = pick(LIFESTYLES);
  const loc = generateLocation();
  const bio = generateBio(name, age, occupation, loc.split(",")[0]);
  return {
    type: "person",
    fields: [
      ["Name", name],
      ["Age", String(age)],
      ["Occupation", occupation],
      ["Workplace", workplace],
      ["Personality", traits],
      ["Hobbies", hobbies],
      ["Lifestyle", lifestyle],
      ["Location", loc],
      ["Bio", bio],
    ],
  };
}

function generateStoryIdea() {
  return {
    type: "story",
    fields: [
      ["Title", pick(STORY_TITLES)],
      ["Premise", pick(STORY_PREMISES)],
      ["Conflict", pick(CONFLICTS)],
      ["Twist", pick(PLOT_TWISTS)],
      ["Genre", pick(GENRES)],
    ],
  };
}

/* ---------------- INTENT ENGINE ---------------- */
/* Local keyword/alias matching — no AI, no API. */

const INTENT_RULES = [
  { id: "person", keywords: ["fictional person", "character", "person"] },
  { id: "name", keywords: ["name"] },
  { id: "location", keywords: ["location", "place", "city"] },
  { id: "address", keywords: ["address"] },
  { id: "workplace", keywords: ["workplace", "job", "company"] },
  { id: "occupation", keywords: ["occupation", "profession"] },
  { id: "bio", keywords: ["bio", "backstory"] },
  { id: "story", keywords: ["story idea", "story", "plot"] },
  { id: "twist", keywords: ["plot twist", "twist"] },
  { id: "whatif", keywords: ["what-if", "what if"] },
  { id: "challenge", keywords: ["challenge", "writing prompt", "prompt"] },
  { id: "password", keywords: ["password"] },
  { id: "school", keywords: ["school"] },
  { id: "landmark", keywords: ["landmark"] },
  { id: "business", keywords: ["business"] },
];

// Single-word lookup used only for typo tolerance (fuzzy matching below).
// Keeping this separate from INTENT_RULES keeps exact-match behavior
// (fast, precise) untouched while adding a fallback for misspellings.
const KEYWORD_MAP = {
  name: "name",
  location: "location",
  place: "location",
  city: "location",
  address: "address",
  workplace: "workplace",
  job: "workplace",
  company: "workplace",
  occupation: "occupation",
  profession: "occupation",
  bio: "bio",
  backstory: "bio",
  story: "story",
  plot: "story",
  twist: "twist",
  password: "password",
  school: "school",
  landmark: "landmark",
  business: "business",
  person: "person",
  character: "person",
  prompt: "challenge",
  challenge: "challenge",
};

// Plain edit-distance (no dependency) — how many single-character edits
// separate two words. Used to catch typos like "pasword" -> "password".
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function fuzzyIntents(text) {
  const words = text.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter(Boolean);
  const found = [];
  for (const w of words) {
    if (w.length < 3) continue;
    for (const key of Object.keys(KEYWORD_MAP)) {
      if (w === key) continue; // exact matches are already caught by the main pass
      const maxDist = w.length <= 4 ? 1 : w.length <= 7 ? 2 : 3;
      if (Math.abs(w.length - key.length) <= maxDist && levenshtein(w, key) <= maxDist) {
        found.push(KEYWORD_MAP[key]);
        break;
      }
    }
  }
  return found;
}

function detectIntents(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) found.push(rule.id);
  }
  found.push(...fuzzyIntents(text));
  // "fictional person" already implies name/location/etc — don't double with lone "name"
  if (found.includes("person")) {
    return ["person"];
  }
  return [...new Set(found)];
}

function buildResult(text) {
  const intents = detectIntents(text);
  if (intents.length === 0) return null;

  if (intents.includes("person")) return generateFictionalPerson();
  if (intents.includes("story") || intents.includes("twist") || intents.includes("whatif") || intents.includes("challenge")) {
    if (intents.includes("story")) return generateStoryIdea();
    if (intents.includes("twist")) return { type: "single", fields: [["Plot Twist", pick(PLOT_TWISTS)]] };
    if (intents.includes("whatif")) return { type: "single", fields: [["What-If", pick(WHAT_IF_QUESTIONS)]] };
    if (intents.includes("challenge")) return { type: "single", fields: [["Writing Challenge", pick(RANDOM_CHALLENGES)]] };
  }

  const fields = [];
  if (intents.includes("name")) fields.push(["Name", generateName()]);
  if (intents.includes("location")) fields.push(["Location", generateLocation()]);
  if (intents.includes("address")) fields.push(["Address", generateAddress()]);
  if (intents.includes("workplace")) fields.push(["Workplace", generateWorkplace()]);
  if (intents.includes("occupation")) fields.push(["Occupation", generateOccupation()]);
  if (intents.includes("school")) fields.push(["School", pick(SCHOOLS)]);
  if (intents.includes("landmark")) fields.push(["Landmark", pick(LANDMARKS)]);
  if (intents.includes("business")) fields.push(["Business", pick(BUSINESSES)]);
  if (intents.includes("bio")) {
    const name = generateName();
    fields.push(["Bio", generateBio(name, Math.floor(Math.random() * 40) + 20, generateOccupation(), generateLocation().split(",")[0])]);
  }

  if (fields.length === 0) return null;
  return { type: "combo", fields };
}

/* ---------------- PASSWORD LOGIC ---------------- */

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SYMS = "!@#$%^&*()_-+=?";

function generateSecurePassword(length, upper, lower, numbers, symbols) {
  let charset = "";
  if (upper) charset += UPPER;
  if (lower) charset += LOWER;
  if (numbers) charset += NUMS;
  if (symbols) charset += SYMS;
  if (!charset) charset = LOWER;

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

function estimateStrength(password, upper, lower, numbers, symbols) {
  if (!password) return { score: 0, label: "--" };
  let poolSize = 0;
  if (upper) poolSize += 26;
  if (lower) poolSize += 26;
  if (numbers) poolSize += 10;
  if (symbols) poolSize += SYMS.length;
  if (poolSize === 0) poolSize = 26;

  const entropy = password.length * Math.log2(poolSize);
  let score = 0;
  if (entropy >= 80) score = 4;
  else if (entropy >= 60) score = 3;
  else if (entropy >= 40) score = 2;
  else if (entropy >= 25) score = 1;
  else score = 0;

  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  return { score, label: labels[score] };
}

/* ---------------- THEME HOOK ---------------- */

const COLOR_THEMES = [
  { id: "violet", name: "Violet", primary: "#6D4AFF", darkPrimary: "#9B7BFF" },
  { id: "ocean", name: "Ocean Blue", primary: "#1479FF", darkPrimary: "#4DA3FF" },
  { id: "emerald", name: "Emerald", primary: "#10A878", darkPrimary: "#34D399" },
  { id: "coral", name: "Coral", primary: "#F05A47", darkPrimary: "#FF806E" },
  { id: "rose", name: "Rose", primary: "#E84D8A", darkPrimary: "#FF75AA" },
  { id: "amber", name: "Amber", primary: "#D98A00", darkPrimary: "#FFB52E" },
];

function useColorTheme() {
  const [colorThemeId, setColorThemeId] = useState("violet");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fitrer-color-theme");
      if (saved && COLOR_THEMES.some((t) => t.id === saved)) setColorThemeId(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const selectColorTheme = (id) => {
    setColorThemeId(id);
    try {
      window.localStorage.setItem("fitrer-color-theme", id);
    } catch (e) {
      /* ignore */
    }
  };

  return [colorThemeId, selectColorTheme];
}

function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fitrer-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem("fitrer-theme", next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  };

  return [theme, toggle];
}

/* ---------------- EXAMPLES & LIVE SUGGESTIONS ---------------- */

// Grouping of the real, working categories — powers the "Categories"
// header dropdown. Only real, currently-functioning generators are
// listed here; nothing that doesn't exist yet.
const CATEGORY_GROUPS = [
  {
    group: "People & Identity",
    items: [
      { label: "Name", phrase: "I need a name" },
      { label: "Fictional Person", phrase: "I need a fictional person" },
      { label: "Bio", phrase: "I need a bio" },
    ],
  },
  {
    group: "Places & Locations",
    items: [
      { label: "Location", phrase: "I need a location" },
      { label: "Address", phrase: "I need an address" },
      { label: "School", phrase: "I need a school" },
      { label: "Landmark", phrase: "I need a landmark" },
    ],
  },
  {
    group: "Work & Business",
    items: [
      { label: "Workplace", phrase: "I need a workplace" },
      { label: "Occupation", phrase: "I need an occupation" },
      { label: "Business Name", phrase: "I need a business name" },
    ],
  },
  {
    group: "Writing & Ideas",
    items: [
      { label: "Story Idea", phrase: "I need a story idea" },
      { label: "Plot Twist", phrase: "I need a plot twist" },
      { label: "What-if Question", phrase: "I need a what-if question" },
      { label: "Writing Challenge", phrase: "I need a writing challenge" },
    ],
  },
];

// A wider bank used only to power the live "as you type" suggestion
// dropdown.
const SUGGESTION_PHRASES = [
  "I need a name",
  "I need a fictional person",
  "I need a name and location",
  "I need a location",
  "I need an address",
  "I need a workplace",
  "I need an occupation",
  "I need a bio",
  "I need a story idea",
  "I need a plot twist",
  "I need a what-if question",
  "I need a writing challenge",
  "I need a school",
  "I need a landmark",
  "I need a business name",
  "I need a password",
];

// Suggestions appear the moment there's a close match — substring
// matches rank first, typo-tolerant matches (via levenshtein) fill in
// after, so a misspelled word still surfaces something useful.
function getSuggestions(text) {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const lastWord = q.split(/\s+/).pop();
  const scored = SUGGESTION_PHRASES.map((phrase) => {
    const lower = phrase.toLowerCase();
    if (lower.includes(q)) return { phrase, score: 0 };
    const words = lower.split(/\s+/);
    let best = Infinity;
    for (const w of words) {
      const d = levenshtein(lastWord, w);
      if (d < best) best = d;
    }
    return { phrase, score: best + 1 };
  })
    .filter((s) => s.score <= 3)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((s) => s.phrase);
  return scored;
}

/* ---------------- APP ---------------- */

export default function Fitrer() {
  const [theme, toggleTheme] = useTheme();
  const isDark = theme === "dark";
  const [colorThemeId, selectColorTheme] = useColorTheme();
  const [showCategories, setShowCategories] = useState(false);

  const [view, setView] = useState("home"); // "home" | "templates" | "editor"
  const [activeTemplate, setActiveTemplate] = useState(null);

  const [request, setRequest] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [bulkUnlocked, setBulkUnlocked] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [showBulkGate, setShowBulkGate] = useState(false);

  // Clear any bulk batch the moment the search text changes — an old
  // batch of 10 shouldn't linger under a new, different query.
  useEffect(() => {
    setBulkResults([]);
  }, [request]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copiedPw, setCopiedPw] = useState(false);

  const strength = useMemo(
    () => estimateStrength(password, useUpper, useLower, useNumbers, useSymbols),
    [password, useUpper, useLower, useNumbers, useSymbols]
  );

  const handleSubmit = () => {
    if (!request.trim()) return;
    setShowSuggestions(false);
    if (detectIntents(request).includes("password")) {
      const pw = generateSecurePassword(length, useUpper, useLower, useNumbers, useSymbols);
      setPassword(pw);
      setResult(null);
      setNotFound(false);
      return;
    }
    const r = buildResult(request);
    if (r) {
      setResult(r);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleExample = (ex) => {
    setRequest(ex);
    setShowSuggestions(false);
    if (detectIntents(ex).includes("password")) {
      const pw = generateSecurePassword(length, useUpper, useLower, useNumbers, useSymbols);
      setPassword(pw);
      setResult(null);
      setNotFound(false);
      return;
    }
    const r = buildResult(ex);
    setResult(r || null);
    setNotFound(!r);
  };

  // Live "smart search": fires on every keystroke. Shows a suggestion
  // dropdown immediately (typo-tolerant), and — once the text already
  // clearly means something — generates a result right away, before
  // Enter is pressed. Password is excluded from the live-result path
  // since it depends on the length/character options below, so it
  // still needs an explicit submit.
  const handleRequestChange = (val) => {
    setRequest(val);
    setSuggestions(getSuggestions(val));
    setShowSuggestions(val.trim().length > 0);

    if (!val.trim()) {
      setNotFound(false);
      return;
    }
    const intents = detectIntents(val);
    if (intents.length && !intents.includes("password")) {
      const r = buildResult(val);
      if (r) {
        setResult(r);
        setNotFound(false);
      }
    }
  };

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword(length, useUpper, useLower, useNumbers, useSymbols));
  };

  const copyField = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1200);
    } catch (e) {
      /* clipboard unavailable — silently ignore */
    }
  };

  // Copies every field in the current result together, formatted as
  // "Label: value" per line — an alternative to copying one field at a
  // time. Both options stay visible; which one someone uses is up to them.
  const copyAllFields = async () => {
    if (!result) return;
    const text = result.fields.map(([label, value]) => `${label}: ${value}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField("__all__");
      setTimeout(() => setCopiedField(null), 1200);
    } catch (e) {
      /* clipboard unavailable — silently ignore */
    }
  };

  // Bulk export (premium): generate 10 results at once instead of one.
  // Unlocked once per session by watching an ad, same pattern as the
  // template unlocks — after that, generating more batches is instant.
  const generateBulkBatch = () => {
    const batch = [];
    for (let i = 0; i < 10; i++) {
      const r = buildResult(request);
      if (r) batch.push(r);
    }
    setBulkResults(batch);
  };

  const handleBulkClick = () => {
    if (!bulkUnlocked) {
      setShowBulkGate(true);
      return;
    }
    generateBulkBatch();
  };

  const handleBulkUnlock = () => {
    setBulkUnlocked(true);
    setShowBulkGate(false);
    generateBulkBatch();
  };

  const copyAllBulk = async () => {
    if (!bulkResults.length) return;
    const text = bulkResults
      .map((r, i) => `#${i + 1}\n` + r.fields.map(([label, value]) => `${label}: ${value}`).join("\n"))
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField("__bulk__");
      setTimeout(() => setCopiedField(null), 1200);
    } catch (e) {
      /* clipboard unavailable — silently ignore */
    }
  };

  const copyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopiedPw(true);
      setTimeout(() => setCopiedPw(false), 1200);
    } catch (e) {
      /* ignore */
    }
  };

  const c = isDark
    ? {
        bg: "#0A0A12",
        surface: "#15151F",
        surfaceAlt: "#1B1B27",
        border: "#26263380",
        text: "#F4F3F8",
        textDim: "#9694A3",
        placeholder: "#5C5A6B",
      }
    : {
        bg: "#F7F7FB",
        surface: "#FFFFFF",
        surfaceAlt: "#FBFBFE",
        border: "#E7E6F0",
        text: "#16151F",
        textDim: "#6E6C7C",
        placeholder: "#ACAAB8",
      };

  const activeColorTheme = COLOR_THEMES.find((t) => t.id === colorThemeId) || COLOR_THEMES[0];
  const accent = isDark ? activeColorTheme.darkPrimary : activeColorTheme.primary;

  // Keeps the actual <html>/<body> background in sync with the app's
  // theme. Without this, a brief flash of the browser's default white
  // background can show through during mobile overscroll bounce or
  // before the page's own background paints — this makes the full
  // screen feel like FITRER's background, edge to edge, always.
  useEffect(() => {
    document.documentElement.style.background = c.bg;
    document.body.style.background = c.bg;
    document.body.style.transition = "background-color 0.6s ease";
  }, [c.bg]);
  const accentSoft = isDark ? `${accent}26` : `${accent}14`;
  const strengthColors = ["#E5484D", "#F5A524", "#F5A524", "#3DD68C", "#22B573"];

  const styles = {
    root: {
      background: c.bg,
      color: c.text,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      display: "flex",
      justifyContent: "center",
      padding: "20px 16px 40px",
      transition: "background-color 0.6s ease, color 0.6s ease",
    },
    page: { width: "100%", maxWidth: "640px" },
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", rowGap: "10px" },
    brandRow: { display: "flex", alignItems: "center", gap: "8px" },
    brandMark: {
      width: "24px",
      height: "24px",
      borderRadius: "7px",
      background: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#FFFFFF",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
    },
    brand: { fontSize: "18px", fontWeight: 800, letterSpacing: "-0.01em", color: c.text },
    toggleWrap: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: "999px",
      padding: "7px 12px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: 600,
      color: c.textDim,
      transition: "background-color 0.6s ease, border-color 0.6s ease",
    },
    heroHeading: {
      fontSize: "clamp(26px, 6vw, 34px)",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      textAlign: "center",
      marginBottom: "10px",
      lineHeight: 1.15,
    },
    heroSub: { textAlign: "center", fontSize: "13.5px", color: c.textDim, marginBottom: "22px", lineHeight: 1.5 },
    inputRow: { display: "flex", gap: "10px", marginBottom: "10px" },
    input: {
      flex: 1,
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: "16px",
      padding: "16px 18px",
      fontSize: "15px",
      color: c.text,
      outline: "none",
      fontFamily: "inherit",
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(20,10,50,0.05)",
      transition: "background-color 0.6s ease, border-color 0.6s ease",
    },
    submitBtn: {
      width: "52px",
      flexShrink: 0,
      background: accent,
      border: "none",
      borderRadius: "16px",
      color: "#FFFFFF",
      fontSize: "18px",
      cursor: "pointer",
    },
    bulkBtn: {
      width: "100%",
      marginTop: "10px",
      marginBottom: "18px",
      background: "transparent",
      border: `1px solid ${accent}`,
      borderRadius: "10px",
      color: accent,
      fontSize: "13px",
      fontWeight: 700,
      padding: "11px",
      cursor: "pointer",
    },
    resultCard: {
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: "18px",
      padding: "22px",
      marginBottom: "18px",
      boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 24px rgba(20,10,50,0.04)",
      transition: "background-color 0.6s ease, border-color 0.6s ease",
    },
    resultHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
    resultEyebrow: { fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, marginBottom: "4px" },
    resultTitle: { fontSize: "17px", fontWeight: 800, color: c.text },
    resultBadge: {
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: accent,
      background: accentSoft,
      borderRadius: "999px",
      padding: "5px 10px",
    },
    resultRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${c.border}` },
    resultLabel: { fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: c.textDim, flexShrink: 0, width: "90px", paddingTop: "2px" },
    resultValue: { fontSize: "14px", color: c.text, flex: 1, lineHeight: 1.5 },
    resultCopy: { fontSize: "11px", color: accent, background: "none", border: "none", cursor: "pointer", flexShrink: 0, paddingTop: "2px" },
    resultActions: { display: "flex", gap: "10px", marginTop: "16px" },
    resultActionCopy: {
      flex: 1,
      background: "none",
      border: `1px solid ${c.border}`,
      borderRadius: "10px",
      color: c.text,
      fontSize: "13px",
      fontWeight: 700,
      padding: "12px",
      cursor: "pointer",
    },
    resultActionAgain: {
      flex: 1,
      background: accent,
      border: "none",
      borderRadius: "10px",
      color: "#FFFFFF",
      fontSize: "13px",
      fontWeight: 700,
      padding: "12px",
      cursor: "pointer",
    },
    suggestionDropdown: {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: 0,
      right: 0,
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 20,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
    suggestionItem: {
      display: "block",
      width: "100%",
      textAlign: "left",
      background: "none",
      border: "none",
      borderBottom: `1px solid ${c.border}`,
      padding: "11px 14px",
      fontSize: "13px",
      color: c.text,
      cursor: "pointer",
    },
    notFound: { textAlign: "center", fontSize: "13px", color: c.textDim, marginBottom: "28px" },
    card: { background: c.surface, border: `1px solid ${c.border}`, borderRadius: "16px", padding: "22px 20px", marginBottom: "36px" },
    cardHeader: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: c.textDim, marginBottom: "20px" },
    fieldRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    fieldLabel: { fontSize: "13.5px", color: c.text },
    fieldValue: { fontSize: "13.5px", color: accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
    slider: { width: "100%", accentColor: accent, marginBottom: "18px" },
    checksGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
    checkItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: c.text },
    checkbox: { width: "16px", height: "16px", accentColor: accent },
    generateBtn: { width: "100%", background: accent, border: "none", borderRadius: "10px", color: "#FFFFFF", fontSize: "14.5px", fontWeight: 700, padding: "13px", cursor: "pointer", marginBottom: "12px" },
    outputRow: { display: "flex", gap: "8px", marginBottom: "12px" },
    output: { flex: 1, background: c.surfaceAlt, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "13px 14px", fontSize: "14px", fontFamily: "'JetBrains Mono', ui-monospace, monospace", color: password ? c.text : c.placeholder, wordBreak: "break-all" },
    copyBtn: { width: "46px", flexShrink: 0, background: c.surfaceAlt, border: `1px solid ${c.border}`, borderRadius: "10px", color: copiedPw ? accent : c.textDim, fontSize: "14px", cursor: "pointer" },
    actionRow: { display: "flex", gap: "10px", marginBottom: "18px" },
    actionBtn: { flex: 1, background: "transparent", border: `1px solid ${c.border}`, borderRadius: "10px", padding: "11px", fontSize: "13px", color: c.text, cursor: "pointer" },
    strengthLabel: { fontSize: "12px", color: c.textDim, marginBottom: "8px" },
    strengthBar: { display: "flex", gap: "5px", height: "5px" },
    footer: { textAlign: "center" },
    whatSection: { marginBottom: "28px", padding: "24px 22px", background: c.surface, border: `1px solid ${c.border}`, borderRadius: "18px", transition: "background-color 0.6s ease, border-color 0.6s ease" },
    whatTitle: { fontSize: "16px", fontWeight: 800, color: c.text, marginBottom: "6px" },
    whatSub: { fontSize: "12.5px", color: c.textDim, lineHeight: 1.5, marginBottom: "20px" },
    footerLine1: { fontSize: "13px", color: c.textDim, marginBottom: "4px" },
    footerLine2: { fontSize: "13px", color: accent, fontWeight: 600 },
  };

  let content;

  if (view === "templates") {
    content = (
      <TemplateGallery
        c={c}
        accent={accent}
        isDark={isDark}
        onSelect={(t) => {
          setActiveTemplate(t);
          setView("editor");
        }}
        onBack={() => setView("home")}
      />
    );
  } else if (view === "editor" && activeTemplate) {
    content = (
      <TemplateEditor
        c={c}
        accent={accent}
        template={activeTemplate}
        onBack={() => setView("templates")}
      />
    );
  } else if (view === "privacy") {
    content = <PrivacyPolicy c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "cv") {
    content = <CVEditor c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "letter") {
    content = <LetterEditor c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "pdf-to-images") {
    content = <PdfToImages c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "images-to-pdf") {
    content = <ImagesToPdf c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "text-in-image") {
    content = <TextInImageEditor c={c} accent={accent} onBack={() => setView("home")} />;
  } else if (view === "password") {
    content = (
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 20px 60px" }}>
        <button
          onClick={() => setView("home")}
          style={{ background: "none", border: "none", color: c.textDim, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}
        >
          ← Back
        </button>

        <div style={styles.card}>
          <div style={styles.cardHeader}><span>🔒</span> Password Generator</div>

          <div style={styles.fieldRow}>
            <span style={styles.fieldLabel}>Password length</span>
            <span style={styles.fieldValue}>{length}</span>
          </div>
          <input type="range" min="6" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))} style={styles.slider} />

          <div style={styles.checksGrid}>
            <label style={styles.checkItem}>
              <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} style={styles.checkbox} />
              Uppercase (A-Z)
            </label>
            <label style={styles.checkItem}>
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} style={styles.checkbox} />
              Numbers (0-9)
            </label>
            <label style={styles.checkItem}>
              <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} style={styles.checkbox} />
              Lowercase (a-z)
            </label>
            <label style={styles.checkItem}>
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} style={styles.checkbox} />
              Symbols (!@#$%)
            </label>
          </div>

          <button style={styles.generateBtn} onClick={handleGeneratePassword}>Generate Password</button>

          <div style={styles.outputRow}>
            <div style={styles.output}>{password || "Your password will appear here"}</div>
            <button style={styles.copyBtn} onClick={copyPassword} aria-label="Copy password">
              {copiedPw ? "✓" : "⧉"}
            </button>
          </div>

          <div style={styles.actionRow}>
            <button style={styles.actionBtn} onClick={copyPassword}>Copy</button>
            <button style={styles.actionBtn} onClick={handleGeneratePassword}>Generate New</button>
          </div>

          <div style={styles.strengthLabel}>Strength: {strength.label}</div>
          <div style={styles.strengthBar}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: "3px",
                  background: i <= strength.score - 1 || (strength.score === 0 && false) ? strengthColors[strength.score] : c.border,
                  opacity: password && i < Math.max(strength.score, 1) ? 1 : password ? 0.35 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div style={styles.page}>
        <div style={styles.topbar}>
          <div style={styles.brandRow}>
            <div style={styles.brandMark}>F</div>
            <div style={styles.brand}>FITRER</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", flexWrap: "wrap", justifyContent: "flex-end", rowGap: "8px" }}>
            <button
              onClick={() => setShowCategories((v) => !v)}
              style={{
                background: "none",
                border: `1px solid ${c.border}`,
                borderRadius: "999px",
                padding: "8px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: c.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Categories <span style={{ fontSize: "9px" }}>{showCategories ? "▲" : "▼"}</span>
            </button>

            {showCategories && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  width: "min(320px, 88vw)",
                  maxHeight: "70vh",
                  overflowY: "auto",
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                  borderRadius: "14px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                  padding: "16px",
                  zIndex: 50,
                }}
              >
                {CATEGORY_GROUPS.map((g) => (
                  <div key={g.group} style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>
                      {g.group}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {g.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            handleExample(item.phrase);
                            setShowCategories(false);
                          }}
                          style={{
                            fontSize: "12px",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            border: `1px solid ${c.border}`,
                            background: "transparent",
                            color: c.text,
                            cursor: "pointer",
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>
                    Security
                  </div>
                  <button
                    onClick={() => {
                      setView("password");
                      setShowCategories(false);
                    }}
                    style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                  >
                    Password
                  </button>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>
                    Templates
                  </div>
                  <button
                    onClick={() => {
                      setView("templates");
                      setShowCategories(false);
                    }}
                    style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                  >
                    Birthday · Wedding · Funeral / Memorial · Pet
                  </button>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>
                    Image & PDF Tools
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <button
                      onClick={() => {
                        setView("text-in-image");
                        setShowCategories(false);
                      }}
                      style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                    >
                      Text-in-Image Editor
                    </button>
                    <button
                      onClick={() => {
                        setView("pdf-to-images");
                        setShowCategories(false);
                      }}
                      style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                    >
                      PDF → Images
                    </button>
                    <button
                      onClick={() => {
                        setView("images-to-pdf");
                        setShowCategories(false);
                      }}
                      style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                    >
                      Images → PDF
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>
                    Documents & Productivity
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <button
                      onClick={() => {
                        setView("cv");
                        setShowCategories(false);
                      }}
                      style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                    >
                      CV / Resume Builder — 5 designs
                    </button>
                    <button
                      onClick={() => {
                        setView("letter");
                        setShowCategories(false);
                      }}
                      style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "999px", border: `1px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}
                    >
                      Letter Builder — 5 designs
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: "14px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: c.textDim, marginBottom: "8px" }}>
                    Color Theme
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {COLOR_THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => selectColorTheme(t.id)}
                        title={t.name}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: isDark ? t.darkPrimary : t.primary,
                          border: t.id === colorThemeId ? `2px solid ${c.text}` : "2px solid transparent",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setView("templates")}
              style={{
                background: "none",
                border: `1px solid ${c.border}`,
                borderRadius: "999px",
                padding: "8px 14px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: c.text,
                cursor: "pointer",
              }}
            >
              Templates
            </button>
            <button style={styles.toggleWrap} onClick={toggleTheme} aria-label="Toggle light and dark theme">
              <span>{isDark ? "☾" : "☀"}</span>
              <span className="theme-toggle-label">{isDark ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>

        <h1 style={styles.heroHeading}>
          What do you <span style={{ color: accent }}>need?</span>
        </h1>
        <p style={styles.heroSub}>Type what you need and FITRER will generate supported results instantly.</p>

        <div style={{ position: "relative" }}>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={request}
              onChange={(e) => handleRequestChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              onFocus={() => setShowSuggestions(request.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
              placeholder="I need a name..."
              autoComplete="off"
            />
            <button style={styles.submitBtn} onClick={handleSubmit} aria-label="Generate">→</button>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div style={styles.suggestionDropdown}>
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  style={{ ...styles.suggestionItem, borderBottom: i === suggestions.length - 1 ? "none" : styles.suggestionItem.borderBottom }}
                  onMouseDown={() => handleExample(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div style={styles.resultCard}>
            {result.fields.length > 1 && (
              <div style={styles.resultAllRow}>
                <span style={styles.resultAllLabel}>All results</span>
                <button style={styles.resultCopyAll} onClick={copyAllFields}>
                  {copiedField === "__all__" ? "Copied all" : "Copy all"}
                </button>
              </div>
            )}
            {result.fields.map(([label, value], i) => (
              <div key={label} style={{ ...styles.resultRow, borderBottom: i === result.fields.length - 1 ? "none" : styles.resultRow.borderBottom }}>
                <div style={styles.resultLabel}>{label}</div>
                <div style={styles.resultValue}>{value}</div>
                <button style={styles.resultCopy} onClick={() => copyField(label, value)}>
                  {copiedField === label ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}

        {result && (
          <button style={styles.bulkBtn} onClick={handleBulkClick}>
            {bulkUnlocked ? "Generate 10 more" : "🔒 Get 10 at once"}
          </button>
        )}

        {bulkResults.length > 0 && (
          <div style={styles.resultCard}>
            <div style={styles.resultAllRow}>
              <span style={styles.resultAllLabel}>Bulk results ({bulkResults.length})</span>
              <button style={styles.resultCopyAll} onClick={copyAllBulk}>
                {copiedField === "__bulk__" ? "Copied all" : "Copy all"}
              </button>
            </div>
            {bulkResults.map((r, idx) => (
              <div
                key={idx}
                style={{
                  paddingBottom: "10px",
                  marginBottom: "10px",
                  borderBottom: idx === bulkResults.length - 1 ? "none" : `1px solid ${c.border}`,
                }}
              >
                {r.fields.map(([label, value]) => (
                  <div key={label} style={{ fontSize: "12.5px", color: c.text, marginBottom: "2px" }}>
                    <strong>{label}:</strong> {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {notFound && (
          <div style={styles.notFound}>
            Couldn't quite match that request — try one of the examples above.
          </div>
        )}

        {password && (
          <div style={styles.resultCard}>
            <div style={styles.resultAllRow}>
              <span style={styles.resultAllLabel}>Password</span>
              <button
                onClick={() => setView("password")}
                style={{ background: "none", border: "none", color: accent, fontSize: "11.5px", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                Adjust settings →
              </button>
            </div>
            <div style={styles.outputRow}>
              <div style={styles.output}>{password}</div>
              <button style={styles.copyBtn} onClick={copyPassword} aria-label="Copy password">
                {copiedPw ? "✓" : "⧉"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button style={{ ...styles.actionBtn, flex: 1 }} onClick={copyPassword}>Copy</button>
              <button style={{ ...styles.actionBtn, flex: 1 }} onClick={handleGeneratePassword}>Generate New</button>
            </div>
          </div>
        )}

        <div style={styles.whatSection}>
          <div style={styles.whatTitle}>What can FITRER generate?</div>
          <p style={styles.whatSub}>
            Names, locations, addresses, schools, businesses, fictional profiles, stories, passwords, and templates
            — all from one simple generator.
          </p>
          <button
            onClick={() => setShowCategories(true)}
            style={{ background: "none", border: `1px solid ${c.border}`, borderRadius: "999px", padding: "8px 16px", fontSize: "12.5px", fontWeight: 700, color: accent, cursor: "pointer" }}
          >
            Browse all categories →
          </button>
        </div>

        <AdSlot c={c} type="adsense" placement="homepage" slotId="AD_HOME_TOP" />
        <AffiliateSlot c={c} placement="homepage" slotId="AFF_HOME_RECOMMENDED" />

        {showBulkGate && (
          <UnlockGate
            c={c}
            accent={accent}
            title="Unlock bulk results"
            message="Watch a short ad to unlock generating 10 results at once, free — no account needed."
            onUnlock={handleBulkUnlock}
            onClose={() => setShowBulkGate(false)}
          />
        )}

        <div style={styles.footer}>
          <div style={styles.footerLine1}>Nothing saved. Nothing stored.</div>
          <div style={styles.footerLine2}>Generate. Copy. Done.</div>
          <button
            onClick={() => setView("privacy")}
            style={{ background: "none", border: "none", color: c.textDim, fontSize: "11.5px", cursor: "pointer", marginTop: "10px", textDecoration: "underline", padding: 0 }}
          >
            Privacy Policy
          </button>
        </div>

        <StickyAdSlot c={c} page="home" />
      </div>
    );
  }

  return (
    <>
      <div className="fitrer-root" style={styles.root}>
        <Suspense
          fallback={
            <div style={{ padding: "60px 20px", textAlign: "center", fontSize: "13px", color: c.textDim }}>
              Loading…
            </div>
          }
        >
          {content}
        </Suspense>
      </div>
      <CookieConsent c={c} accent={accent} onOpenPrivacy={() => setView("privacy")} />
    </>
  );
}