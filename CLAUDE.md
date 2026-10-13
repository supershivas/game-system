# game-system — notes pour Claude Code

Source de vérité partagée par tous les jeux (tableau dans `README.md`).
Indépendant de `supershivas/design-system`, qui ne sert qu'aux apps : ne
rien importer de ce dépôt-là, ne pas y renvoyer.

## Ce que contient ce dépôt

| Chemin | Rôle | Copié dans un jeu ? |
|--------|------|---------------------|
| `CONVENTIONS.md` | règles communes aux jeux | oui → `.claude/conventions-jeu.md` (à chaque session) |
| `DESIGN-SYSTEM.md` | design system des jeux, **à définir** | non |
| `index.html`, `site/` | page d'accueil (GitHub Pages) : formulaire du prompt, inspiration, lecteur des fichiers | non |
| `INSPIRATION.md` | jeux, périodes, personnages, œuvres où puiser | non (lu par la page et par le prompt) |
| `MES-INSPIRATIONS.md` | les inspirations personnelles de Jérôme : noyau (12 au plus), fils (10 au plus), réserve | non (lu par la page ; le prompt n'en lit que le noyau) |
| `GENRES.md` | catalogue genres / vues / rendus / publics | non (lu par le prompt de démarrage) |
| `LECONS.md` | pièges rencontrés dans les jeux | non (lu au besoin) |
| `profils/` | une fiche par famille de rendu | non (lue au démarrage) |
| `modules/` | briques de code sans dépendance | oui, une fois, puis tenues à jour |
| `outils/` | scripts Node + Playwright | oui, une fois, puis tenus à jour |
| `templates/` | prompt de démarrage, installeur, jeu de départ (`starter/`), modèles de documents, agents / commandes / skills (`.claude/`), workflow | oui, une fois, au démarrage (`installer.sh`) |

## Règles de travail ici

- `CONVENTIONS.md` s'applique **aux jeux**, pas à ce dépôt : pas de
  `version.json` ni de `CHANGELOG.md` ici.
- **Un module ne casse jamais son interface.** Les jeux le reçoivent sans
  relecture au début de leur session. Ajouter une option, oui ; renommer ou
  changer le sens d'une fonction exportée, non. Une rupture se fait sous un
  nouveau nom de fichier (`save2.js`), et l'ancien reste.
- Chaque module est **autonome** : il n'importe aucun autre module de
  `modules/` (un jeu peut n'en adopter qu'un), aucune dépendance, aucun CDN.
  En tête de fichier : son rôle, son mode d'emploi et la règle de
  `CONVENTIONS.md` qu'il applique.
- Avant de pousser un module ou un outil :
  1. `for f in modules/*.js outils/*.mjs outils/playtest/*.mjs; do node --input-type=module --check < "$f"; done`
  2. `node outils/test-run.mjs modules/tests`
  3. installer le jeu de départ dans le scratchpad et le passer aux outils :
     ```
     mkdir essai && cd essai && git init -q
     sh /home/user/game-system/templates/installer.sh --nom "Essai d'un jeu" --repo supershivas/essai --agents complet
     node outils/test-run.mjs && node outils/captures.mjs --page index.html --page labo.html --page atelier.html
     node outils/audit-ecran.mjs --page index.html --page labo.html --page atelier.html
     ```
     (un nom avec apostrophe : il a déjà cassé une chaîne JS) — et regarder les captures.
- Les textes sont en français. Les noms de fichiers des modules sont en
  anglais et en minuscules ; les outils peuvent porter un nom français.
- Quand une leçon tirée d'un jeu vaut pour tous : `LECONS.md`. Si elle doit
  devenir une règle, la proposer à Jérôme sous la forme « Proposition pour
  CONVENTIONS.md : … ».
- La liste des modules et des outils est écrite en dur dans
  `templates/sync-game-system.sh` : un nouveau module s'y ajoute, sinon les
  jeux ne le reçoivent jamais.
- **La page d'accueil lit les fichiers, elle ne les recopie pas.** Elle
  dépend de leur format :
  - `templates/PROMPT-NOUVEAU-JEU.md` : le texte après la première ligne
    `---`, les marques `[Nom du jeu]`, `supershivas/[repo]`, le pitch entre
    crochets et la ligne « Avant d'écrire du code : » (où elle insère
    inspirations et décisions déjà prises) ;
  - `GENRES.md` : sections `## 1.` à `## 5.`, familles en `### X. Titre`,
    le nom en première colonne des tableaux ;
  - `INSPIRATION.md` : `## section`, `### sous-section`, et des entrées
    `- **Nom** (repère) — ce qu'on peut en prendre.`
  - `MES-INSPIRATIONS.md` : même format d'entrée (avec, facultatif, `[servi : Jeu]`
    entre le repère et le tiret), sous `## Le noyau`,
    `## Les fils` (un `### fil` par thème) et `## La réserve`. Ses
    plafonds sont la règle du fichier : 12 entrées au noyau, 10 fils ; pour
    en ajouter, proposer à Jérôme ce qui sort ou passe en réserve. Il ne
    contient que des noms et « ce que j'en prends », jamais de paroles de
    chanson ni de passages de ses textes (le dépôt est public).
  Après un changement de l'un d'eux, ou d'une question du prompt (les
  décisions du formulaire sont dans `site/accueil.js`, `decisionsDe`), ouvrir
  la page en local (`node outils/captures.mjs`) et relire le prompt généré.
- La liste des fichiers lisibles sur la page est écrite en dur dans
  `site/accueil.js` (`DOCS`) : un nouveau fichier s'y ajoute.
- `DESIGN-SYSTEM.md` reste un chantier ouvert : ne pas y figer de valeurs
  sans l'accord de Jérôme.

## Workflow Git

Pousse directement sur `main`.
