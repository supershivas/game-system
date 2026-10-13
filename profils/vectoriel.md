# Profil — vectoriel, formes générées, illustré

Aucun jeu du studio n'est entièrement dans ce profil ; Frères de la Côte
génère ses navires et ses nuages, et Factokid ses signes d'interface « en
courbes ». C'est le profil d'un rendu **non pixel** : formes nettes à toute
taille, ou images dessinées à la main.

## Quand le choisir

- Style graphique plat, géométrique, papier découpé, ligne claire.
- Illustrations faites à la main (tablette, papier scanné) posées dans le jeu.
- Jeux de puzzle, de réflexion, contemplatifs, éducatifs.

## Stack

- **Canvas 2D** avec des chemins (`Path2D`), ou **SVG** dans le DOM pour peu
  d'objets interactifs. Pas de bibliothèque par défaut.
- Formes générées à partir d'une **graine** (`modules/rng.js`) : un nuage, un
  navire, un arbre se refont à l'identique.
- Le canvas est dimensionné en pixels physiques (`devicePixelRatio`) ; ici
  l'échelle peut être fractionnaire, puisque rien n'est en pixels.
- Images illustrées : PNG ou WebP à 2× la taille d'affichage, rangées dans
  `assets/`, déclarées dans une table (`data/images.js`) ; importées et
  recadrées par l'atelier.

## Règles

- **Palette fermée** malgré tout (déclarée dans `CLAUDE.md`).
- **Une masse translucide se peint en une fois** : un seul chemin fermé, pas
  des formes semi-transparentes empilées.
- **Une forme vient d'une graine**, jamais d'une position qui bouge.
- Épaisseur de trait et rayons dans une échelle déclarée.

## Labo et atelier

- Labo : une planche des formes générées avec plusieurs graines, côte à côte.
- Atelier : réglage des paramètres de génération (curseurs), import et
  recadrage des illustrations.
