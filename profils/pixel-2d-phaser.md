# Profil — pixel art 2D, Phaser

Jeu du studio : **Kingvi SNO 7** (exploration contemplative, grande carte,
météo, jour et nuit, combats, intérieurs).

## Quand le choisir

- Grand monde qui défile, caméra qui suit, beaucoup de sprites animés,
  particules, lumière, tilemaps, scènes (intérieurs, menus).
- Action, aventure, plateforme, exploration.

## Stack

- Phaser **3.90.0**, copié dans `vendor/phaser.min.js` (jamais de CDN), avec sa
  licence. Chargé par un `<script>` classique avant les modules du jeu.
- `Scale.NONE` : on gère soi-même la taille du canevas et le facteur entier
  (voir `modules/pixel-canvas.js` pour le calcul ; avec Phaser, on applique
  `game.scale.resize` et `camera.setZoom(facteur)`).
- `pixelArt: true`, `roundPixels: true`, `antialias: false`.
- Boucle : celle de Phaser pour le rendu ; la logique de jeu à pas fixe dans
  `update`, avec le temps lu par le jeu (pas `scene.time.now`, que le mode
  debug n'accélère pas).

## Structure (d'après Kingvi)

```
index.html  labo.html  atelier.html
vendor/phaser.min.js
js/
  main.js          interface : écran titre, réglages, sauvegarde, mise à jour
  game.js          la scène Phaser : monde par morceaux, objets triés en y
  world.js         le monde, déterministe (graine fixe)
  <hero>.js        le héros : poses en pixels, animation
  <créature>.js    une créature par fichier, partagé jeu / labo
  weather.js daylight.js audio.js dialogue.js map.js
  texts.js tuning.js   textes et réglages chiffrés (modifiés par l'atelier)
  design-store.js      lit le contenu publié par l'atelier
  debug.js             ?debug=1
tools/playtest/        harnais Playwright
assets/design/         contenu publié par l'atelier (PNG, JSON)
```

Règles qui ont fait leurs preuves :

- Chaque élément visuel est un module **partagé entre le jeu et le labo** : le
  labo montre exactement ce que le jeu dessine.
- Le monde se charge **par morceaux** autour du héros ; un morceau abandonné
  défait ce qu'il a posé (`finally`).
- Textures préparées une fois, puis réutilisées ; jamais de dessin pixel par
  pixel par image.

## Pièges (Phaser 3.90)

- `RenderTexture.resize` ne redimensionne pas la surface : recréer.
- Une image dont la texture a été retirée fige tout le rendu.
- `scene.time.now` ignore le `timeScale` du debug.
- Sans carte graphique (conteneur), 7 à 25 images/s : comparer en relatif.
