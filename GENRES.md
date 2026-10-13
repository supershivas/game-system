# Catalogue — genres, vues, rendus, publics

Le prompt de démarrage (`templates/PROMPT-NOUVEAU-JEU.md`) s'appuie sur ce
catalogue pour proposer les bonnes options. Une question ne peut offrir que
4 choix (plus « Autre ») : on pose d'abord la **famille**, puis le **genre**
dans la famille, en sélection multiple quand le jeu est hybride.

Chaque genre est noté sur ce qu'il demande à un solodev en navigateur :
**coût** (contenu et systèmes à produire), **mobile** (s'il se joue bien au
pouce), et les **modules et outils** qui comptent le plus pour lui.

---

## 1. Les familles et leurs genres

### A. Action et réflexes

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Plateforme | Celeste, Super Meat Boy | moyen | moyen (boutons) | `loop` (pas fixe), collisions, sensation du saut, éditeur de niveaux |
| Metroidvania | Hollow Knight | élevé | moyen | carte, sauvegarde, atelier de placement |
| Shoot'em up / bullet hell | Vampire Survivors, Ikaruga | faible à moyen | bon (pouce) | `loop`, nuées en tableaux typés, `rng` |
| Survivor-like (horde) | Vampire Survivors, Brotato | faible | très bon | `loop`, nuées, équilibrage mesuré |
| Beat'em up / combat | Streets of Rage | moyen | moyen | animations, labo des poses |
| Arcade / score | Pac-Man, Downwell | faible | bon | `rng`, tableau des scores, sessions courtes |
| Course / véhicules | Micro Machines, Art of Rally | moyen | moyen | physique simple, pistes en données |
| Sport | Windjammers, Golf Story | moyen | moyen | physique, IA |
| Rythme / musique | Crypt of the NecroDancer, Taiko | moyen | bon | `audio` (horloge Web Audio), calage de latence |
| Twin-stick / arène | Enter the Gungeon | moyen | moyen | `gamepad`, `pointer` |

### B. Exploration, aventure et récit

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Contemplatif / marche | Kingvi, Journey, Proteus | moyen | bon | atmosphère, son, `debug` (téléport), harnais de playtest |
| Aventure / action-aventure | Zelda (2D), Tunic | élevé | moyen | carte, dialogues, atelier de placement et de textes |
| Point & click | Monkey Island, Machinarium | moyen | très bon | `pointer`, dialogues, inventaire, atelier de textes |
| Fiction interactive / visual novel | 80 Days, Inkle, Ren'Py | faible (code), élevé (écriture) | très bon | `i18n`, atelier de textes, graphe de scènes |
| Walking sim narratif | Firewatch, Gone Home | moyen | moyen | textes, son |
| Horreur / tension | Lone Survivor, Iron Lung | moyen | moyen | lumière, son, rythme |
| Enquête / déduction | Return of the Obra Dinn, Her Story | moyen | bon | données de l'enquête, vérification de cohérence |
| Exploration procédurale | Spelunky, Noita | élevé | moyen | `rng`, génération testée en masse |

### C. Réflexion et puzzle

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Puzzle à niveaux | Baba Is You, Sokoban | faible (code), moyen (niveaux) | très bon | éditeur de niveaux, solveur de vérification |
| Puzzle physique | Cut the Rope, World of Goo | moyen | très bon | physique déterministe |
| Match-3 / tuiles | Threes, 2048, Dorfromantik | faible | très bon | `rng`, sessions courtes |
| Programmation / logique | Zachtronics, Human Resource Machine | moyen | moyen | simulateur pur, tests |
| Puzzle spatial / construction | Townscaper, Islanders | moyen | bon | génération, placement |
| Mots / lettres | Wordle, Letterpress | faible | très bon | dictionnaire, `i18n` |

### D. Stratégie, gestion et simulation

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Tactique au tour par tour | Into the Breach, Croiseur | moyen | très bon | règles pures, IA, simulateur d'équilibrage |
| Stratégie en temps réel / défense | Kingdom Rush, Northgard | élevé | moyen | IA, nuées, équilibrage |
| Tower defense | Bloons, Kingdom Rush | moyen | très bon | vagues en données, équilibrage mesuré |
| Gestion / automatisation / usine | Factokid, Factorio, Shapez | élevé | bon (tracé au doigt) | `loop`, files compressées, invariants testés |
| City / colonie builder | Pierre, Banished, RimWorld | élevé | moyen | génération, nuées, performances |
| Simulation de vie / ferme | Stardew Valley, Animal Crossing | élevé | bon | calendrier, sauvegarde, contenu en données |
| Idle / incrémental | Cookie Clicker, A Dark Room | faible | très bon | courbes mesurées, progression permanente |
| Commerce / économie | Recettear, Potion Craft | moyen | bon | économie simulée et mesurée |
| Grand stratégie / 4X léger | Polytopia | élevé | bon | IA, `rng`, règles pures |
| Bac à sable / jouet | Townscaper, Powder Toy | faible à moyen | bon | outils de création, partage |

### E. Rôle, cartes et roguelite

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Roguelite de cartes / deckbuilder | Slay the Spire, Frères de la Côte, Balatro | moyen | très bon | règles pures, simulateur d'équilibrage, partie / méta séparées |
| Roguelike / dungeon crawler | Brogue, Shattered Pixel Dungeon | moyen | très bon | `rng`, génération, tour par tour |
| RPG / JRPG | Final Fantasy (2D), Undertale | élevé | bon | dialogues, combats, atelier de textes |
| Action-RPG | Diablo-like | élevé | moyen | loot en données, équilibrage |
| Auto-battler | Super Auto Pets | moyen | très bon | règles pures, simulation en masse |
| Jeu de plateau numérique | Catan, échecs variantes | moyen | très bon | règles pures, IA, tests |
| Solitaire / patience | Balatro, Solitairica | faible | très bon | règles pures, `rng` |
| Survie / craft | Don't Starve, Terraria | élevé | moyen | recettes en données, sauvegarde lourde |

### F. Social, famille, éducatif

| Genre | Exemples | Coût | Mobile | Ce qui compte |
|---|---|---|---|---|
| Jeu enfant (sans lecture) | Factokid, Toca Boca | moyen | très bon | cibles 48 px, aucun texte indispensable, aucun échec |
| Éducatif / sérieux | DragonBox, Kerbal (léger) | moyen | bon | progression mesurée, retours |
| Jeu en famille sur un écran | Croiseur, Overcooked (local) | moyen | bon (passer le téléphone) | tour par tour, `gamepad` plusieurs manettes |
| Party game | Jackbox (local) | moyen | bon | plusieurs pointeurs, sessions courtes |
| Jeu de quiz / trivia | — | faible | très bon | contenu en données, `i18n` |
| Jeu de création / dessin | Drawful, Mario Paint | moyen | bon | outils de dessin, export |

### G. Formes particulières

| Forme | Exemples | Ce qui compte |
|---|---|---|
| Jeu d'une minute / micro-jeu | WarioWare | sessions très courtes, enchaînement |
| Jeu quotidien | Wordle | graine du jour (`rng`), partage du résultat |
| Jeu à contrainte (une touche, un bouton) | Flappy Bird | une seule commande, tout dans le rythme |
| Jeu-jouet sans but | Proteus, Townscaper | pas d'objectif, plaisir du geste |
| Jeu épistolaire / documentaire | Her Story | données réelles, textes |
| Jeu en ASCII / texte | Dwarf Fortress (texte), Candy Box | rendu en caractères, DOM |

---

## 2. Vue (caméra)

| Vue | Exemples | Remarque |
|---|---|---|
| De côté (2D) | plateforme, Croiseur | la plus simple pour le pixel art |
| De dessus (top-down) | Zelda, Factokid, Kingvi | grilles et cartes faciles |
| Isométrique / 3/4 | Pierre (v1), Into the Breach | tri arrière → avant à gérer |
| 3D, caméra libre ou orbitale | Pierre (v2) | three.js, coupe des obstacles |
| 3D première personne | Iron Lung | three.js, coût élevé |
| Plateau / table (cartes, pions) | Frères de la Côte | DOM ou canvas, pas de caméra |
| Écran fixe / tableau | Pac-Man, puzzles | une scène = un écran |
| Interface seule (texte, menus) | A Dark Room | DOM |

## 3. Rendu

| Rendu | Profil technique | Jeux du studio |
|---|---|---|
| Pixel art 2D, canvas | `profils/pixel-2d-canvas.md` | Factokid, Croiseur |
| Pixel art 2D, Phaser | `profils/pixel-2d-phaser.md` | Kingvi |
| Pixel art 3D / low-poly pixelisé, three.js | `profils/pixel-3d-three.md` | Pierre et les rats |
| 3D low-poly ou voxel, three.js | `profils/pixel-3d-three.md` (sans la contrainte pixel) | — |
| Vectoriel / formes générées (canvas ou SVG) | `profils/vectoriel.md` | navires de Frères |
| Illustré / dessin à la main (images) | `profils/vectoriel.md` + atelier d'import | — |
| DOM / cartes / interface | `profils/dom-cartes.md` | Frères de la Côte |
| Texte / ASCII | `profils/dom-cartes.md` | — |

## 4. Public

| Public | Conséquences |
|---|---|
| Enfant non lecteur (4-7 ans) | cibles de 48 px, aucun texte indispensable, aucun échec, aucune urgence |
| Enfant lecteur (8-12 ans) | textes courts, tutoriel par le geste, peur dosée |
| Famille, à plusieurs | tour par tour ou un écran partagé, règles qu'on explique en une phrase |
| Joueur occasionnel | sessions de 5 à 15 min, reprise immédiate |
| Joueur averti | profondeur, difficulté, peu de tutoriel |
| Tous publics, contemplatif | lenteur assumée, peu d'interface |

## 5. Forme d'une session

| Forme | Conséquence sur la sauvegarde |
|---|---|
| Partie courte qui recommence (arcade, roguelite) | partie jetable + progression permanente séparée |
| Partie longue continue (aventure, gestion) | une sauvegarde, automatique, robuste aux mises à jour |
| Niveaux (puzzle, plateforme) | niveaux réussis + meilleurs scores |
| Quotidien | graine du jour + historique |
| Sans fin (idle, bac à sable) | état continu, temps hors ligne à décider |

## 6. Hybrides

Un jeu peut combiner deux genres, par exemple :

- Croiseur = tactique au tour par tour + roguelite ;
- Pierre = jouet / nuée + exploration.

Le prompt de démarrage pose alors le genre en **sélection multiple**, puis
demande lequel porte **la boucle principale** : c'est elle que le lot minimal
construit.
