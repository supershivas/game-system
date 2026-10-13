// Les règles : du JS pur, sans DOM, sans hasard ni horloge du navigateur (sections 10 et 12).
// Même graine, mêmes entrées → même partie. Se teste dans Node (test/).
import { createRng } from './lib/rng.js';
import { REGLAGES } from './data/reglages.js';

export function nouvellePartie(seed = 1, reglages = REGLAGES) {
  const rng = createRng(seed);
  const { largeur, hauteur } = reglages.monde;
  const etat = {
    seed,
    rng: 0,
    heros: { x: largeur / 2, y: hauteur / 2, dir: 1 },
    etoiles: [],
    score: 0,
    temps: 0,
  };
  for (let i = 0; i < reglages.etoiles.nombre; i++) etat.etoiles.push(placer(rng, reglages));
  etat.rng = rng.state;
  return etat;
}

function placer(rng, reglages) {
  const { largeur, hauteur } = reglages.monde;
  return { x: rng.int(16, largeur - 16), y: rng.int(16, hauteur - 16) };
}

// entree : { x: -1..1, y: -1..1 } (clavier, manette) ou { cible: { x, y } } (doigt)
// rend la liste des événements de ce pas ([{ type: 'etoile', ... }])
export function avancer(etat, dt, entree = {}, reglages = REGLAGES) {
  const evenements = [];
  const h = etat.heros;
  let dx = entree.x || 0, dy = entree.y || 0;
  if (entree.cible) {
    dx = entree.cible.x - h.x; dy = entree.cible.y - h.y;
    if (Math.hypot(dx, dy) < 2) { dx = 0; dy = 0; }
  }
  const n = Math.hypot(dx, dy);
  if (n > 0) {
    const v = reglages.heros.vitesse * dt;
    h.x = Math.max(0, Math.min(reglages.monde.largeur, h.x + (dx / n) * v));
    h.y = Math.max(0, Math.min(reglages.monde.hauteur, h.y + (dy / n) * v));
    if (dx) h.dir = Math.sign(dx);
  }
  const rng = createRng(etat.seed);
  rng.setState(etat.rng);
  etat.etoiles = etat.etoiles.map(e => {
    if (Math.hypot(e.x - h.x, e.y - h.y) > reglages.etoiles.rayon + 3) return e;
    etat.score++;
    evenements.push({ type: 'etoile', x: e.x, y: e.y, score: etat.score });
    return placer(rng, reglages);
  });
  etat.rng = rng.state;
  etat.temps += dt;
  return evenements;
}
