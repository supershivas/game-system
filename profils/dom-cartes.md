# Profil — DOM, cartes, interface, texte

Jeu du studio : **Frères de la Côte** (roguelite naval en cartes, sur
téléphone). Convient aussi aux fictions interactives, visual novels, jeux de
plateau, idle, quiz, jeux en texte ou ASCII.

## Quand le choisir

- Le jeu est surtout des **éléments d'interface** : cartes, boutons, textes,
  jauges, plateau.
- Accessibilité et texte net comptent plus que l'animation de milliers
  d'objets.

## Stack

- Vanilla JS, modules ES, aucune dépendance, aucun asset image obligatoire
  (Frères génère ses navires à l'exécution sur de petits canvas).
- CSS en couches : variables, composants, écrans. Un composant n'a **qu'une
  définition** ; un écran s'écrit `.screen.mon-ecran` (spécificité).
- Animations : CSS ou Web Animations API ; `prefers-reduced-motion` respecté.

## Structure (d'après Frères)

```
index.html            le jeu
apercu-telephone/     le même dans un cadre de téléphone (iframe srcdoc)
css/  variables.css components.css <écrans>.css
src/
  regles.js           les règles, PURES, sans DOM ni hasard
  data.js             chargement de data/*.json
  ecrans/             un module par écran
  fx.js               ce qui vole (dans le décor, jamais en position: fixed)
data/                 tout le contenu : cartes, ennemis, paliers
test/                 node test/run.js
tools/                audit mobile, contraste, playtest automatique
```

Règles qui ont fait leurs preuves :

- **Les règles sont pures** : aucune entropie dans la résolution ; le battage
  prend un `rng` en argument. Un test échoue si `Math.random` ou `Date.now`
  apparaît dans le module des règles.
- **Le contenu est de la donnée** : ajouter une carte = zéro ligne de code.
- **Les ordres sont des gestes** (pousser une carte vers le haut), doublés au
  clavier ; seuil de glissement = taille d'une cible (44 px).
- **Le score se joue en séquence** pour que le joueur voie d'où viennent ses
  points.
- **Les chiffres sont mesurés** par simulation (skill `equilibrage`).

## Pièges

- `overflow-x: hidden` ampute en silence : audit d'écran obligatoire.
- Capturer le pointeur trop tôt mange le `click` suivant.
- Une bulle dont la largeur dépend d'un texte qui change tremble : réserver le
  pire cas.
- Un libellé sur un fond animé : plaque opaque.
