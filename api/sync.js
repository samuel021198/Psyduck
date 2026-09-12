// ponytail: last-write-wins on one gist JSON; login/accounts if more than one collector shares a code
const GIST = process.env.GIST_ID;
const TOKEN = process.env.GITHUB_TOKEN;
const CODE = /^[a-z0-9]{8}$/;

function bad(res, status, msg) {
  res.status(status).json({ error: msg });
}

function cleanList(v) {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.map(String).filter((id) => id.length > 0 && id.length < 40))].slice(0, 400);
}

async function loadStore() {
  const r = await fetch(`https://api.github.com/gists/${GIST}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error("gist read failed");
  const gist = await r.json();
  const raw = gist.files?.["store.json"]?.content || "{}";
  return JSON.parse(raw);
}

async function saveStore(store) {
  const r = await fetch(`https://api.github.com/gists/${GIST}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: { "store.json": { content: JSON.stringify(store) } } }),
  });
  if (!r.ok) throw new Error("gist write failed");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!GIST || !TOKEN) return bad(res, 500, "sync not configured");

  const code = String(req.query.code || "").toLowerCase();
  if (!CODE.test(code)) return bad(res, 400, "bad code");

  try {
    const store = await loadStore();
    if (req.method === "GET") {
      const row = store[code] || { psyduck: [], ditto: [] };
      return res.json({ psyduck: cleanList(row.psyduck), ditto: cleanList(row.ditto) });
    }
    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      store[code] = { psyduck: cleanList(body.psyduck), ditto: cleanList(body.ditto) };
      await saveStore(store);
      return res.json({ ok: true });
    }
    return bad(res, 405, "method");
  } catch (e) {
    return bad(res, 502, "sync failed");
  }
}
