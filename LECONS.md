# Leçons — les pièges déjà rencontrés

Chaque entrée a coûté un bug, une mesure ou une refonte dans un des jeux.
Entre parenthèses, le jeu d'origine. Quand une leçon devient une règle, elle
passe dans `CONVENTIONS.md` et reste ici avec son histoire.

## Déploiement et chargement

- **`node --check x.js` ne vérifie pas un module ES** : le fichier n'est pas
  lu comme un module, et une erreur peut passer. Utiliser
  `node --input-type=module --check < x.js`. Une apostrophe dans une chaîne a
  ainsi cassé tout un écran sans que `--check` la voie. (Kingvi)
- **Cache de GitHub Pages (dix minutes)** : après une mise à jour, le
  navigateur mélangeait anciens et nouveaux modules, et le jeu tournait avec
  l'ancien code pendant que le labo avait le nouveau. D'où l'estampille
  `?v=X.Y.Z` sur tous les imports (`outils/stamp-version.mjs`). (Kingvi)
- **Police chargée depuis un CDN** : un échec de chargement silencieux a fait
  perdre tout le rendu pixel. Police auto-hébergée, et **jamais remplacée par
  une copie fraîche** si elle a été corrigée à la main (glyphes accentués
  reconstruits). (Croiseur)
- **Bibliothèque par CDN** : le jeu doit charger même si le CDN tombe, et sur
  Steam il n'y a pas de CDN. Phaser, three.js, Motion : copiés dans `vendor/`.
  (Kingvi, Pierre, Factokid)
- **Une page autonome qui concatène les modules** partage une seule portée :
  deux `const scene` donnent une page blanche. L'outil d'assemblage doit
  échouer sur un nom déclaré deux fois. (Frères)
- **Couper le squelette HTML d'une page qui en contient une autre** (iframe
  `srcdoc`) : prendre le corps jusqu'au **dernier** `</body>`, sinon on livre
  le jeu sous le nom de l'aperçu. (Frères)
- Un fichier construit à la main et commité finit toujours par dater d'une
  version que plus personne ne peut retrouver : les fichiers construits se
  refont dans le workflow, pas dans le dépôt. (Frères)

## Écran et rendu

- **Rendu en pixels physiques** : sans tenir compte de `devicePixelRatio`, sur
  un écran à 125 %, les pixels du jeu tombent entre deux pixels de l'écran et
  dessinent des bandes. (Kingvi)
- **Échelle non entière** : à ×1,4, les pixels n'ont plus tous la même
  largeur et une image se décentre dans son bouton. Échelle entière, toujours,
  y compris pour une icône dans une touche. (Factokid)
- **`overflow-x: hidden` ampute en silence** : pas d'ascenseur, pas d'erreur,
  51 % du plateau hors de l'écran. Jamais de largeur fixe en pixels ;
  `outils/audit-ecran.mjs` le détecte. (Frères)
- **`transform: scale()` pour un aperçu téléphone ment** sur les media
  queries, `innerWidth` et la taille réelle des cibles. Aperçu = `iframe` à
  la vraie taille. (Frères)
- **`position: fixed` sous un ancêtre transformé** n'est plus fixé à l'écran :
  un projectile était dessiné un écran plus bas, à chaque tir, depuis le
  premier jour. Ce qui vole appartient au décor, en coordonnées relatives à
  lui. (Frères)
- **Une boîte dont la taille dépend d'un texte qui change** grandit et
  rétrécit sous les yeux. Réserver la largeur du pire cas mesuré. (Frères)
- **Ne jamais tirer une valeur stable d'une entrée qui bouge** : un canvas
  dimensionné d'après son parent, qui l'était d'après le canvas, rétrécissait
  à chaque image ; une forme tirée d'une position qui dérive clignotait. Une
  forme vient d'une graine, une mesure se prend une fois. (Frères, trois fois)
- **Une trame (dithering) s'accroche au monde**, jamais à l'objet qui bouge :
  sinon toute la trame glisse et scintille à chaque pixel de marche. (Kingvi)
- **Une masse translucide se peint en une fois** : six ellipses
  semi-transparentes empilées se lisent comme six bulles, pas comme un nuage.
  (Frères)
- **Un libellé sur un fond animé porte une plaque opaque**, pas une ombre :
  un `text-shadow` tenait à 1,46:1 sur un ciel clair. (Frères)
- **Dessiner pixel par pixel avec `fillRect` dans une boucle chaude** est trop
  lent (150 000 pixels pour une forêt) : préparer sur un canvas caché,
  découper les gros travaux, ne rien dessiner hors de la vue. (Kingvi)
- **`getImageData` peut être bloqué** par des extensions anti-pistage : la
  carte du labo ne s'affichait plus. Préparer sur un canvas caché et recopier
  par `drawImage`, ne jamais relire les pixels. (Kingvi)
- **Un sprite généré se dessine avec sa palette** : passer une couleur unique
  fait tomber chaque lettre inconnue sur cette couleur, et l'objet sort en
  aplat, sans erreur. (Frères)
- **Une grille CSS prend la largeur de son contenu** : une colonne implicite
  vaut `auto`, donc le contenu le plus large (une rangée de boutons, un
  en-tête) élargit toute la page, qui se coupe à droite sans ascenseur.
  `grid-template-columns: minmax(0, 1fr)` sur les grilles de mise en page.
  L'audit d'écran ne le voit pas quand la zone coupée défile : regarder les
  captures. (game-system, atelier du jeu de départ)
- **Le nom du jeu dans une chaîne JS** : « Étoiles d'essai » entre
  apostrophes a cassé le labo. Le nom se lit dans la page (`document.title`),
  jamais recopié dans le JS. (game-system, installeur)
- **Le noir pur** : remplacé par un bleu nuit dans Kingvi, l'écran gagne en
  profondeur. À considérer dans toute palette sombre. (Kingvi)

## Phaser (3.90)

- `RenderTexture.resize` ne redimensionne pas la surface de dessin : recréer
  la texture, en filtrage au plus proche. (Kingvi)
- Une image dont la texture a été retirée fait planter le rendu, et la boucle
  s'arrête (écran figé). Retirer une texture en détruisant d'abord ses images ;
  la boucle attrape les erreurs. (Kingvi)
- `scene.time.now` n'est pas accéléré par un `timeScale` de debug : lire le
  temps par la boucle du jeu. (Kingvi)
- Redimensionner le canevas avec `Scale.NONE` : `game.scale.resize`, puis
  recaler la caméra. (Kingvi)

## three.js

- Pour une palette exacte : `ColorManagement` coupé, sortie linéaire, et
  textures d'**indices de palette** lues par un shader. (Pierre)
- Un objet entre la caméra et le héros doit se **couper** (muret) ou se
  tramer, sinon on perd le héros. (Pierre)
- Performances mesurées sans carte graphique : 3 000 entités ≈ 5 ms de
  simulation ; le nombre d'appels de dessin domine (instancier). (Pierre)
- Garder un moteur 2D de secours (navigateur sans WebGL, `?moteur=2d`) coûte
  cher sur une grande carte : à décider tôt. (Pierre)

## Commandes et gestes

- **`event.key` pour se déplacer** casse ZQSD en AZERTY : se déplacer par
  `event.code`, nommer une commande par `event.key`. (Kingvi)
- **Recherche automatique de Firefox** : une lettre sans effet ouvre la
  recherche par-dessus le jeu. Retenir toute touche imprimable hors des champs
  de saisie. (Kingvi, Factokid)
- **`setPointerCapture` au `pointerdown`** redirige aussi le `click` suivant :
  plus aucune seconde sélection possible, sans erreur. Capturer au
  franchissement du seuil de glissement. (Frères)
- **Appui long, pince, tirer vers le bas** : loupe iOS, menu « copier »
  Android, zoom de la page, rechargement. Tous refusés au jeu, en un seul
  endroit. (Factokid)
- **Le geste qui part d'un élément non choisi** est le cas le plus courant :
  il doit faire l'action entière, pas demander deux gestes. (Frères)
- **Un tutoriel qui cible « la sélection courante »** se trompe dès que le
  joueur clique ailleurs : capturer les objets visés au démarrage. (Croiseur)

## Simulation et règles

- **Boucle sans plafond de rattrapage** : une image longue fait simuler plus,
  donc dure plus, et la boucle s'emballe. Plafonner le retard rattrapé.
  (Factokid)
- **Files compressées pour les convoyeurs** : stocker des espacements, pas une
  position par objet. C'est la performance et l'accumulation gratuites.
  (Factokid)
- **Entropie dans la résolution** : `Math.random` ou `Date.now` dans une règle
  rend tout test et toute mesure impossible. Un test échoue s'ils y
  apparaissent, même en commentaire. (Frères)
- **On pioche avec `pop()`** : une carte posée par `unshift` part au fond et
  n'arrive jamais. (Frères)
- **Un objet est dans exactement une zone** (pioche, main, défausse) : retirer
  sans poser le fait disparaître, poser sans retirer le duplique. Un test des
  zones le tient. (Frères)
- **Un monde déterministe** : toute modification qui consomme le générateur
  aléatoire déplace tout ce qui vient après. (Kingvi)
- **« Branché pour l'œil, mort pour la simulation »** : la seule panne qu'on ne
  voit pas en jouant. Un juge des invariants partagé par les tests et la
  sauvegarde. (Factokid)
- **Deux listes d'invariants finissent toujours par diverger** : un seul juge,
  importé partout. (Factokid)

## Sauvegarde

- `pagehide` sauvegarde la partie : pour tester une position, écrire la
  sauvegarde **avant** le chargement, sinon elle est écrasée. (Kingvi)
- Une partie relue doit être **la même** (objets vivants comparés) et **se
  comporter pareil** (les deux tournent dix secondes et restent identiques).
  (Factokid)
- Partie en cours et état permanent : deux structures, deux clés, dès le
  premier commit. (Factokid)
- Un accesseur (`get x()`) passé dans `Object.assign` est évalué une fois :
  l'état copié ne suit plus. (Kingvi)

## Design et équilibrage

- **Un chiffre se mesure, il ne se choisit pas** : chaque échelle choisie à
  l'œil a dû être refaite. Mêmes graines des deux côtés, la distribution
  (p25, médiane, p75) plutôt que la moyenne, trois familles de graines.
  (Frères)
- **Un joueur appliqué doit battre un joueur maladroit de beaucoup** (86 contre
  0 sur 100) : sinon le jeu n'est qu'une addition qu'on exécute. (Frères)
- **Sept systèmes, il a fallu en retirer six.** Avant d'ajouter, demander ce
  qu'on retire ; un système qu'il faut rattraper par une exception est à
  retirer. (Frères)
- **La boucle doit tenir avec trois éléments** (trois machines, trois cartes)
  : si elle n'est amusante qu'à quinze, elle s'effondrera en grossissant.
  (Factokid)
- **Le jeu grossit par la donnée, jamais par le système.** (Factokid)
- **Un retour à chaque geste, dans la même image** : un appui sans effet
  visible est vécu comme une panne. (Factokid)
- **Une alerte ne sort que là où la chaîne s'arrête pour de bon**, après un
  délai qui ignore les à-coups normaux (4 s, pas 1,2 s). (Factokid)
- **Le score se joue en séquence** (chaque carte, le nom de la figure, puis le
  total) : le joueur voit d'où viennent ses points et apprend le barème sans
  explication. ~1,6 s au plus. (Frères)
- **Pas de quête de livreur, pas de tutoriel bavard, pas de bavardage** : les
  playtests de Kingvi ont montré que le paysage raconte mieux. (Kingvi)
- **Un playtest qui ne visite que des écrans morts** rassure sur la mauvaise
  moitié : un instrument mesure ce qui est vivant. (Frères)
- **Un `CLAUDE.md` qui décrit trois jeux dont deux sont morts** ne dit plus
  lequel il faut construire : archiver ce qui est retiré. (Frères, Factokid :
  trois modules « fantômes » documentés au présent pendant des semaines)

## Outils et conteneur

- Le conteneur n'a pas de carte graphique : ~25 images/s pour Kingvi, ~7 à 10
  en Phaser lourd. Comparer les FPS d'une version à l'autre, jamais en absolu.
- Playwright est installé globalement (`/opt/node22/lib/node_modules/playwright`)
  et Chromium dans `/opt/pw-browsers` : ne pas lancer `playwright install`.
  Les outils de game-system trouvent l'un et l'autre tout seuls.
- Un script de test jetable ne se commite jamais (un `t.mjs` l'a été par
  accident) : scratchpad, ou dossier du run de playtest.

---

## Sessions économes

Un `CLAUDE.md` de 150 ko (≈ 40 000 tokens) est relu à chaque tour. Le cache de
prompt le facture à ~10 % du prix, donc le gain en argent est modeste ; le vrai
gain est un contexte moins dilué, moins de compactions et moins de réécritures
de cache quand il expire. Ce qui a marché (Cyclopéen, 152 ko → 15 ko) :

1. **Découper `CLAUDE.md` par domaine, sans réécrire.** Garder à la racine
   (~10 à 15 ko) : description, palette, échelle, commandes, stack, une ligne
   par module, mode debug, vérifications, exceptions, ce qui a été retiré, et un
   **index « Où lire quoi »** (tableau : fichiers touchés → fichier à lire).
   Le reste (décisions datées, mesures, pièges et leur coût) va dans
   `docs/domaines/<domaine>.md`, **texte inchangé**. Un piège nouveau s'écrit
   dans le fichier de son domaine. `node outils/decouper-claude-md.mjs --liste`
   puis `plan.json` : l'outil déplace les blocs et vérifie qu'aucune ligne ne se
   perd. Compter une demi-heure ; le plus long est de ranger les blocs.
2. **Un `CLAUDE.md` par dossier** (`js/rendu/CLAUDE.md` = `@../../docs/domaines/rendu.md`) :
   chargé seulement quand on lit un fichier de ce dossier. Il ne marche que pour
   les domaines qui ont un dossier à eux ; les autres passent par l'index.
3. **Alléger `conventions-jeu.md`** (≈ 28 ko, importé partout) : garder le
   « Socle » dans le fichier importé, et lire les sections de labo, d'atelier,
   de Steam et d'agents seulement quand la tâche les touche. À faire ici
   (`CONVENTIONS.md` est la source) : le sync copie un seul fichier, il faudrait
   en copier deux.
4. **Les procédures longues en skills** (changer de version et estampiller,
   ajouter une variante au labo, réécrire les références d'empreinte, mesurer un
   équilibrage) : une ligne de description jusqu'à l'appel, au lieu du texte
   dans `CLAUDE.md`.
5. **Fermer les lectures coûteuses** : `permissions.deny` sur `vendor/**`,
   `captures/**` et les JSON d'empreinte dans `.claude/settings.json` ; lire les
   gros fichiers par plages (`offset`/`limit`) ou avec Grep.
6. **Sorties d'outils courtes** : un script de test qui imprime « OK » ou les
   écarts, ou `| tail -20`. Un test verbeux relu à chaque tour coûte plus cher que
   `CLAUDE.md`. Ne lancer que les vérifications que le changement touche
   (les règles seules pour une règle ; l'empreinte du dessin seulement si le
   dessin a bougé).
7. **Hygiène de session** : une tâche par session ; les recherches larges à un
   sous-agent d'exploration (seul le résumé revient) ; un modèle plus léger et
   un effort réduit pour une retouche de CSS, de texte ou de version.
8. **Moins de tours de permission** : la skill `fewer-permission-prompts` tire
   une liste d'autorisations des transcripts.

Piège de la découpe : `CLAUDE.md` n'est plus tout-en-un, donc une règle écrite
dans le mauvais fichier est oubliée. D'où l'index en tête et la règle « avant de
toucher à un domaine, lire son fichier ». (Cyclopéen)

## Réaligner les jeux existants

Ce que chaque jeu gagnerait à reprendre de game-system (sans urgence, à faire
quand on retouche le jeu) :

| Jeu | À reprendre |
|---|---|
| **Kingvi** | `sync-game-system.sh` à la place de `sync-design-system.sh` ; `.claude/conventions-jeu.md` ; modules `rng`, `save` (sauvegarde versionnée) ; `outils/audit-ecran.mjs` |
| **Pierre et les rats** | idem Kingvi ; `debug.js` (aujourd'hui seulement `pierreStats()`) ; `test/` pour `city.walk` et le générateur |
| **Factokid** | `version.json` + `CHANGELOG.md` + `app-update.js` à la place de `src/data/version.js` et `src/maj.js` ; écran titre et réglages (version, changelog, export) ; `stamp-version` |
| **Croiseur** | `version.json` + `app-update.js` à la place de `src/version.js` et de la modale maison ; `save.js` ; `rng.js` ; mode debug par `?debug=1` plutôt que Ctrl+Maj+D ; `DESIGN.md` |
| **Frères de la Côte** | `version.json` + `CHANGELOG.md` ; écran titre et réglages ; `save.js` ; `keys.js` |
