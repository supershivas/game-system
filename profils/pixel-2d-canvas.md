# Profil — pixel art 2D, canvas maison

Jeux du studio : **Factokid** (usine, téléphone), **Croiseur** (tactique,
famille). Le profil le plus léger : aucune bibliothèque, un seul `<canvas>`,
tout le jeu est à nous.

## Quand le choisir

- Grille, cartes, plateau, top-down simple, shmup, puzzle, gestion.
- Moins de quelques milliers d'objets à l'écran.
- On veut tout maîtriser (et tout peut être testé sans navigateur).

Sinon : beaucoup d'animations, de caméras, de particules, de tilemaps →
`pixel-2d-phaser.md`.

## Stack

- Vanilla JS, modules ES, sans build ; GitHub Pages.
- Un `<canvas>` en petite résolution logique, agrandi d'un facteur entier
  (`modules/pixel-canvas.js`) ; les menus et modales sont du DOM par-dessus.
- Boucle `modules/loop.js` (pas fixe) ; entrées `modules/keys.js`,
  `modules/pointer.js`.

## Structure

```
index.html            écran titre, canvas, réglages (dialog), toast
apercu.html           le jeu dans un cadre de téléphone (iframe)
version.json  CHANGELOG.md
css/style.css         variables (palette, échelle), écran titre, réglages
js/
  main.js             cycle de vie : titre → partie → pause ; réglages
  game.js             l'état de la partie, update(dt), les règles
  render.js           dessine l'état ; ne le modifie jamais
  palette.js          la palette (seul endroit où vivent les couleurs)
  sprites-data.js     les sprites en matrices de lettres
  data/               tables : ennemis, niveaux, recettes, textes
  lib/                modules de game-system (keys, pointer, loop, rng, save…)
test/                 règles, sauvegarde, invariants (node outils/test-run.mjs)
labo.html  atelier.html   (si demandés)
```

Règles qui ont fait leurs preuves :

- `sim/` ne dessine jamais, `render/` ne modifie jamais l'état (Factokid).
- La simulation est du JS pur, sans DOM : elle se teste et se mesure dans
  Node (`outils/` de Factokid : tapis, carte, mur, sauvegarde, tutoriel).
- Les sprites sont des matrices de lettres (Factokid `render/tuiles.js`,
  Croiseur `sprites.js`) ; une page du labo les montre tous, à la taille
  native, et les exporte en PNG et la palette en `.gpl`.
- Le texte en pixels : une fonte bitmap (Factokid : 5 × 7) ou une police
  pixel auto-hébergée (Croiseur : Press Start 2P corrigée).

## Pièges

- Échelle entière partout, y compris pour une icône posée dans un bouton.
- `devicePixelRatio` : dimensionner le canvas en pixels physiques.
- Ne pas dessiner pixel par pixel dans une boucle chaude : préparer des
  canvas hors écran (atlas) et les recopier.
- Le DOM par-dessus le canvas suit la même palette et la même échelle.
