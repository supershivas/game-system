# Prompt de base — nouveau jeu

À coller au début de la première session Claude Code d'un nouveau jeu, dans
son repo (vide ou presque). Seuls le nom, le repo et le pitch sont à
remplir : Claude Code pose tout le reste en questions à choix multiples.

---

Nouveau jeu : **[Nom du jeu]** (repo `supershivas/[repo]`).

Le pitch : [deux ou trois phrases : ce qu'on fait, ce qu'on ressent, pour qui.
Une référence si tu en as une (« un Zelda contemplatif », « Slay the Spire
en 5 minutes »).]

Avant d'écrire du code :

1. **Récupère game-system** et lis ce qu'il faut :
   ```
   git clone --depth 1 https://github.com/supershivas/game-system /tmp/game-system
   ```
   Lis `/tmp/game-system/CONVENTIONS.md` (elles s'appliquent à ce jeu ; suis
   leur section 25 « Nouveau jeu »), `GENRES.md`, `INSPIRATION.md`, le noyau de
   `MES-INSPIRATIONS.md` (mes inspirations à moi), `LECONS.md` et
   `DESIGN-SYSTEM.md` (il est encore à définir : n'invente pas de règle
   commune, choisis seulement ce qui est propre à ce jeu).

2. **Pose-moi les décisions** avec l'outil `AskUserQuestion`, en questions à
   choix multiples (2 à 4 options, jamais de question ouverte quand un choix
   suffit). Déduis les options de mon pitch et du catalogue `GENRES.md` :
   ne me propose pas une option absurde pour ce jeu, et mets en premier celle
   que tu recommandes, suffixée « (Recommandé) », avec sa raison en une phrase
   dans la description. Si je réponds « Other », prends ma réponse telle
   quelle. Cinq tours au plus, de 4 questions au plus :

   **Tour 1 — le jeu**
   - **Genre** (sélection multiple) : les 4 genres du catalogue les plus
     proches du pitch, toutes familles confondues (action, exploration et
     récit, réflexion, stratégie et gestion, rôle et cartes, famille et
     éducatif, formes particulières). Si j'en choisis plusieurs, demande au
     tour suivant lequel porte la **boucle principale**.
   - **Vue** : de côté, de dessus, isométrique, 3D caméra libre, première
     personne, plateau ou table, écran fixe, interface seule (les 4 plus
     plausibles).
   - **Public** : enfant non lecteur, enfant lecteur, famille à plusieurs,
     joueur occasionnel, joueur averti, tous publics contemplatif (les 4 plus
     plausibles).
   - **Forme d'une session** : partie courte qui recommence (avec ou sans
     progression permanente), partie longue continue, niveaux, quotidien,
     sans fin.
   - Si le pitch ne cite aucune référence, propose en plus 3 croisements
     tirés de `INSPIRATION.md` (une période ou un lieu, une œuvre pour
     l'image, un jeu pour la mécanique), dont au moins un croise le noyau de
     `MES-INSPIRATIONS.md`, en sélection multiple.

   **Tour 2 — l'image et le son**
   - **Rendu** : pixel 2D en canvas maison, pixel 2D avec Phaser, 3D
     pixelisée ou low-poly avec three.js, vectoriel / formes générées,
     illustré (images dessinées à la main), DOM / cartes / texte. Indique le
     profil technique correspondant (`profils/` de game-system) et ce qu'il
     coûte. Une bibliothèque (Phaser, three.js) est une dépendance : copiée
     dans `vendor/`, jamais de CDN.
   - **Palette** : 3 couleurs (Kingvi, Pierre), PICO-8 (16), Sweetie 16
     (Factokid), Endesga 32, sur mesure à partir d'une ambiance que je
     décris. Montre les couleurs proposées dans la description de chaque
     option (valeurs hexadécimales).
   - **Résolution logique et taille du héros** : 3 propositions cohérentes
     avec la vue et la cible (par exemple 320 × 180 et un héros de 16 px ;
     256 × 144 et 9 px ; 360 × 640 portrait et une tuile de 24).
   - **Son** : bruitages synthétisés seulement, musique en fichiers et
     bruitages synthétisés, musique générative, aucun son pour la v0.

   **Tour 3 — jouer**
   - **Cible** : téléphone en portrait, téléphone en paysage, bureau, les
     deux (cible principale + aperçu de l'autre).
   - **Commandes** (sélection multiple) : clavier, toucher / gestes au doigt,
     souris, manette. Précise pour chaque option ce que ferait le joueur.
   - **Langues** : français seulement, français + anglais (tout passe par
     `i18n.js` dès le premier jour).
   - **Horizon** : navigateur seulement, porte ouverte vers Steam
     (section 22 : rien de distant, manette, plein écran, toutes tailles de
     fenêtre).

   **Tour 4 — l'atelier du développeur**
   - **Labo** : dès la v0 (planche d'échelle, palette, sprites, sons,
     variantes), plus tard, jamais.
   - **Atelier** (sélection multiple) : dessins (éditeur de pixels),
     réglages chiffrés, placement sur la carte / niveaux, textes et
     dialogues. Rien coché = pas d'atelier pour l'instant.
   - **Outils de vérification** (sélection multiple) : tests des règles et
     de la sauvegarde (toujours recommandé), captures et audit d'écran,
     lisibilité (contraste, silhouettes), simulateur d'équilibrage, harnais
     de playtest.
   - **Équipe d'agents** : aucune, légère (game-designer, testeur
     fonctionnel, gardien du ton + skills), complète (designers, testeurs,
     joueurs fictifs, synthèse, commandes `/playtest`).

   **Tour 5 — le lot minimal** (adapte au jeu)
   - **Boucle principale** (si plusieurs genres) : laquelle construire d'abord.
   - **Lot minimal** (sélection multiple) : 3 à 4 briques plausibles, déduites
     du pitch, qui suffisent à prouver que le jeu est amusant.
   - **Critère de validation** : 2 à 3 critères mesurables possibles
     (« 200 objets à 60 images/s sur téléphone », « une partie dure 5 à
     8 minutes », « un joueur appliqué gagne 8 fois sur 10, un maladroit
     1 sur 10 »).
   - **Ce que le jeu refuse** (sélection multiple) : 4 refus plausibles
     pour ce jeu (pas de tutoriel bavard, pas de loot, aucun échec, aucune
     urgence, pas d'objectif affiché, pas de texte indispensable…).

   Résume mes choix en quelques lignes avant de commencer.

3. **Installe** avec le script de game-system, selon mes réponses :
   ```
   sh /tmp/game-system/templates/installer.sh --nom "[Nom du jeu]" --repo supershivas/[repo] \
      [--sans-labo] [--sans-atelier] [--agents aucun|leger|complet] [--sans-playtest]
   ```
   Puis :
   - retire de `js/lib/` les modules que le jeu n'utilisera pas (par
     exemple `i18n.js` en français seul, `gamepad.js` sans manette,
     `pixel-editor.js` sans atelier de dessins) et de `outils/` ce que je n'ai
     pas retenu ; ce qui reste suivra game-system à chaque session ;
   - si le rendu n'est pas « pixel 2D en canvas maison », adapte le jeu de
     départ en suivant le profil (`/tmp/game-system/profils/`) ; pour Phaser
     ou three.js, demande-moi l'accord pour la dépendance et copie la
     version du profil dans `vendor/` ;
   - remplace la palette (`js/palette.js`), la résolution (`main.js`), les
     sprites de départ, redessine `favicon.svg` (et les favicons du labo et
     de l'atelier), puis `node outils/icones.mjs` ;
   - remplis `CLAUDE.md` (Description complète : genre, vue, rendu, cible,
     public, session, Steam, palette, échelle, commandes) et `DESIGN.md`
     (intention, piliers, boucle, lot minimal et son critère, ce que le jeu
     refuse) avec mes réponses ; mets le lot minimal dans `ROADMAP.md` ;
   - si l'équipe est complète : crée 4 à 6 personas `joueur-*` à partir de
     `.claude/agents/joueur-persona.md`, adaptés au public choisi, puis
     supprime le modèle ;
   - `sh scripts/sync-game-system.sh` pour vérifier la synchronisation.

Ensuite, construis le **lot minimal**, et seulement lui : remplace le petit
jeu des étoiles du départ par la boucle principale, en gardant son squelette
(écran titre, réglages, sauvegarde versionnée, pause, mise à jour, mode
debug, labo, atelier). Les règles sont pures et testées (`test/`), le
contenu est dans `data/`. Vérifie (section 19 : tests, captures des deux
cibles sans erreur, audit d'écran, lisibilité), mets `version.json` en
`0.1.0`, `node outils/stamp-version.mjs`, et pousse sur `main`.

Rappelle-moi de régler GitHub Pages sur « GitHub Actions » (Settings → Pages
→ Source) au premier push, donne-moi les deux URL (le jeu et l'aperçu), et
propose-moi la ligne à ajouter au tableau des jeux du README de game-system.
