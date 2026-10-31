// Relais vers l'API Worldvectorlogo : la clé reste côté serveur (variable WVL_API_KEY sur Vercel).
// Les réponses sont mises en cache un jour par Vercel, pour économiser le quota mensuel.
module.exports = async function handler(req, res) {
  const key = process.env.WVL_API_KEY;
  if (!key) {
    res.status(503).json({ error: "cle_absente" });
    return;
  }
  const q = String((req.query && req.query.q) || "").trim().slice(0, 80);
  const page = Math.min(50, Math.max(1, parseInt((req.query && req.query.page) || "1", 10) || 1));
  if (!q) {
    res.status(400).json({ error: "requete_vide" });
    return;
  }
  const url = "https://worldvectorlogo.com/api/v1/logos/search?per_page=48&page=" + page + "&q=" + encodeURIComponent(q);
  try {
    const r = await fetch(url, { headers: { Authorization: "Bearer " + key, Accept: "application/json" } });
    const body = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (r.ok) res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    else res.setHeader("Cache-Control", "no-store");
    // 401 (clé refusée) devient 503 : le navigateur bascule alors sur l'accès sans clé.
    res.status(r.status === 401 ? 503 : r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: "injoignable" });
  }
};
