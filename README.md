# Vectothèque

Vecteurs SVG libres, cherchés en français, avec leur licence.

Vectothèque est un site gratuit en français pour trouver et créer des fichiers vectoriels (SVG) pour Illustrator, Inkscape, VectorCraft et les logiciels du même type.

- **Recherche** : tapez un mot en français (« éclair », « tête de mort »…). Il est traduit en anglais et cherché en même temps sur [Iconify](https://iconify.design) (plus de 200 000 icônes open source) et [Wikimedia Commons](https://commons.wikimedia.org). Chaque résultat affiche sa licence et se télécharge ou se copie en SVG sans quitter la page. Les logos de marques viennent de [Worldvectorlogo](https://worldvectorlogo.com), à la demande.
- **Générateurs** : les meilleurs générateurs SVG gratuits (vagues, motifs, formes, textures, dégradés), décrits en français et ouverts directement dans la page.
- **Annuaire** : les banques de vecteurs gratuites classées par type, chacune avec un badge de licence (CC0, MIT/Apache, attribution requise, mixte, marque déposée).

## Fonctionnement

Un site statique : HTML, CSS et JavaScript simple, sans framework ni étape de compilation. Toutes les requêtes partent directement du navigateur du visiteur vers des API publiques qui l'autorisent (CORS) :

| Service | Usage | Clé |
| --- | --- | --- |
| Iconify | Recherche d'icônes | Aucune |
| Wikimedia Commons | Recherche de fichiers SVG | Aucune |
| MyMemory | Traduction de repli (un dictionnaire intégré passe d'abord) | Aucune |
| Worldvectorlogo | Logos de marques, seulement à la demande | Facultative : 10 recherches par jour et par visiteur sans clé. Une clé gratuite peut être saisie sur le site, elle reste dans le navigateur du visiteur |

Aucune donnée n'est collectée et il n'y a pas de code côté serveur.

## Lancer en local

Ouvrez `index.html` par double-clic, c'est tout.

Pour tester comme sur un serveur :

```bash
python -m http.server 8000
```

puis allez sur http://localhost:8000.

## Déploiement

Le site est déployé sur [Vercel](https://vercel.com) depuis la branche `main`. Le fichier `vercel.json` active les adresses propres (`/generateurs` au lieu de `/generateurs.html`).

## Contribuer

Pour proposer un site, un générateur ou une correction de licence, ouvrez une [issue](https://github.com/egstar38-afk/vectotheque/issues).

- Sites de l'annuaire : `assets/js/annuaire.js`
- Générateurs : `assets/js/generateurs-data.js`
- Dictionnaire français → anglais : `assets/js/traduction.js`

## Licence

Le code du site est sous licence [MIT](LICENSE). Les fichiers vectoriels trouvés grâce à lui appartiennent à leurs auteurs et gardent leur propre licence : vérifiez-la avant tout usage commercial. Les logos sont des marques déposées.
