/* Vectothèque — recherche de vecteurs (Iconify, Wikimedia Commons, Worldvectorlogo) */
"use strict";

/* ---------- Licences ---------- */
function classifyLicense(lic) {
  const s = String(lic || "");
  if (/\bNC\b|non[- ]?commercial/i.test(s)) return "nc";
  if (/\bND\b|no ?deriv/i.test(s)) return "nd";
  if (/CC0|public domain|domaine public|\bPD\b|no restrictions|unlicense/i.test(s)) return "libre";
  if (/\bSA\b|share ?alike|GPL|\bMPL\b|GFDL/i.test(s)) return "sa";
  if (/\bMIT\b|apache|\bISC\b|\bBSD\b|\bOFL\b|open font/i.test(s)) return "oss";
  if (/CC[- ]BY|creative commons|attribution/i.test(s)) return "attrib";
  return "mixte";
}
function licenseBadge(item) {
  const cls = item.licClass === "nd" ? "nc" : item.licClass === "sa" ? "attrib" : item.licClass;
  let title = { libre: "Aucune condition", oss: "Licence open source permissive", attrib: "Attribution requise",
    nc: "Usage commercial interdit ou modification interdite", mixte: "Conditions à vérifier" }[cls] || "";
  if (item.licClass === "sa") title = "Attribution + partage dans les mêmes conditions : une création dérivée doit être publiée sous la même licence";
  const label = esc(item.license || "Licence inconnue");
  if (item.licenseUrl) {
    return '<a class="badge ' + cls + '" href="' + esc(item.licenseUrl) + '" target="_blank" rel="noopener" title="' + esc(title) + '">' + label + "</a>";
  }
  return '<span class="badge ' + cls + '" title="' + esc(title) + '">' + label + "</span>";
}
function passesLicense(item, mode) {
  const c = item.licClass;
  if (mode !== "all" && item.trademark) return false;
  if (mode === "commercial") return c !== "nc" && c !== "nd";
  if (mode === "noattrib") return c === "libre" || c === "oss";
  if (mode === "libre") return c === "libre";
  return true;
}

/* ---------- Sources ---------- */
const PAGE = 48;

const Iconify = {
  id: "iconify", label: "Iconify",
  reset: function () { this.all = []; this.shown = 0; this.done = false; },
  start: async function (term, signal, opts) {
    // L'API publique renvoie au plus 128 icônes par recherche et ne pagine pas au-delà.
    const url = "https://api.iconify.design/search?limit=128&query=" + encodeURIComponent(term);
    const r = await fetch(url, { signal: signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    const cols = d.collections || {};
    const isLogoSet = function (p) {
      const c = cols[p] || {};
      return c.category === "Logos" || /brand|logo/i.test(c.name || "");
    };
    this.capped = (d.icons || []).length >= 128;
    const icons = (d.icons || []).filter(function (full) { return !(opts.noLogos && isLogoSet(full.split(":")[0])); });
    // Alterne les collections pour varier les styles dès les premiers résultats.
    const groups = new Map();
    for (const full of icons) {
      const p = full.split(":")[0];
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(full);
    }
    const lists = Array.from(groups.values());
    const ordered = [];
    for (let i = 0; ordered.length < icons.length; i++) {
      for (const l of lists) if (l[i]) ordered.push(l[i]);
    }
    this.all = ordered.map(function (full) {
      const parts = full.split(":");
      const prefix = parts[0], name = parts[1];
      const col = cols[prefix] || {};
      const lic = col.license || {};
      const license = lic.spdx || lic.title || "";
      return {
        source: "iconify",
        title: name.replace(/-/g, " "),
        meta: (col.name || prefix) + (col.author && col.author.name ? " · " + col.author.name : ""),
        preview: "https://api.iconify.design/" + prefix + "/" + name + ".svg?height=96",
        svgUrl: "https://api.iconify.design/" + prefix + "/" + name + ".svg?height=512&color=%23000000",
        page: "https://icon-sets.iconify.design/" + prefix + "/" + name + "/",
        fileName: prefix + "-" + name + ".svg",
        license: lic.title || license || "Licence inconnue",
        licenseUrl: lic.url || "",
        licClass: classifyLicense(license + " " + (lic.title || "")),
        trademark: isLogoSet(prefix),
        canCopy: true
      };
    });
    return this.next();
  },
  next: async function () {
    const chunk = this.all.slice(this.shown, this.shown + PAGE);
    this.shown += chunk.length;
    this.done = this.shown >= this.all.length;
    return chunk;
  },
  total: function () { return this.all.length; }
};

const Wikimedia = {
  id: "wikimedia", label: "Wikimedia",
  reset: function () { this.offset = 0; this.done = false; this.count = 0; this.term = ""; this.noLogos = true; },
  start: async function (term, signal, opts) {
    this.term = term; this.noLogos = !!opts.noLogos; this.offset = 0; this.count = 0;
    return this.next(signal);
  },
  next: async function (signal) {
    let q = this.term + (this.noLogos ? " -logo -logotype -insignia" : "") + " filemime:image/svg+xml";
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*" +
      "&generator=search&gsrnamespace=6&gsrlimit=30&gsroffset=" + this.offset +
      "&gsrsearch=" + encodeURIComponent(q) +
      "&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=300" +
      "&iiextmetadatafilter=LicenseShortName%7CArtist%7CLicenseUrl%7CUsageTerms%7CRestrictions";
    const r = await fetch(url, { signal: signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    const pages = d.query && d.query.pages ? Object.values(d.query.pages) : [];
    pages.sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
    if (d.continue && d.continue.gsroffset != null) { this.offset = d.continue.gsroffset; this.done = false; }
    else this.done = true;
    const items = [];
    for (const p of pages) {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii) continue;
      const md = ii.extmetadata || {};
      const lic = (md.LicenseShortName && md.LicenseShortName.value) || (md.UsageTerms && md.UsageTerms.value) || "";
      const artist = stripHtml(md.Artist && md.Artist.value);
      const rawTitle = String(p.title || "").replace(/^File:/, "");
      const title = rawTitle.replace(/\.svg$/i, "");
      items.push({
        source: "wikimedia",
        title: title,
        meta: "Wikimedia Commons" + (artist ? " · " + artist : ""),
        preview: ii.thumburl || ii.url,
        svgUrl: ii.url,
        page: ii.descriptionurl,
        fileName: rawTitle,
        license: stripHtml(lic) || "Licence à vérifier",
        licenseUrl: (md.LicenseUrl && md.LicenseUrl.value) || "",
        licClass: classifyLicense(stripHtml(lic)),
        trademark: /trademark/i.test((md.Restrictions && md.Restrictions.value) || "") ||
          /logo|logotype|emblem|insignia|crest|wordmark|trademark/i.test(rawTitle),
        photo: true
      });
    }
    this.count += items.length;
    return items;
  },
  total: function () { return this.count + (this.done ? "" : "+"); }
};

// Logos de marques : cherchés seulement quand on choisit la puce Worldvectorlogo, pour ménager le quota.
const WorldVectorLogo = {
  id: "wvl", label: "Worldvectorlogo", manual: true,
  reset: function () { this.page = 0; this.done = false; this.count = 0; this.total = 0; this.term = ""; },
  start: async function (term, signal) {
    this.term = term; this.page = 0; this.count = 0;
    return this.next(signal);
  },
  // Passe d'abord par le relais du site (clé côté serveur, réponses en cache).
  // Sans relais (fichier ouvert en local) ou s'il est indisponible : accès direct, 10 recherches par jour.
  fetchPage: async function (page, signal) {
    const qs = "page=" + page + "&q=" + encodeURIComponent(this.term);
    if (/^https?:$/.test(location.protocol)) {
      try {
        const r = await fetch("/api/logos?" + qs, { signal: signal });
        if (r.ok || r.status === 429) return r;
      } catch (e) {
        if (e.name === "AbortError") throw e;
      }
    }
    return fetch("https://worldvectorlogo.com/api/v1/logos/search?per_page=48&" + qs, { signal: signal });
  },
  next: async function (signal) {
    const r = await this.fetchPage(this.page + 1, signal);
    if (r.status === 429) throw new Error("quota");
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    const meta = d.meta || {};
    this.page = meta.current_page || this.page + 1;
    this.total = meta.total || 0;
    this.done = !meta.last_page || this.page >= meta.last_page;
    const items = (d.data || []).map(function (l) {
      return {
        source: "wvl",
        title: l.name || l.slug,
        meta: "Worldvectorlogo" + (l.tags && l.tags.length ? " · " + l.tags.slice(0, 3).join(", ") : ""),
        preview: l.svg_url,
        svgUrl: l.svg_url,
        page: (l.links && l.links.web) || ("https://worldvectorlogo.com/logo/" + l.slug),
        fileName: (l.slug || "logo") + ".svg",
        license: "Usage personnel (conditions du site)",
        licenseUrl: "https://worldvectorlogo.com/terms-of-use",
        licClass: "nc",
        trademark: true,
        canCopy: true
      };
    });
    this.count += items.length;
    return items;
  }
};
const SOURCES = [Iconify, Wikimedia, WorldVectorLogo];

/* ---------- État et rendu ---------- */
const state = { items: [], order: [], filter: "all", lic: "all", controller: null, statuses: {} };

// Alterne les sources (une icône, un fichier Wikimedia…) pour un lot d'indices de state.items.
function interleave(indices) {
  const lists = SOURCES.map(function (s) { return indices.filter(function (i) { return state.items[i].source === s.id; }); });
  const out = [];
  const longest = Math.max.apply(null, lists.map(function (l) { return l.length; }));
  for (let k = 0; k < longest; k++) for (const l of lists) if (k < l.length) out.push(l[k]);
  return out;
}
function addItems(items) {
  const start = state.items.length;
  state.items = state.items.concat(items);
  return items.map(function (_, j) { return start + j; });
}

function renderChips() {
  const counts = { all: 0 };
  for (const s of SOURCES) counts[s.id] = 0;
  for (const it of state.items) if (!it.stale && passesLicense(it, state.lic)) { counts[it.source]++; counts.all++; }
  const defs = [{ id: "all", label: "Toutes" }].concat(SOURCES.map(function (s) {
    return { id: s.id, label: s.id === "wvl" ? "Logos · Worldvectorlogo" : s.label };
  }));
  // Les puces sont reconstruites : on garde le focus clavier sur celle qui l'avait.
  const active = document.activeElement;
  const focused = active && active.closest && active.closest("#sourceChips .chip") ? active.dataset.src : null;
  $("sourceChips").innerHTML = defs.map(function (d) {
    const st = state.statuses[d.id];
    let n = counts[d.id];
    if (d.id !== "all" && st === "loading") n = "…";
    else if (d.id !== "all" && (st === "error" || st === "quota")) n = "indisponible";
    else if (d.id === "wvl" && !st) n = "";
    else if (d.id === "wikimedia" && !Wikimedia.done && n) n = n + "+";
    else if (d.id === "wvl" && !WorldVectorLogo.done && n) n = n + " / " + WorldVectorLogo.total;
    else if (d.id === "iconify" && !Iconify.done && n) n = n + " / " + Iconify.total();
    return '<button type="button" class="chip" data-src="' + d.id + '" aria-pressed="' + (state.filter === d.id) + '">' +
      esc(d.label) + '<span class="n">' + esc(n) + "</span></button>";
  }).join("");
  if (focused) {
    const again = document.querySelector('#sourceChips .chip[data-src="' + focused + '"]');
    if (again) again.focus();
  }
}

function cardHtml(it, idx) {
  const badges = [licenseBadge(it)];
  if (it.trademark) badges.push(it.source === "wvl"
    ? '<span class="badge tm" title="Logo de marque : accord de la marque nécessaire">Marque déposée</span>'
    : '<span class="badge tm" title="Probablement un logo ou un emblème protégé">Marque ?</span>');
  return '<article class="card">' +
    '<div class="artboard' + (it.photo ? " photo" : "") + '"><img loading="lazy" decoding="async" alt="' + esc(it.title) + '" src="' + esc(it.preview) + '"></div>' +
    '<div class="card-body">' +
      '<div class="card-title" title="' + esc(it.title) + '">' + esc(it.title) + "</div>" +
      '<div class="card-meta" title="' + esc(it.meta) + '">' + esc(it.meta) + "</div>" +
      '<div class="badges">' + badges.join("") + "</div>" +
    "</div>" +
    '<div class="card-actions">' +
      '<button type="button" class="act primary" data-act="dl" data-i="' + idx + '">Télécharger le SVG</button>' +
      (it.canCopy ? '<button type="button" class="act" data-act="copy" data-i="' + idx + '">Copier</button>' : "") +
      '<a class="act' + (it.canCopy ? "" : " wide") + '" href="' + esc(it.page) + '" target="_blank" rel="noopener">Source ↗</a>' +
    "</div></article>";
}
function skeletonHtml(n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += '<div class="card skeleton" aria-hidden="true"><div class="artboard"></div>' +
      '<div class="card-body"><div class="bar"></div><div class="bar short"></div></div><div style="height:44px"></div></div>';
  }
  return out;
}

function renderGrid() {
  const visible = [];
  for (const i of state.order) {
    const it = state.items[i];
    if ((state.filter === "all" || it.source === state.filter) && passesLicense(it, state.lic)) visible.push(cardHtml(it, i));
  }
  const loading = Object.values(state.statuses).some(function (s) { return s === "loading"; });
  $("grid").innerHTML = visible.length ? visible.join("") :
    (loading ? skeletonHtml(10) : '<div class="empty">Aucun résultat avec ces filtres. Essayez un autre terme anglais ou les sites plus bas.</div>');
  const relevant = state.filter === "all" ? SOURCES : SOURCES.filter(function (s) { return s.id === state.filter; });
  const more = relevant.some(function (s) { return !s.done && state.statuses[s.id] === "ok"; });
  $("moreRow").hidden = !more;
  renderChips();
}

function setStatus(html) { $("status").innerHTML = html; }

function updateStatusLine() {
  const parts = SOURCES.map(function (s) {
    const st = state.statuses[s.id];
    if (st === "loading") return esc(s.label) + " : recherche…";
    if (st === "quota") return '<span class="err">Worldvectorlogo : quota de recherches atteint pour aujourd’hui. Réessayez demain, ou passez par le lien Worldvectorlogo plus bas.</span>';
    if (st === "error") return '<span class="err">' + esc(s.label) + " : indisponible pour le moment</span>";
    if (st === "ok" && s.id === "wvl") return "Worldvectorlogo : " + WorldVectorLogo.total + " logo(s) de marque";
    if (st === "ok" && s.id === "iconify") return "Iconify : " + Iconify.total() + " résultat(s)" +
      (Iconify.capped ? " (maximum par recherche, précisez le terme pour en voir d’autres)" : "");
    if (st === "ok") return esc(s.label) + " : " + esc(Wikimedia.total()) + " résultat(s)";
    return "";
  }).filter(Boolean);
  setStatus(parts.join(" · "));
}

async function runSearch(term) {
  term = term.trim();
  if (!term) return;
  if (state.controller) state.controller.abort();
  const controller = new AbortController();
  state.controller = controller;
  state.items = [];
  state.order = [];
  state.statuses = {};
  renderElsewhere(term);
  const opts = { noLogos: $("noLogos").checked };
  WorldVectorLogo.reset();
  // Si l'on regardait les logos, on les cherche aussi pour le nouveau terme.
  if (state.filter === "wvl") searchLogos();
  await Promise.all(SOURCES.filter(function (s) { return !s.manual; }).map(async function (src) {
    src.reset();
    state.statuses[src.id] = "loading";
    updateStatusLine(); renderGrid();
    try {
      const items = await src.start(term, controller.signal, opts);
      if (controller.signal.aborted) return;
      state.statuses[src.id] = "ok";
      addItems(items);
      // Premier lot : rien n'a encore été parcouru, on peut réordonner tout ce qui est arrivé.
      state.order = interleave(state.items.map(function (_, i) { return i; }).filter(function (i) { return !state.items[i].stale; }));
    } catch (e) {
      if (e.name === "AbortError" || controller.signal.aborted) return;
      console.warn(src.id, e);
      state.statuses[src.id] = "error";
    }
    if (controller.signal.aborted) return;
    updateStatusLine(); renderGrid();
  }));
}

async function loadMore() {
  const btn = $("moreBtn");
  btn.disabled = true; btn.textContent = "Chargement…";
  const controller = state.controller;
  const signal = controller ? controller.signal : undefined;
  const relevant = state.filter === "all" ? SOURCES : SOURCES.filter(function (s) { return s.id === state.filter; });
  const batches = await Promise.all(relevant.map(async function (src) {
    if (src.done || state.statuses[src.id] !== "ok") return [];
    try {
      return await src.next(signal);
    } catch (e) {
      if (e.name !== "AbortError") console.warn(src.id, e);
      return [];
    }
  }));
  btn.disabled = false; btn.textContent = "Plus de résultats";
  if (controller !== state.controller || (signal && signal.aborted)) return;
  // Les nouveaux résultats s'ajoutent en bas, sans déplacer ceux déjà affichés.
  const added = addItems([].concat.apply([], batches));
  state.order = state.order.concat(interleave(added));
  updateStatusLine(); renderGrid();
}

// Les noms de marques ne se traduisent pas : on cherche le texte tel qu'il a été tapé.
async function searchLogos() {
  const term = $("q").value.trim() || $("term").value.trim();
  // Une seule requête à la fois : chaque requête compte dans le quota.
  if (!term || state.statuses.wvl === "loading") return;
  const controller = state.controller || new AbortController();
  state.controller = controller;
  // Retire les logos d'une recherche précédente avant d'ajouter les nouveaux.
  state.items.forEach(function (it) { if (it.source === "wvl") it.stale = true; });
  state.order = state.order.filter(function (i) { return state.items[i].source !== "wvl"; });
  WorldVectorLogo.reset();
  state.statuses.wvl = "loading";
  updateStatusLine(); renderGrid();
  try {
    const items = await WorldVectorLogo.start(term, controller.signal);
    if (controller !== state.controller || controller.signal.aborted) return;
    state.statuses.wvl = "ok";
    // Les logos passent en tête : c'est ce qu'on vient de demander.
    state.order = addItems(items).concat(state.order);
  } catch (e) {
    if (e.name === "AbortError" || controller.signal.aborted) return;
    state.statuses.wvl = e.message === "quota" ? "quota" : "error";
  } finally {
    if (state.statuses.wvl === "loading") delete state.statuses.wvl;
  }
  updateStatusLine(); renderGrid();
}
function updateLogoButton() {
  renderElsewhere($("term").value.trim() || "lightning");
}

async function searchFromFrench() {
  const fr = $("q").value.trim();
  if (!fr) return;
  updateLogoButton();
  if (state.controller) state.controller.abort();
  const controller = new AbortController();
  state.controller = controller;
  $("termNote").textContent = "traduction…";
  try {
    const t = await translate(fr, controller.signal);
    if (controller.signal.aborted) return;
    $("term").value = t.term;
    $("termNote").textContent = "(" + t.how + ")";
    // L'adresse reflète la recherche, pour pouvoir la partager.
    try {
      const u = new URL(location.href);
      u.searchParams.set("q", fr);
      history.replaceState(null, "", u);
    } catch (e) { /* fichier local : sans importance */ }
    runSearch(t.term);
  } catch (e) {
    if (e.name !== "AbortError") $("termNote").textContent = "";
  }
}

/* ---------- Téléchargement et copie ---------- */
async function fetchSvgText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}
async function downloadItem(it, btn) {
  btn.disabled = true; btn.dataset.label = btn.dataset.label || btn.textContent; btn.textContent = "Téléchargement…";
  try {
    // On garde les octets d'origine : certains SVG anciens ne sont pas encodés en UTF-8.
    const r = await fetch(it.svgUrl);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const blob = new Blob([await r.arrayBuffer()], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    let name = safeFileName(it.fileName);
    if (!/\.svg$/i.test(name)) name += ".svg";
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(href); a.remove(); }, 4000);
    flash(btn, "Enregistré");
  } catch (e) {
    console.warn(e);
    window.open(it.svgUrl, "_blank", "noopener");
    flash(btn, "Ouvert dans un onglet");
  }
}
async function copyItem(it, btn) {
  btn.disabled = true;
  const textPromise = fetchSvgText(it.svgUrl);
  try {
    // L'écriture démarre pendant le clic (le navigateur l'exige), le contenu arrive ensuite.
    let written = false;
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([new ClipboardItem({
          "text/plain": textPromise.then(function (t) { return new Blob([t], { type: "text/plain" }); })
        })]);
        written = true;
      } catch (e) { /* repli ci-dessous */ }
    }
    const text = await textPromise;
    if (written) { flash(btn, "Copié"); return; }
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (!ok) throw new Error("copie refusée");
    }
    flash(btn, "Copié");
  } catch (e) {
    console.warn(e);
    flash(btn, "Échec");
  }
}

/* ---------- Chercher aussi sur… ---------- */
const ELSEWHERE = [
  { name: "SVG Repo", url: function (t) { return "https://www.svgrepo.com/vectors/" + encodeURIComponent(slug(t)) + "/"; } },
  { name: "Freepik (Magnific)", url: function (t) { return "https://www.freepik.com/search?format=search&type=vector&query=" + encodeURIComponent(t); } },
  { name: "Vecteezy", url: function (t) { return "https://www.vecteezy.com/free-vector/" + encodeURIComponent(slug(t)); } },
  { name: "Flaticon", url: function (t) { return "https://www.flaticon.com/search?word=" + encodeURIComponent(t); } },
  { name: "Noun Project", url: function (t) { return "https://thenounproject.com/search/icons/?q=" + encodeURIComponent(t); } },
  { name: "Pixabay", url: function (t) { return "https://pixabay.com/vectors/search/" + encodeURIComponent(t) + "/"; } },
  { name: "Openclipart", url: function (t) { return "https://openclipart.org/search/?query=" + encodeURIComponent(t); } },
  { name: "Public Domain Vectors", url: function (t) { return "https://publicdomainvectors.org/en/search/" + encodeURIComponent(t); } },
  { name: "Font Awesome", url: function (t) { return "https://fontawesome.com/search?ic=free&o=r&q=" + encodeURIComponent(t); } },
  { name: "Material Symbols", url: function (t) { return "https://fonts.google.com/icons?icon.query=" + encodeURIComponent(t); } },
  { name: "Lucide", url: function (t) { return "https://lucide.dev/icons/?search=" + encodeURIComponent(t); } },
  { name: "Phosphor", url: function (t) { return "https://phosphoricons.com/?q=" + encodeURIComponent(t); } },
  { name: "Openverse", url: function (t) { return "https://openverse.org/search/image?q=" + encodeURIComponent(t); } },
  { name: "Worldvectorlogo", original: true, url: function (t) { return "https://worldvectorlogo.com/search?q=" + encodeURIComponent(t); } },
  { name: "Wikimedia Commons", url: function (t) { return "https://commons.wikimedia.org/w/index.php?ns6=1&search=" + encodeURIComponent(t + " filemime:image/svg+xml"); } }
];
function renderElsewhere(term) {
  $("elsewhereQ").textContent = "Liens préremplis avec « " + term + " », vers d’autres banques et vers les sites complets des sources intégrées.";
  const original = $("q").value.trim() || term;
  $("elsewhere").innerHTML = ELSEWHERE.map(function (s) {
    return '<a href="' + esc(s.url(s.original ? original : term)) + '" target="_blank" rel="noopener">' + esc(s.name) + ICONS.external + "</a>";
  }).join("");
}

/* ---------- Événements ---------- */
$("searchForm").addEventListener("submit", function (e) { e.preventDefault(); searchFromFrench(); });
$("suggest").addEventListener("click", function (e) {
  const b = e.target.closest("button");
  if (!b) return;
  $("q").value = b.textContent;
  updateLogoButton();
  searchFromFrench();
});
$("termBtn").addEventListener("click", function () { $("termNote").textContent = "(terme saisi à la main)"; runSearch($("term").value); });
$("term").addEventListener("keydown", function (e) {
  if (e.key === "Enter") { e.preventDefault(); $("termNote").textContent = "(terme saisi à la main)"; runSearch($("term").value); }
});
$("sourceChips").addEventListener("click", function (e) {
  const b = e.target.closest(".chip");
  if (!b) return;
  state.filter = b.dataset.src;
  renderGrid();
  // Les logos ne sont cherchés qu'au moment où l'on choisit leur puce.
  const st = state.statuses.wvl;
  if (state.filter === "wvl" && st !== "ok" && st !== "loading") searchLogos();
});
$("licFilter").addEventListener("change", function () { state.lic = this.value; renderGrid(); });
$("noLogos").addEventListener("change", function () { if ($("term").value.trim()) runSearch($("term").value); });
$("moreBtn").addEventListener("click", loadMore);
$("q").addEventListener("input", updateLogoButton);
$("grid").addEventListener("click", function (e) {
  const b = e.target.closest("button.act");
  if (!b) return;
  const it = state.items[Number(b.dataset.i)];
  if (!it) return;
  if (b.dataset.act === "dl") downloadItem(it, b);
  else if (b.dataset.act === "copy") copyItem(it, b);
});

// Un lien partagé du type ?q=flamme lance directement cette recherche.
(function () {
  let q = "";
  try { q = new URLSearchParams(location.search).get("q") || ""; } catch (e) {}
  if (q) $("q").value = q;
})();
updateLogoButton();
searchFromFrench();
