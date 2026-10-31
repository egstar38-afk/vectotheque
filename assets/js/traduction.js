/* Vectothèque — traduction français → anglais pour la recherche */
"use strict";

/* ---------- Traduction FR → EN ---------- */
// Clés sans accents ni majuscules : « eclair » et « éclair » donnent le même résultat.
const DICT = {
  "eclair": "lightning", "foudre": "lightning", "orage": "thunderstorm", "tonnerre": "thunder",
  "etoile": "star", "etoile filante": "shooting star", "coeur": "heart", "coeur brise": "broken heart",
  "fleur": "flower", "fleur de lys": "fleur de lis", "rose": "rose", "tulipe": "tulip", "lotus": "lotus",
  "fleche": "arrow", "feuille": "leaf", "arbre": "tree", "palmier": "palm tree", "foret": "forest", "branche": "branch",
  "soleil": "sun", "lune": "moon", "nuage": "cloud", "pluie": "rain", "neige": "snow", "flocon": "snowflake",
  "flocon de neige": "snowflake", "arc en ciel": "rainbow", "vent": "wind", "tornade": "tornado",
  "feu": "fire", "flamme": "flame", "flammes": "flames", "eau": "water", "goutte": "drop", "goutte d eau": "water drop",
  "vague": "wave", "mer": "sea", "ocean": "ocean", "plage": "beach", "ile": "island", "montagne": "mountain",
  "voiture": "car", "voiture de course": "race car", "moto": "motorcycle", "camion": "truck", "velo": "bicycle",
  "avion": "airplane", "bateau": "boat", "fusee": "rocket", "bus": "bus", "train": "train", "tracteur": "tractor",
  "roue": "wheel", "pneu": "tire", "jante": "rim", "volant": "steering wheel", "moteur": "engine", "piston": "piston",
  "maison": "house", "batiment": "building", "ville": "city", "route": "road", "pont": "bridge", "chateau": "castle",
  "tour eiffel": "eiffel tower", "eglise": "church",
  "chat": "cat", "chien": "dog", "oiseau": "bird", "poisson": "fish", "cheval": "horse", "lion": "lion",
  "tigre": "tiger", "loup": "wolf", "aigle": "eagle", "papillon": "butterfly", "serpent": "snake", "dragon": "dragon",
  "ours": "bear", "lapin": "rabbit", "renard": "fox", "hibou": "owl", "chouette": "owl", "vache": "cow",
  "cochon": "pig", "poule": "chicken", "coq": "rooster", "abeille": "bee", "araignee": "spider",
  "toile d araignee": "spider web", "requin": "shark", "dauphin": "dolphin", "baleine": "whale", "tortue": "turtle",
  "licorne": "unicorn", "scorpion": "scorpion", "cerf": "deer", "taureau": "bull", "panthere": "panther",
  "patte": "paw", "empreinte": "footprint", "empreinte de patte": "paw print", "plume": "feather", "aile": "wing",
  "ailes": "wings", "corne": "horn", "griffe": "claw", "griffes": "claws",
  "tete de mort": "skull", "crane": "skull", "squelette": "skeleton", "os": "bone",
  "main": "hand", "oeil": "eye", "yeux": "eyes", "visage": "face", "sourire": "smile", "bouche": "mouth",
  "levres": "lips", "pied": "foot", "poing": "fist",
  "femme": "woman", "homme": "man", "enfant": "child", "bebe": "baby", "famille": "family", "personne": "person",
  "gens": "people", "utilisateur": "user",
  "couronne": "crown", "epee": "sword", "bouclier": "shield", "hache": "axe", "arc": "bow", "fleche et arc": "bow and arrow",
  "cle": "key", "cadenas": "padlock", "telephone": "phone", "ordinateur": "computer", "appareil photo": "camera",
  "musique": "music", "note de musique": "music note", "guitare": "guitar", "micro": "microphone", "casque audio": "headphones",
  "livre": "book", "crayon": "pencil", "stylo": "pen", "pinceau": "brush", "ciseaux": "scissors",
  "outil": "tool", "outils": "tools", "marteau": "hammer", "cle a molette": "wrench", "tournevis": "screwdriver",
  "engrenage": "gear", "drapeau": "flag", "drapeau a damier": "checkered flag", "damier": "checkered",
  "cible": "target", "trophee": "trophy", "medaille": "medal", "cadeau": "gift", "ballon": "ball",
  "ballon de foot": "soccer ball", "football": "soccer", "basket": "basketball", "tennis": "tennis", "golf": "golf",
  "casque": "helmet", "lunettes": "glasses", "chapeau": "hat", "chaussure": "shoe", "vetement": "clothing",
  "bijou": "jewel", "bague": "ring", "diamant": "diamond", "noeud papillon": "bow tie", "ruban": "ribbon",
  "carte": "map", "globe": "globe", "terre": "earth", "monde": "world", "planete": "planet", "boussole": "compass",
  "ancre": "anchor", "horloge": "clock", "montre": "watch", "sablier": "hourglass", "calendrier": "calendar",
  "enveloppe": "envelope", "courrier": "mail", "panier": "basket", "caddie": "shopping cart", "sac": "bag",
  "argent": "money", "piece": "coin", "ampoule": "light bulb", "lumiere": "light", "batterie": "battery",
  "prise": "plug", "energie": "energy", "puissance": "power", "vitesse": "speed", "course": "racing",
  "ange": "angel", "demon": "demon", "diable": "devil", "fantome": "ghost", "sorciere": "witch", "fee": "fairy",
  "extraterrestre": "alien", "robot": "robot", "pirate": "pirate", "chevalier": "knight", "samourai": "samurai",
  "viking": "viking", "soldat": "soldier", "pompier": "firefighter", "medecin": "doctor", "hopital": "hospital",
  "croix": "cross", "cercle": "circle", "carre": "square", "triangle": "triangle", "losange": "rhombus",
  "hexagone": "hexagon", "spirale": "spiral", "ligne": "line", "lignes": "lines", "point": "dot", "points": "dots",
  "pois": "polka dots", "rayures": "stripes", "bandes": "stripes", "grille": "grid", "nid d abeille": "honeycomb",
  "motif": "pattern", "fond": "background", "texture": "texture", "cadre": "frame", "bordure": "border",
  "etiquette": "label", "icone": "icon", "ombre": "shadow", "geometrique": "geometric", "abstrait": "abstract",
  "ornement": "ornament", "floral": "floral", "tribal": "tribal", "camouflage": "camouflage", "carbone": "carbon",
  "fumee": "smoke", "explosion": "explosion", "eclaboussure": "splash", "tache": "splatter", "peinture": "paint",
  "tatouage": "tattoo", "graffiti": "graffiti", "bulle": "bubble", "bulle de dialogue": "speech bubble",
  "cerise": "cherry", "pomme": "apple", "fruit": "fruit", "legume": "vegetable", "cafe": "coffee", "biere": "beer",
  "vin": "wine", "gateau": "cake", "couteau": "knife", "fourchette": "fork",
  "noel": "christmas", "sapin": "christmas tree", "citrouille": "pumpkin", "paques": "easter", "oeuf": "egg",
  "anniversaire": "birthday", "fete": "party", "mariage": "wedding",
  "coche": "checkmark", "loupe": "magnifying glass", "recherche": "search", "parametres": "settings",
  "accueil": "home", "partager": "share", "telecharger": "download", "poubelle": "trash",
  "vintage": "vintage", "retro": "retro", "silhouette": "silhouette", "logo": "logo"
};
const STOP = { "de": 1, "du": 1, "des": 1, "la": 1, "le": 1, "les": 1, "un": 1, "une": 1, "d": 1, "l": 1, "en": 1, "et": 1 };

function dictLookup(word) {
  if (DICT[word]) return DICT[word];
  if (/[sx]$/.test(word) && DICT[word.slice(0, -1)]) return DICT[word.slice(0, -1)];
  return null;
}
function translateLocal(text) {
  const n = norm(text);
  if (!n) return null;
  const whole = dictLookup(n);
  if (whole) return whole;
  // « têtes de mort » → « tete de mort »
  const singular = n.split(" ").map(function (w) { return w.length > 3 ? w.replace(/[sx]$/, "") : w; }).join(" ");
  if (DICT[singular]) return DICT[singular];
  const words = n.split(" ").filter(function (w) { return !STOP[w]; });
  if (!words.length) return null;
  const out = [];
  for (const w of words) {
    const t = dictLookup(w);
    if (!t) return null;
    out.push(t);
  }
  return out.join(" ");
}
async function translate(text, signal) {
  const local = translateLocal(text);
  if (local) return { term: local, how: "dictionnaire intégré" };
  try {
    const url = "https://api.mymemory.translated.net/get?langpair=fr|en&q=" + encodeURIComponent(text.trim());
    const r = await fetch(url, { signal: signal });
    if (r.ok) {
      const d = await r.json();
      let t = d && d.responseData && d.responseData.translatedText;
      if (t && !/MYMEMORY|QUERY LENGTH|INVALID/i.test(t)) {
        t = stripHtml(t).toLowerCase().replace(/[.!?]+$/, "").trim();
        if (t) return { term: t, how: "traduction automatique (MyMemory)" };
      }
    }
  } catch (e) {
    if (e.name === "AbortError") throw e;
  }
  return { term: text.trim(), how: "non traduit" };
}
