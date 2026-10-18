# game-system

**Page d'accueil : https://supershivas.github.io/game-system/** — le
formulaire qui écrit le prompt d'un nouveau jeu, l'inspiration à piocher,
et tous les fichiers du dépôt à lire.

La source de vérité commune aux **jeux** Supershivas : jeux en solo, joués
dans le navigateur, et qu'on doit pouvoir porter sur Steam plus tard.
Ce dépôt ne dépend pas de `design-system`, qui ne sert qu'aux apps.

On y trouve :

1. **Les conventions** (`CONVENTIONS.md`) : les règles que Claude Code
   applique dans chaque jeu (Git, version, sauvegarde, commandes, écran,
   labo, atelier, vérifications, livraison).
2. **Les modules** (`modules/`) : des briques de code sans dépendance
   (clavier, pointeur, boucle, canvas en pixels, hasard à graine,
   sauvegarde, debug, sprites, audio, manette, publication de l'atelier,
   mise à jour automatique…). On en copie une fois une dans un jeu, puis
   elle se met à jour toute seule.
3. **Les outils** (`outils/`) : des scripts Node + Playwright qui
   vérifient un jeu (captures sur les deux cibles, audit de l'écran,
   lisibilité, tests, estampille de version, harnais de playtest).
4. **Les modèles** (`templates/`) : le prompt de démarrage d'un nouveau jeu,
   les modèles de `CLAUDE.md`, de la bible `DESIGN.md` et de la `ROADMAP.md`,
   un jeu de départ jouable, le labo et l'atelier, les agents, commandes et
   skills Claude Code, le workflow GitHub Pages.
5. **La mémoire** :
   - `MES-INSPIRATIONS.md` : mes inspirations à moi, en trois étages (un
     noyau de 12 entrées au plus, des fils repliés, une réserve) ;
   - `INSPIRATION.md` : jeux, périodes historiques, personnages, œuvres
     d'art (peinture, estampe, BD, cinéma, littérature, musique) et
     contraintes de style où puiser, avec ce qu'on peut prendre de chacun ;
   - `LECONS.md` : les pièges déjà rencontrés dans les jeux ;
   - `GENRES.md` : le catalogue des genres, vues, rendus et publics ;
   - `profils/` : une fiche technique par famille de rendu.
6. **Le design system des jeux** (`DESIGN-SYSTEM.md`) : **encore à
   définir**. Le fichier rassemble ce qui est commun et ce qui reste à
   trancher.

## Arborescence

```
index.html  site/         la page d'accueil (GitHub Pages, racine de main)
INSPIRATION.md          où puiser : jeux, périodes, personnages, œuvres
MES-INSPIRATIONS.md     mes inspirations : noyau, fils, réserve
CONVENTIONS.md          les règles des jeux (copiées dans chaque jeu)
DESIGN-SYSTEM.md        le design system des jeux — à définir
GENRES.md               genres, vues, rendus, publics, formes de session
LECONS.md               les pièges déjà rencontrés, et ce qu'il faut réaligner
profils/                pixel-2d-canvas, pixel-2d-phaser, pixel-3d-three, dom-cartes, vectoriel
modules/                → js/lib/ des jeux
  app-update.js           version, changelog, mise à jour sans perte de partie
  keys.js  pointer.js  gamepad.js     commandes (clavier, souris/doigt, manette)
  loop.js                 boucle à pas fixe, pause, accélération du temps
  pixel-canvas.js         résolution logique, échelle entière, pixels physiques
  rng.js                  hasard à graine (règles pures, rejouables)
  save.js                 sauvegarde versionnée, migrations, export / import
  debug.js                ?debug=1 → window.__jeu (état, journal, téléport…)
  sprites.js              sprites en matrices de lettres, export PNG / .gpl
  audio.js                Web Audio : bruitages synthétisés, musique, volumes
  i18n.js                 langues
  game.css                base CSS (100dvh, aucun geste au navigateur…)
  labo-shell.js/.css      la coquille du Labo (une variante à la fois ; page d'accueil : journal des changements, nouveautés, sujets à trancher)
  labo-timeline.js        la frise du temps du Labo (jouer, pause, glisser, sauter d'étape en étape)
  pixel-editor.js         l'éditeur de pixels de l'Atelier
  gh-publish.js           publication de l'Atelier en un commit
  tests/                  tests des modules (node outils/test-run.mjs modules/tests)
outils/                 → outils/ des jeux (Node + Playwright)
  test-run.mjs            tests sans navigateur
  captures.mjs            les deux cibles, sans erreur console
  audit-ecran.mjs         débordement, amputation, cibles, survol
  lisibilite.mjs          contraste, silhouettes, pose entière
  stamp-version.mjs       ?v=X.Y.Z contre le cache de GitHub Pages
  icones.mjs              favicon.ico, apple-touch-icon, icônes PWA
  playtest/run.mjs        harnais : carnet, captures, journal d'une partie
templates/
  PROMPT-NOUVEAU-JEU.md   le prompt de démarrage (questions à choix multiples)
  installer.sh            installe tout dans le repo d'un nouveau jeu
  starter/                jeu de départ jouable : titre, réglages, pause, sauvegarde,
                          debug, aperçu téléphone, labo, atelier, tests
  CLAUDE.jeu.md  DESIGN.md  ROADMAP.md      modèles de documents
  .claude/                agents, commandes (/playtest, /verifier), skills
  playtests/_templates/   retour joueur, décisions
  sync-game-system.sh  claude-settings.json  pages.yml  gitignore
```

## Jeux

| Jeu | Repo | Production | Rendu |
|-----|------|------------|-------|
| **Kingvi SNO 7** | [supershivas/kingvi](https://github.com/supershivas/kingvi) | https://supershivas.github.io/kingvi/ | pixel 2D, Phaser |
| **Pierre et les rats** | [supershivas/pierre-et-les-rats](https://github.com/supershivas/pierre-et-les-rats) | https://supershivas.github.io/pierre-et-les-rats/ | pixel 3D, three.js |
| **Factokid** | [supershivas/factokid](https://github.com/supershivas/factokid) | https://supershivas.github.io/factokid/ | pixel 2D, canvas |
| **Croiseur (Space Crusader)** | [supershivas/space-crusader](https://github.com/supershivas/space-crusader) | https://supershivas.github.io/space-crusader/ | pixel 2D, canvas |
| **Frères de la Côte** | [supershivas/frere-de-la-cote](https://github.com/supershivas/frere-de-la-cote) | https://supershivas.github.io/frere-de-la-cote/ | DOM, cartes |

Ces cinq jeux sont antérieurs à `game-system` : ils ne le synchronisent pas
encore. `LECONS.md` (section « Réaligner les jeux existants ») dit ce qu'il
faudrait reprendre dans chacun.

## Créer un nouveau jeu

1. Crée le repo (vide) sur GitHub.
2. Remplis le formulaire de la page d'accueil (nom, pitch, inspirations, et
   les décisions déjà prises), copie le prompt, ouvre une session Claude Code
   dans ce repo et colle-le. Sans la page : `templates/PROMPT-NOUVEAU-JEU.md`
   à remplir à la main.
3. Claude Code te pose les questions restantes à choix multiples (genre,
   vue, rendu, palette, commandes, sauvegarde, labo, atelier, outils,
   agents, Steam…), puis il installe tout et construit le **lot minimal**.

## Comment un jeu suit ce dépôt

Chaque jeu a `scripts/sync-game-system.sh`, copié depuis `templates/`. Le
hook `SessionStart` de `.claude/settings.json` le lance au début de chaque
session Claude Code. Il télécharge depuis la branche `main` :

- `CONVENTIONS.md` → `.claude/conventions-jeu.md`. La première ligne du
  `CLAUDE.md` du jeu l'importe (`@.claude/conventions-jeu.md`).
- les fichiers de `modules/` et de `outils/`, **mais seulement ceux dont
  le jeu a déjà une copie**, et seulement dans les dossiers réservés :
  `js/lib/` (ou `src/lib/`, `lib/`) pour les modules, `outils/` pour les
  outils. Pour adopter un module, on le copie une fois dans `js/lib/` ; il
  suit ensuite. Un fichier du jeu ailleurs (son propre `js/keys.js`) n'est
  jamais touché.

Le script ne bloque jamais : si le réseau échoue, le jeu garde sa copie.

```bash
sh scripts/sync-game-system.sh
```

Le `CLAUDE.md` d'un jeu prévaut sur les conventions ; ses exceptions sont
listées dans sa section « Exceptions aux conventions ».

## Modifier ce dépôt

- Une règle commune → `CONVENTIONS.md`. Les jeux la reçoivent à leur
  prochaine session.
- Un module → `modules/`. Il ne doit jamais casser l'interface qu'il
  expose : les jeux le reçoivent sans relecture. Une rupture se fait sous un
  nouveau nom de fichier.
- Un piège découvert dans un jeu et qui vaut pour les autres → `LECONS.md`.
