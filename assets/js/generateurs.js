/* Vectothèque — page des générateurs SVG (données dans generateurs-data.js) */
"use strict";

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "fonds", label: "Fonds" },
  { id: "vagues", label: "Vagues" },
  { id: "motifs", label: "Motifs" },
  { id: "formes", label: "Formes" },
  { id: "textures", label: "Textures" },
  { id: "degrades", label: "Dégradés" },
  { id: "dessin", label: "Dessin" },
  { id: "effets", label: "Effets" },
  { id: "autre", label: "Autres" }
];
const CAT_LABEL = {};
CATEGORIES.forEach(function (c) { CAT_LABEL[c.id] = c.label; });

const gstate = { cat: "all", q: "", wrap: false };

/* ---------- Illustrations des cartes ---------- */
// Chaque carte reçoit un petit dessin vectoriel propre à sa catégorie, varié selon le nom.
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return function () {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const PALETTES = [
  ["#e2eff2", "#9fcfdb", "#4f9fb3", "#0e6e86", "#0a4757"],
  ["#f3efe6", "#d9e8e4", "#7fb7ae", "#2f7f78", "#17393a"],
  ["#eef1f4", "#c5d3dd", "#7f9cb1", "#3e5f78", "#1c2c3a"],
  ["#f6eee8", "#e9cfc0", "#c98f73", "#0e6e86", "#20282b"]
];
function f1(n) { return Math.round(n * 10) / 10; }

function artFor(g) {
  const r = seeded(g.name + g.site);
  const p = PALETTES[Math.floor(r() * PALETTES.length)];
  const W = 320, H = 180;
  let body = "";
  const cat = g.category;
  if (cat === "vagues") {
    for (let k = 0; k < 4; k++) {
      const base = 70 + k * 30, amp = 10 + r() * 18, ph = r() * 6;
      let d = "M0 " + H + " L0 " + base;
      for (let x = 0; x <= W; x += 20) d += " L" + x + " " + f1(base + Math.sin(x / 45 + ph) * amp);
      d += " L" + W + " " + H + "Z";
      body += '<path d="' + d + '" fill="' + p[k + 1] + '"/>';
    }
  } else if (cat === "formes") {
    for (let k = 0; k < 3; k++) {
      const cx = 70 + r() * 180, cy = 50 + r() * 80, rad = 34 + r() * 40, n = 7;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, rr = rad * (0.7 + r() * 0.5);
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      let d = "";
      for (let i = 0; i < n; i++) {
        const a = pts[i], b = pts[(i + 1) % n];
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        d += (i === 0 ? "M" + f1(m[0]) + " " + f1(m[1]) : "") + " Q" + f1(b[0]) + " " + f1(b[1]) + " " +
          f1((b[0] + pts[(i + 2) % n][0]) / 2) + " " + f1((b[1] + pts[(i + 2) % n][1]) / 2);
      }
      body += '<path d="' + d + 'Z" fill="' + p[k + 2] + '" opacity="' + (k === 0 ? 1 : 0.85) + '"/>';
    }
  } else if (cat === "motifs") {
    const s = 22 + Math.floor(r() * 10), kind = Math.floor(r() * 3);
    for (let y = 0; y < H + s; y += s) for (let x = 0; x < W + s; x += s) {
      const off = (Math.floor(y / s) % 2) * s / 2;
      if (kind === 0) body += '<circle cx="' + (x + off) + '" cy="' + y + '" r="' + f1(s / 5) + '" fill="' + p[3] + '"/>';
      else if (kind === 1) body += '<path d="M' + x + " " + (y + s) + " L" + (x + s / 2) + " " + y + " L" + (x + s) + " " + (y + s) + '" fill="none" stroke="' + p[3] + '" stroke-width="3"/>';
      else body += '<rect x="' + (x + off) + '" y="' + y + '" width="' + f1(s / 2.2) + '" height="' + f1(s / 2.2) + '" rx="2" fill="' + p[(x / s + y / s) % 2 ? 2 : 3] + '" transform="rotate(45 ' + (x + off) + " " + y + ')"/>';
    }
  } else if (cat === "textures") {
    for (let i = 0; i < 520; i++) {
      body += '<circle cx="' + f1(r() * W) + '" cy="' + f1(r() * H) + '" r="' + f1(0.6 + r() * 1.8) + '" fill="' + p[2 + Math.floor(r() * 3)] + '" opacity="' + f1(0.3 + r() * 0.7) + '"/>';
    }
  } else if (cat === "fonds") {
    const cols = 7, rows = 4, pts = [];
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
      const jx = i > 0 && i < cols ? (r() - 0.5) * 30 : 0, jy = j > 0 && j < rows ? (r() - 0.5) * 30 : 0;
      pts.push([i * W / cols + jx, j * H / rows + jy]);
    }
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = pts[j * (cols + 1) + i], b = pts[j * (cols + 1) + i + 1], c = pts[(j + 1) * (cols + 1) + i], d = pts[(j + 1) * (cols + 1) + i + 1];
      const t = (i + j) / (cols + rows);
      const c1 = p[1 + Math.min(3, Math.floor(t * 4 + r() * 0.8))], c2 = p[1 + Math.min(3, Math.floor(t * 4 + r() * 0.8))];
      body += '<path d="M' + f1(a[0]) + " " + f1(a[1]) + "L" + f1(b[0]) + " " + f1(b[1]) + "L" + f1(d[0]) + " " + f1(d[1]) + 'Z" fill="' + c1 + '"/>';
      body += '<path d="M' + f1(a[0]) + " " + f1(a[1]) + "L" + f1(d[0]) + " " + f1(d[1]) + "L" + f1(c[0]) + " " + f1(c[1]) + 'Z" fill="' + c2 + '"/>';
    }
  } else if (cat === "degrades") {
    const id = "b" + Math.floor(r() * 1e9);
    body += '<defs><filter id="' + id + '" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter></defs>';
    body += '<rect width="' + W + '" height="' + H + '" fill="' + p[1] + '"/><g filter="url(#' + id + ')">';
    for (let k = 0; k < 4; k++) body += '<circle cx="' + f1(r() * W) + '" cy="' + f1(r() * H) + '" r="' + f1(50 + r() * 50) + '" fill="' + p[2 + (k % 3)] + '"/>';
    body += "</g>";
  } else if (cat === "dessin") {
    for (let k = 0; k < 5; k++) {
      let x = r() * 60, y = 30 + r() * 120, d = "M" + f1(x) + " " + f1(y);
      while (x < W) { const nx = x + 30 + r() * 30; d += " Q" + f1(x + 15) + " " + f1(y + (r() - 0.5) * 90) + " " + f1(nx) + " " + f1(y += (r() - 0.5) * 30); x = nx; }
      body += '<path d="' + d + '" fill="none" stroke="' + p[2 + (k % 3)] + '" stroke-width="' + f1(2 + r() * 4) + '" stroke-linecap="round"/>';
    }
  } else if (cat === "effets") {
    const cx = W / 2 + (r() - 0.5) * 60, cy = H / 2;
    for (let k = 12; k > 0; k--) body += '<circle cx="' + f1(cx) + '" cy="' + cy + '" r="' + k * 15 + '" fill="' + p[k % 2 ? 2 : 3] + '" opacity="' + f1(0.25 + k / 20) + '"/>';
  } else {
    for (let k = 0; k < 9; k++) body += '<rect x="' + (k * 40 - 40) + '" y="-40" width="22" height="300" fill="' + p[1 + (k % 4)] + '" transform="rotate(' + f1(18 + r() * 6) + ' 160 90)"/>';
  }
  return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<rect width="' + W + '" height="' + H + '" fill="' + p[0] + '"/>' + body + "</svg>";
}

/* ---------- Rendu ---------- */
function licenceClass(l) {
  const s = norm(l || "");
  if (/inconnue|a verifier/.test(s)) return "plain";
  if (/attribution|cc by/.test(s)) return "attrib";
  if (/payant|premium|limite/.test(s)) return "mixte";
  return "oss";
}
function matches(g) {
  if (gstate.cat !== "all" && g.category !== gstate.cat) return false;
  if (gstate.wrap && !g.wrapPick) return false;
  if (gstate.q) {
    const hay = norm(g.name + " " + g.site + " " + g.desc + " " + (g.wrap || "") + " " + (CAT_LABEL[g.category] || ""));
    if (hay.indexOf(norm(gstate.q)) === -1) return false;
  }
  return true;
}
function genCard(g, i) {
  const badges = [];
  const licTitle = "Fichiers générés : " + (g.licenceFull || g.licence);
  badges.push(g.licenceUrl
    ? '<a class="badge ' + licenceClass(g.licence) + '" href="' + esc(g.licenceUrl) + '" target="_blank" rel="noopener" title="' + esc(licTitle) + '">' + esc(g.licence) + "</a>"
    : '<span class="badge ' + licenceClass(g.licence) + '" title="' + esc(licTitle) + '">' + esc(g.licence) + "</span>");
  badges.push('<span class="badge plain">' + esc(g.svg ? "Export SVG" : "Sans export SVG") + (g.formats ? " · " + esc(g.formats) : "") + "</span>");
  if (g.account) badges.push('<span class="badge mixte">Compte requis</span>');
  if (g.paid) badges.push('<span class="badge mixte">Options payantes</span>');
  return '<article class="gen">' +
    '<div class="gen-art">' + artFor(g) + (g.quality >= 5 ? '<span class="star">Coup de cœur</span>' : "") + "</div>" +
    '<div class="gen-body">' +
      '<h2 class="gen-name">' + esc(g.name) + '<span class="gen-site">' + esc(g.site) + " · " + esc(CAT_LABEL[g.category] || "") + "</span></h2>" +
      '<div class="gen-desc">' + esc(g.desc) + "</div>" +
      (g.wrap ? '<div class="gen-wrap">Covering : ' + esc(g.wrap) + "</div>" : "") +
      '<div class="badges">' + badges.join("") + "</div>" +
    "</div>" +
    '<div class="gen-actions">' +
      (g.embed ? '<button type="button" class="act primary" data-open="' + i + '">Ouvrir ici</button>' : "") +
      '<a class="act' + (g.embed ? "" : " primary") + '" href="' + esc(g.url) + '" target="_blank" rel="noopener">Sur le site ↗</a>' +
    "</div></article>";
}
function renderGenerators() {
  const list = [];
  GENERATORS.forEach(function (g, i) { if (matches(g)) list.push(genCard(g, i)); });
  $("genGrid").innerHTML = list.length ? list.join("") : '<div class="empty">Aucun générateur ne correspond à ces filtres.</div>';
  $("genCount").textContent = list.length + " générateur" + (list.length > 1 ? "s" : "");
  const counts = { all: 0 };
  GENERATORS.forEach(function (g) {
    if (gstate.wrap && !g.wrapPick) return;
    counts.all++; counts[g.category] = (counts[g.category] || 0) + 1;
  });
  const active = document.activeElement;
  const focused = active && active.closest && active.closest("#genChips .chip") ? active.dataset.cat : null;
  $("genChips").innerHTML = CATEGORIES.filter(function (c) { return c.id === "all" || counts[c.id]; }).map(function (c) {
    return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (gstate.cat === c.id) + '">' +
      esc(c.label) + '<span class="n">' + (counts[c.id] || 0) + "</span></button>";
  }).join("");
  if (focused) {
    const again = document.querySelector('#genChips .chip[data-cat="' + focused + '"]');
    if (again) again.focus();
  }
}

/* ---------- Atelier : le générateur s'ouvre dans la page ---------- */
function openWorkspace(g) {
  const dlg = $("workspace");
  $("wsTitle").innerHTML = esc(g.name) + "<span>" + esc(g.site) + "</span>";
  $("wsExternal").href = g.url;
  $("wsFrame").src = g.url;
  if (typeof dlg.showModal === "function") dlg.showModal();
  else window.open(g.url, "_blank", "noopener");
}
function closeWorkspace() {
  const dlg = $("workspace");
  if (dlg.open) dlg.close();
}
$("workspace").addEventListener("close", function () { $("wsFrame").src = "about:blank"; });
$("wsClose").addEventListener("click", closeWorkspace);

/* ---------- Événements ---------- */
$("genChips").addEventListener("click", function (e) {
  const b = e.target.closest(".chip");
  if (!b) return;
  gstate.cat = b.dataset.cat;
  renderGenerators();
});
$("genFilter").addEventListener("input", function () { gstate.q = this.value.trim(); renderGenerators(); });
$("wrapOnly").addEventListener("change", function () { gstate.wrap = this.checked; if (gstate.wrap) gstate.cat = "all"; renderGenerators(); });
$("genGrid").addEventListener("click", function (e) {
  const b = e.target.closest("[data-open]");
  if (!b) return;
  openWorkspace(GENERATORS[Number(b.dataset.open)]);
});

// « Utiles pour le covering » : bonne qualité, et la note ne déconseille pas l'usage.
GENERATORS.forEach(function (g) {
  g.wrapPick = g.quality >= 4 && !/limité|peu adapté|inutilisable|ponctuel/i.test(g.wrap || "");
});
GENERATORS.sort(function (a, b) { return (b.quality - a.quality) || a.name.localeCompare(b.name, "fr"); });
renderGenerators();
