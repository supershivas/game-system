# Profil — 3D pixelisée (ou low-poly, voxel), three.js

Jeu du studio : **Pierre et les rats** (v2 : ville en 3D, caméra libre,
nuée de milliers de rats, palette de trois tons exacte).

## Quand le choisir

- Volume, caméra qui tourne, ville ou paysage, hauteur à hauteur d'enfant.
- Low-poly, voxel, diorama, 3D « pixel art » rendue en basse résolution.

## Stack

- three.js **0.170.0**, copié dans `vendor/three.module.min.js` avec sa
  licence, chargé à la demande par un petit module (`three-lib.js`).
- Rendu en **basse résolution** puis agrandi d'un facteur entier sans
  lissage (rendu dans une cible de la taille logique, recopiée au plus proche).
- Palette exacte : `THREE.ColorManagement.enabled = false`, sortie linéaire ;
  textures d'**indices de palette** (un octet par pixel) lues par un shader qui
  lit la palette dans une texture de N × 1.
- Géométries simples générées (boîtes, prismes, cylindres) avec couleurs de
  sommets ; une face prend un des trois tons de sa teinte selon son
  orientation : tout reste dans la palette.
- Beaucoup d'objets identiques : `InstancedMesh`.

## Structure (d'après Pierre)

```
js/
  game3d.js        boucle, caméra (yaw, tangage, zoom), passes de rendu
  world3d.js       sol, eau, bâtiments
  props3d.js       mobilier instancié
  geo.js           le « mesher » : formes simples en tons de palette
  swarm.js         la nuée (tableaux typés, grille de voisinage)
  city.js          le modèle logique (grille), seule règle de passage
  controls.js      souris, doigt, pince, deux doigts pour tourner
  palette.js scale.js
vendor/three.module.min.js
echelle.html       planche d'échelle
```

Règles qui ont fait leurs preuves :

- **La logique reste en 2D** (grille, collisions, nuée, sauvegarde) ; la 3D
  n'est qu'un rendu. Tout se teste sans WebGL.
- **Échelle réelle** déclarée (1 px = 5 cm) et planche d'échelle.
- **Coupe** : un bâtiment entre la caméra et le héros tombe à un muret, et ce
  qui est caché est tramé (passe `GreaterDepth`, damier de 1 px).
- Peindre les façades après le démarrage, les plus proches d'abord, avec un
  budget de quelques ms par image.

## Pièges

- Sans carte graphique, le rendu logiciel est lent : mesurer avec `?rats=2000`
  ou équivalent, comparer en relatif.
- Garder un moteur 2D de secours coûte cher : à décider dès le départ.
- Toute déformation du monde (grille pliée, terrain) se fait dans les shaders
  ET en CPU (`fwd`, `inv`) : deux systèmes de coordonnées à tenir.
