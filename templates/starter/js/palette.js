// La palette du jeu : le SEUL endroit où vivent ses couleurs (section 5 des
// conventions). Une lettre par couleur : c'est l'alphabet des sprites.
// À remplacer par la palette choisie au démarrage, et à déclarer aussi dans
// la section Description du CLAUDE.md.
export const PALETTE = {
  n: '#14182e', // nuit — le fond
  g: '#3d4670', // ombre
  b: '#e9ecf5', // blanc bleuté — l'encre
  a: '#e0573e', // accent
};

// Les rôles, lus par le CSS (variables --jeu-*) et par le rendu
export const ROLES = {
  fond: PALETTE.n,
  ombre: PALETTE.g,
  encre: PALETTE.b,
  accent: PALETTE.a,
};
