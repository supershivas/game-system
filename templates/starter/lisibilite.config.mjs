// Configuration de node outils/lisibilite.mjs (voir l'en-tête de l'outil).
// Une paire de couleurs s'ajoute le jour où on la dessine.
import { PALETTE } from './js/palette.js';
import { SPRITES } from './js/sprites-data.js';

export default {
  palette: PALETTE,
  paires: [
    { avant: 'b', fond: 'n', role: 'texte', ou: 'score et menus' },
    { avant: 'a', fond: 'n', role: 'signe', ou: 'étoile sur le sol' },
    { avant: 'n', fond: 'b', role: 'texte', ou: 'boutons' },
  ],
  groupes: { objets: { heros: SPRITES.heros, etoile: SPRITES.etoile } },
  poses: [],
};
