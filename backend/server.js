require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://slaypedia.vercel.app",
  ]
}));
app.use(express.json());

const BASE    = "https://datasets-server.huggingface.co";
const DATASET = "MLBtrio/genz-slang-dataset";
const CONFIG  = "default";
const SPLIT   = "train";

// ── In-memory cache ───────────────────────────────────────────────────────────
const cache     = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function cacheSet(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Fetch with timeout + retry ────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 3, timeoutMs = 8000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return res.json();
      if (res.status === 429) {
        const wait = attempt * 1500;
        console.warn(`[HF] rate limited, waiting ${wait}ms (attempt ${attempt}/${retries})`);
        await sleep(wait);
        continue;
      }
      if (res.status >= 500 && attempt < retries) {
        console.warn(`[HF] server error ${res.status}, retrying (attempt ${attempt}/${retries})`);
        await sleep(attempt * 800);
        continue;
      }
      throw new Error(`HuggingFace responded with ${res.status}`);
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        console.warn(`[HF] request timed out (attempt ${attempt}/${retries})`);
        if (attempt < retries) { await sleep(attempt * 800); continue; }
        throw new Error("HuggingFace request timed out. Check your internet connection.");
      }
      if (attempt < retries) { await sleep(attempt * 800); continue; }
      throw err;
    }
  }
  throw new Error("HuggingFace API unreachable after retries.");
}

// ── HuggingFace helpers ───────────────────────────────────────────────────────
async function hfSearch(query, offset = 0, length = 8) {
  const url = `${BASE}/search?dataset=${encodeURIComponent(DATASET)}&config=${CONFIG}&split=${SPLIT}&query=${encodeURIComponent(query)}&offset=${offset}&length=${length}`;
  const key = `search:${query}:${offset}:${length}`;
  const hit = cacheGet(key);
  if (hit) { console.log(`[cache] hit → ${key}`); return hit; }
  const data = await fetchWithRetry(url);
  cacheSet(key, data);
  return data;
}

async function hfRows(offset = 0, length = 1) {
  const url = `${BASE}/rows?dataset=${encodeURIComponent(DATASET)}&config=${CONFIG}&split=${SPLIT}&offset=${offset}&length=${length}`;
  return fetchWithRetry(url);
}

// ── Normalize row ─────────────────────────────────────────────────────────────
function normalize(row) {
  const keys     = Object.keys(row);
  const slangKey = keys.find(k => /slang|word|term/i.test(k))         || keys[0];
  const descKey  = keys.find(k => /desc|meaning|definition/i.test(k)) || keys[1];
  const exKey    = keys.find(k => /example|use|sentence/i.test(k))    || keys[2];
  const word    = (row[slangKey] || "").trim();
  const meaning = (row[descKey]  || "").trim();
  const example = (row[exKey]    || "").trim();
  if (!word || !meaning) return null;
  return { word, meaning, example };
}

// ── Deduplicate — keep first unique word (case insensitive) ───────────────────
function dedupe(arr) {
  const seen = new Set();
  return arr.filter(r => {
    if (!r) return false;
    const key = r.word.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Check if result has good data ─────────────────────────────────────────────
function isGood(r) {
  return r && r.word && r.meaning && r.meaning.length > 5;
}

// ── Fallback data (built-in — always works) ───────────────────────────────────
const FALLBACK = [
  { word: "rizz",                      meaning: "Natural charm or ability to attract others without trying.",   example: "Bro has unspoken rizz, he didn't even say anything." },
  { word: "slay",                      meaning: "To do something exceptionally well or look amazing.",          example: "She walked in and absolutely slayed the fit." },
  { word: "bussin",                    meaning: "Extremely good, usually about food.",                          example: "This biryani is bussin no cap." },
  { word: "no cap",                    meaning: "No lie, for real. Emphasizes you're telling the truth.",       example: "That movie was fire no cap." },
  { word: "delulu",                    meaning: "Delusional. Having unrealistic expectations or fantasies.",    example: "She thinks he likes her back — she's so delulu." },
  { word: "it's giving",               meaning: "It has the vibe or energy of something specific.",             example: "That outfit? It's giving main character energy." },
  { word: "lowkey",                    meaning: "Secretly or subtly. Understated. To a small degree.",         example: "I lowkey want to skip the party tonight." },
  { word: "hits different",            meaning: "Feels uniquely special or better compared to other things.",  example: "Music hits different when it's raining." },
  { word: "sus",                       meaning: "Suspicious or shady. Shortened from suspect.",                example: "Why are you being so sus rn?" },
  { word: "understood the assignment", meaning: "Perfectly executed what was expected of you.",                example: "She came dressed as the villain — understood the assignment." },
  { word: "main character",            meaning: "Acting like the protagonist of your own story.",              example: "She walked in with that playlist — total main character moment." },
  { word: "ate",                       meaning: "Did something perfectly. Nailed it completely.",              example: "She ate that performance, no crumbs left." },
  { word: "snatched",                  meaning: "Looking extremely good. On point.",                           example: "Her makeup is snatched today fr." },
  { word: "periodt",                   meaning: "End of discussion. Emphasizes a point strongly.",             example: "She's the best in the game periodt." },
  { word: "rent free",                 meaning: "Something that lives in your head constantly without effort.", example: "That song is living in my head rent free." },
  { word: "vibe",                      meaning: "A feeling or atmosphere. Also means to relax and enjoy.",     example: "This place has such good vibes." },
  { word: "fr",                        meaning: "For real. Used to emphasize that you mean what you said.",     example: "That was the best meal I've had fr." },
  { word: "no shot",                   meaning: "No way, that's impossible or unbelievable.",                  example: "No shot she actually said that." },
  { word: "based",                     meaning: "Being confidently yourself regardless of others' opinions.",  example: "He wore that fit without caring — so based." },
  { word: "cap",                       meaning: "A lie. Saying something false.",                              example: "That's cap, he never said that." },
];

// helper — get fallback for a specific word
function getFallback(word) {
  return FALLBACK.find(f => f.word.toLowerCase() === word.toLowerCase()) || null;
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/search?q=rizz&limit=9
app.get("/api/search", async (req, res) => {
  const q     = (req.query.q || "").trim();
  const limit = Math.min(parseInt(req.query.limit) || 9, 20);
  if (!q) return res.status(400).json({ error: "Query param 'q' is required" });

  try {
    const data    = await hfSearch(q, 0, limit);
    const all     = (data.rows || []).map(r => normalize(r.row)).filter(isGood);
    const results = dedupe(all);

    // if HF returned nothing useful — try fallback
    if (results.length === 0) {
      const fb = FALLBACK.filter(w =>
        w.word.toLowerCase().includes(q.toLowerCase()) ||
        w.meaning.toLowerCase().includes(q.toLowerCase())
      );
      return res.json({ query: q, total: fb.length, results: fb, fallback: true });
    }

    res.json({ query: q, total: data.num_rows_total || results.length, results });
  } catch (err) {
    console.error("[search] HuggingFace failed, using fallback:", err.message);
    const results = FALLBACK.filter(w =>
      w.word.toLowerCase().includes(q.toLowerCase()) ||
      w.meaning.toLowerCase().includes(q.toLowerCase())
    );
    res.json({ query: q, total: results.length, results, fallback: true });
  }
});

// GET /api/word/:word
app.get("/api/word/:word", async (req, res) => {
  const word = req.params.word.trim();
  try {
    const data   = await hfSearch(word, 0, 10);
    const rows   = (data.rows || []).map(r => normalize(r.row)).filter(isGood);
    const exact  = rows.find(r => r.word.toLowerCase() === word.toLowerCase());
    const result = exact || rows[0];
    // if not found or bad data — try fallback
    if (!result) {
      const fb = getFallback(word);
      if (fb) return res.json({ ...fb, fallback: true });
      return res.status(404).json({ error: "Word not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("[word] HuggingFace failed, using fallback:", err.message);
    const result =
      getFallback(word) ||
      FALLBACK.find(w => w.word.toLowerCase().includes(word.toLowerCase()));
    if (!result) return res.status(404).json({ error: "Word not found (offline mode)" });
    res.json({ ...result, fallback: true });
  }
});

// GET /api/random
app.get("/api/random", async (req, res) => {
  try {
    const offset = Math.floor(Math.random() * 1770);
    const data   = await hfRows(offset, 1);
    const row    = data.rows?.[0]?.row;
    if (!row) throw new Error("No row returned");
    const result = normalize(row);
    if (!isGood(result)) throw new Error("Bad data from HuggingFace");
    res.json(result);
  } catch (err) {
    console.error("[random] HuggingFace failed, using fallback:", err.message);
    const word = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    res.json({ ...word, fallback: true });
  }
});

// GET /api/trending
app.get("/api/trending", async (req, res) => {
  const trendWords = [
    "rizz", "slay", "bussin", "no cap", "sus", "delulu",
    "lowkey", "hits different", "it's giving", "understood the assignment",
  ];

  const cached = cacheGet("trending");
  if (cached) return res.json(cached);

  try {
    const results = await Promise.all(
      trendWords.map(async w => {
        try {
          const data = await hfSearch(w, 0, 10);
          const rows = (data.rows || []).map(r => normalize(r.row)).filter(isGood);
          // find exact word match with good data
          const exact = rows.find(r => r.word.toLowerCase() === w.toLowerCase());
          if (exact) return exact;
          // if no exact match or bad data — use fallback
          return getFallback(w) || rows[0] || null;
        } catch {
          return getFallback(w) || null;
        }
      })
    );
    const response = { results: results.filter(Boolean) };
    cacheSet("trending", response);
    res.json(response);
  } catch (err) {
    console.error("[trending] using fallback:", err.message);
    res.json({ results: FALLBACK.slice(0, 10), fallback: true });
  }
});

// GET /api/health
app.get("/api/health", async (_req, res) => {
  let hfStatus = "unknown";
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 4000);
    const r = await fetch(
      `${BASE}/info?dataset=${encodeURIComponent(DATASET)}`,
      { signal: controller.signal }
    );
    hfStatus = r.ok ? "online" : `error_${r.status}`;
  } catch {
    hfStatus = "offline";
  }
  res.json({
    status: "ok",
    huggingface: hfStatus,
    dataset: DATASET,
    cache_entries: cache.size,
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`\n🔥  Slaypedia API  →  http://localhost:${PORT}`);
  console.log(`   GET  /api/search?q=<word>&limit=<n>`);
  console.log(`   GET  /api/word/:word`);
  console.log(`   GET  /api/random`);
  console.log(`   GET  /api/trending`);
  console.log(`   GET  /api/health\n`);
  console.log(`   ✦ Retry: 3 attempts · 8s timeout per request`);
  console.log(`   ✦ Cache: 5 min TTL`);
  console.log(`   ✦ Fallback: 20 built-in words when HuggingFace is down\n`);
});