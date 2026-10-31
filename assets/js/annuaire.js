/* Vectothèque — annuaire des banques de vecteurs gratuites */
"use strict";

const BADGE = {
  libre: ["libre", "Libre CC0"],
  libreLic: ["libre", "Libre"],
  oss: ["oss", "MIT / Apache"],
  attrib: ["attrib", "Attribution requise"],
  mixte: ["mixte", "Mixte"],
  marque: ["tm", "Marque déposée"]
};
const DIRECTORY = [
  {
    title: "Domaine public et CC0",
    intro: "Les sites marqués « Libre CC0 » s’utilisent librement, y compris en commercial, sans citer l’auteur. Les autres ont leur propre licence : lisez le badge. Méfiez-vous partout des logos et personnages de marques.",
    sites: [
      { name: "Openclipart", url: "https://openclipart.org", badge: "libre", desc: "Plus de 150 000 cliparts en SVG, tous versés au domaine public (CC0)." },
      { name: "Public Domain Vectors", url: "https://publicdomainvectors.org", badge: "libre", desc: "Vecteurs du domaine public en SVG, EPS et AI. Quelques liens sponsorisés vers des banques payantes." },
      { name: "FreeSVG", url: "https://freesvg.org", badge: "libre", desc: "Grande base de fichiers SVG en CC0, souvent repris d’Openclipart." },
      { name: "rawpixel · Domaine public", url: "https://www.rawpixel.com/category/53/public-domain", badge: "libre", desc: "Illustrations anciennes numérisées en CC0 (gravures, botanique, motifs). Compte gratuit nécessaire." },
      { name: "Pixabay · Vecteurs", url: "https://pixabay.com/vectors/", badge: "libreLic", desc: "Licence Pixabay (pas CC0) : usage commercial sans attribution, mais interdit de revendre un visuel non retravaillé, en fichier ou imprimé (sticker tel quel)." }
    ]
  },
  {
    title: "Grandes banques avec conditions",
    intro: "Énormes catalogues, mais la version gratuite impose souvent de citer l’auteur, et certains fichiers sont payants.",
    sites: [
      { name: "Freepik (Magnific)", url: "https://www.freepik.com/vectors", badge: "attrib", desc: "Le plus gros catalogue de vecteurs (Freepik redirige désormais vers Magnific). En gratuit : attribution, téléchargements limités, et interdit sur un produit imprimé à revendre (sticker, textile) ou dans un logo. Licence « merch » réservée à l’abonnement Pro." },
      { name: "Vecteezy", url: "https://www.vecteezy.com", badge: "attrib", desc: "Vecteurs gratuits avec attribution (licence « Free »), mélangés à des fichiers Pro payants." },
      { name: "Flaticon", url: "https://www.flaticon.com", badge: "attrib", desc: "Millions d’icônes en SVG (groupe Freepik). Attribution obligatoire en gratuit, SVG parfois réservé au premium ; mêmes limites que Freepik pour les produits imprimés à revendre." },
      { name: "Wikimedia Commons · SVG", url: "https://commons.wikimedia.org/wiki/Category:SVG_files", badge: "mixte", desc: "Des millions de SVG sous licences libres variées : domaine public, CC0, mais aussi beaucoup de CC BY et CC BY-SA (attribution obligatoire). Licence indiquée sur chaque fichier." },
      { name: "Noun Project", url: "https://thenounproject.com", badge: "attrib", desc: "Pictogrammes très soignés, CC BY avec attribution, ou abonnement pour s’en passer." },
      { name: "Icons8", url: "https://icons8.com", badge: "attrib", desc: "Icônes et illustrations. Gratuit avec lien vers Icons8, SVG souvent payant." },
      { name: "Openverse", url: "https://openverse.org", badge: "mixte", desc: "Moteur de recherche de WordPress sur des centaines de millions d’images sous licences Creative Commons." }
    ]
  },
  {
    title: "Icônes open source",
    intro: "Jeux d’icônes cohérents, parfaits pour pictogrammes et signalétique. Les licences MIT et Apache autorisent l’usage commercial.",
    sites: [
      { name: "Iconify", url: "https://icon-sets.iconify.design", badge: "mixte", desc: "Plus de 200 000 icônes de plus de 200 collections, intégrées à la recherche de Vectothèque. Licence affichée par collection." },
      { name: "SVG Repo", url: "https://www.svgrepo.com", badge: "mixte", desc: "500 000 icônes et vecteurs SVG, licence (CC0, MIT, CC BY…) indiquée sur chaque fichier." },
      { name: "Material Symbols", url: "https://fonts.google.com/icons", badge: "oss", desc: "Les icônes de Google, plus de 3 000, licence Apache 2.0." },
      { name: "Lucide", url: "https://lucide.dev", badge: "oss", desc: "Plus de 1 500 icônes au trait, licence ISC (équivalent MIT)." },
      { name: "Phosphor", url: "https://phosphoricons.com", badge: "oss", desc: "Icônes déclinées en six graisses (fin, léger, normal, gras, rempli, duotone), licence MIT." },
      { name: "Tabler Icons", url: "https://tabler.io/icons", badge: "oss", desc: "Plus de 5 000 icônes au trait et pleines, licence MIT." },
      { name: "Heroicons", url: "https://heroicons.com", badge: "oss", desc: "Icônes simples des créateurs de Tailwind CSS, licence MIT." },
      { name: "Bootstrap Icons", url: "https://icons.getbootstrap.com", badge: "oss", desc: "Plus de 2 000 icônes, licence MIT." },
      { name: "Font Awesome Free", url: "https://fontawesome.com/search?ic=free", badge: "attrib", desc: "Les icônes gratuites de Font Awesome sont sous CC BY 4.0 : la mention est incluse dans le fichier." },
      { name: "Game-icons.net", url: "https://game-icons.net", badge: "attrib", desc: "4 000 icônes fortes en silhouette (crânes, armes, animaux, flammes), CC BY 3.0. Idéal pour les stickers." }
    ]
  },
  {
    title: "Illustrations prêtes à l’emploi",
    intro: "Scènes et personnages vectoriels, souvent personnalisables en couleur.",
    sites: [
      { name: "unDraw", url: "https://undraw.co", badge: "libreLic", desc: "Centaines d’illustrations à plat, couleur d’accent réglable. Licence unDraw : commercial autorisé sans attribution." },
      { name: "Open Peeps", url: "https://www.openpeeps.com", badge: "libre", desc: "Personnages dessinés à la main à composer (tête, corps, expression). CC0." },
      { name: "Humaaans", url: "https://www.humaaans.com", badge: "libre", desc: "Personnages modulaires (tenues, coiffures, poses). CC0." },
      { name: "Open Doodles", url: "https://www.opendoodles.com", badge: "libre", desc: "Illustrations au trait façon croquis, en SVG. CC0." },
      { name: "ManyPixels · Galerie", url: "https://www.manypixels.co/gallery", badge: "libreLic", desc: "Illustrations à plat en plusieurs styles, couleur modifiable, usage commercial libre." },
      { name: "DrawKit", url: "https://www.drawkit.com", badge: "mixte", desc: "Packs d’illustrations et d’icônes, une partie gratuite, une partie payante." },
      { name: "Storyset", url: "https://storyset.com", badge: "attrib", desc: "Illustrations animables de Freepik, gratuites avec attribution. Revente interdite, y compris imprimée sur des produits (t-shirts, tasses, stickers)." }
    ]
  },
  {
    title: "Motifs et fonds",
    intro: "Les sites de générateurs de motifs, vagues et formes. Chaque générateur est détaillé, avec ouverture directe, sur la page Générateurs.",
    link: { href: "generateurs.html", label: "Voir les générateurs" },
    sites: [
      { name: "Hero Patterns", url: "https://heropatterns.com", badge: "attrib", desc: "Une centaine de motifs répétables en SVG, couleurs réglables. CC BY 4.0." },
      { name: "Pattern Monster", url: "https://pattern.monster", badge: "oss", desc: "Générateur de motifs sans raccord, très paramétrable, export SVG. Licence MIT." },
      { name: "Haikei", url: "https://haikei.app", badge: "libreLic", desc: "Générateur de fonds (vagues, blobs, dégradés de formes, polygones) exportés en SVG, usage commercial autorisé." },
      { name: "fffuel", url: "https://www.fffuel.co", badge: "libreLic", desc: "Plus de 50 générateurs SVG très soignés (grain, motifs, formes, textures, dégradés), utilisation libre." },
      { name: "SVGBackgrounds", url: "https://www.svgbackgrounds.com", badge: "mixte", desc: "Fonds SVG personnalisables, une partie gratuite avec attribution." },
      { name: "Get Waves", url: "https://getwaves.io", badge: "mixte", desc: "Génère des vagues SVG en quelques clics. Licence des fichiers non précisée sur le site (le même éditeur propose Haikei)." },
      { name: "Blobmaker", url: "https://www.blobmaker.app", badge: "mixte", desc: "Génère des formes organiques (blobs) en SVG. Licence des fichiers non précisée sur le site." }
    ]
  },
  {
    title: "Logos de marques",
    intro: "Logos officiels en vectoriel, pratiques pour identifier ou retrouver un fichier propre. Attention, deux protections se cumulent : le logo est une marque déposée, et le fichier téléchargé a ses propres conditions (Worldvectorlogo : usage personnel uniquement). Pour un travail client, demandez le fichier du logo au client lui-même.",
    sites: [
      { name: "Worldvectorlogo", url: "https://worldvectorlogo.com", badge: "marque", desc: "Plus de 120 000 logos en SVG (voitures, sponsors, clubs, entreprises). Intégré à la recherche de Vectothèque via le bouton « logos de marques ». Conditions du site : usage personnel uniquement." },
      { name: "Brands of the World", url: "https://www.brandsoftheworld.com", badge: "marque", desc: "Grande base de logos en AI, EPS, CDR et SVG envoyés par la communauté. Compte gratuit pour télécharger." },
      { name: "Vector Logo Zone", url: "https://www.vectorlogo.zone", badge: "marque", desc: "Logos de marques tech en SVG, dans des formats homogènes (icône, horizontal, carré)." },
      { name: "Simple Icons", url: "https://simpleicons.org", badge: "marque", desc: "Plus de 3 000 logos de marques en version monochrome SVG. Le fichier est CC0, mais la marque reste protégée." }
    ]
  }
];

function catId(title) { return "cat-" + norm(title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function renderDirectory(filter) {
  const f = norm(filter || "");
  let shown = 0;
  const html = DIRECTORY.map(function (cat) {
    const sites = cat.sites.filter(function (s) { return !f || norm(s.name + " " + s.desc + " " + cat.title).indexOf(f) !== -1; });
    if (!sites.length) return "";
    shown += sites.length;
    return '<section class="cat" id="' + catId(cat.title) + '"><h2>' + esc(cat.title) + "</h2><p>" + esc(cat.intro) +
      (cat.link ? ' <a href="' + esc(cat.link.href) + '">' + esc(cat.link.label) + " →</a>" : "") + '</p><div class="sites">' +
      sites.map(function (s) {
        const b = BADGE[s.badge];
        const host = s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        return '<a class="site" href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
          '<div class="site-head"><span class="site-name">' + esc(s.name) + '</span><span class="badge ' + b[0] + '">' + esc(b[1]) + "</span></div>" +
          '<div class="site-desc">' + esc(s.desc) + "</div>" +
          '<div class="site-url">' + esc(host) + "</div></a>";
      }).join("") + "</div></section>";
  }).join("");
  $("directory").innerHTML = html || '<div class="empty">Aucun site ne correspond à « ' + esc(filter) + " ».</div>";
  $("dirCount").textContent = shown + " site" + (shown > 1 ? "s" : "");
}

function renderDirNav() {
  $("dirNav").innerHTML = DIRECTORY.map(function (cat) {
    return '<a class="chip" href="#' + catId(cat.title) + '">' + esc(cat.title) + '<span class="n">' + cat.sites.length + "</span></a>";
  }).join("");
}

$("dirFilter").addEventListener("input", function () { renderDirectory(this.value); });
renderDirNav();
renderDirectory("");
