# Design system des jeux — à définir

> **Statut : chantier ouvert.** Rien ici n'est encore une règle. Les règles
> d'identité visuelle déjà en vigueur sont dans `CONVENTIONS.md` (sections 5
> à 7). Ce fichier rassemble ce qu'on sait, pour décider ensuite.

Le design system des apps (`supershivas/design-system`) vise la **parité** :
toutes les apps se ressemblent. Pour les jeux, ce sera différent : chaque
jeu a son identité propre. Le design system des jeux doit donc fixer
**comment** on construit une identité (palette, échelle, typographie,
composants d'interface), plus que **quelle** identité.

## 1. Ce que les cinq jeux ont déjà en commun

| Sujet | Kingvi | Pierre | Factokid | Croiseur | Frères |
|---|---|---|---|---|---|
| Palette | 3 couleurs (neige, nuit, rouge) | 3 tons (bleu nuit, blanc, noir) | 16 (Sweetie 16) | thème espace (cyan, vert, or, bleu, rouge) | palette par navire, générée |
| Police d'identité | Grenze Gotisch | IM Fell English | fonte bitmap 5 × 7 maison | Press Start 2P, locale, corrigée | — |
| Boutons de l'écran titre | lambeaux de neige en pixels | design-system | « plaques » dessinées sur canvas | `button.jouer`, bordure basse | cartes, bois |
| Réglages | dalle de pierre en pixels | design-system | menu pause dans le jeu | modale `.modal` | — |
| Échelle de référence | viking ≈ 9 px, écran ≈ 280 px | 1 px = 5 cm, Pierre 13 × 26 | 360 × 640 logique, tuile 24, cellule 48 | variables `--fs-*`, `--space-*`, `--radius-*` | 375 × 667 |
| Page de référence | labo | `echelle.html` | `labo/` (planches) | `design-system.html` | `design-system.html` |
| Vérification | — | — | `lisibilite.mjs` (contraste, silhouettes, échelle entière) | — | `contrast-audit.mjs`, `mobile-audit.mjs` |

Constats :

- Tous ont une **palette fermée** et une **échelle de référence** ; aucun ne
  partage ses valeurs avec un autre, et c'est voulu.
- Les **composants d'interface** (bouton, modale, toast, curseur de volume,
  réglages) sont refaits dans chaque jeu, à chaque fois différemment.
- Deux jeux ont inventé seuls une **page de design system** vivante
  (`design-system.html`), deux autres une planche (labo, échelle).
- La **lisibilité** n'est mesurée que dans deux jeux.

## 2. Les pistes

### Piste A — un squelette commun, une peau par jeu

Les **composants** (bouton, modale, toast, curseur, réglages, écran titre,
barre de vie, bulle de dialogue) ont une structure HTML/CSS commune, et
chaque jeu les habille par des **jetons** (`--jeu-fond`, `--jeu-encre`,
`--jeu-accent`, `--jeu-police`, `--jeu-bord`…). Un fichier `game-ui.css`
partagé, un `theme.css` par jeu.

### Piste B — une méthode, pas des composants

game-system ne fournit que la **méthode** : comment choisir une palette
(taille, contraste mesuré, test en niveaux de gris), comment fixer
l'échelle, et une page `design-system.html` modèle que chaque jeu remplit.
Les composants restent propres à chaque jeu.

### Piste C — A + B

La méthode (B) pour l'identité, et des composants (A) seulement pour ce qui
n'est pas l'identité du jeu : réglages, labo, atelier, toasts techniques.

## 3. Ce qu'il faudra trancher

1. Piste A, B ou C.
2. Les **jetons** communs (noms, et lesquels sont obligatoires).
3. Les **palettes de départ** proposées par le prompt de démarrage
   (3 couleurs, PICO-8, Sweetie 16, Endesga 32, sur mesure…) et leur
   déclaration (`palette.js` + `palette.json` + export `.gpl`).
4. L'**échelle typographique** pour une police pixel (tailles entières
   seulement ? interlignage minimal ?).
5. La **page de référence** : `design-system.html` dans chaque jeu, ou un
   sujet du labo.
6. Les **icônes** de l'interface hors jeu : un jeu d'icônes commun
   auto-hébergé, ou dessinées par jeu.
7. Les **seuils de lisibilité** imposés à tous (`outils/lisibilite.mjs` :
   contraste 4,5 pour le texte, 3 pour un signe, silhouettes distinctes).
8. Ce qu'on garde du design system des apps pour le labo et l'atelier
   (aujourd'hui : en-têtes accent / sombre, pastilles des favicons).

## 4. Matière disponible pour décider

- `factokid/CLAUDE.md` §2 : la palette Sweetie 16, la fonte bitmap, les
  boutons-plaques, la règle « les sprites se reprennent, ils ne se refont
  pas », la lisibilité mesurée.
- `space-crusader/design-system.html` et `theme.css` : échelles
  typographiques, d'espacement et de rayon, raretés, modales, toasts.
- `frere-de-la-cote/design-system.html` et ses treize règles d'écran.
- `kingvi/DESIGN.md` (palette, « rien de géométrique ») et ses habillages en
  pixels (lambeaux, dalle, crans).
- `pierre-et-les-rats/echelle.html` : la planche d'échelle.
