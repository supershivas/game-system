// Les règles du jeu, sans navigateur : node outils/test-run.mjs
import { readFileSync } from 'node:fs';
import { nouvellePartie, avancer } from '../js/game.js';
import { REGLAGES } from '../js/data/reglages.js';
import { SPRITES } from '../js/sprites-data.js';
import { PALETTE } from '../js/palette.js';
import { validateSprite } from '../js/lib/sprites.js';

group('règles');
test('même graine, même partie', () => {
  const a = nouvellePartie(42), b = nouvellePartie(42);
  for (let i = 0; i < 600; i++) { avancer(a, 1 / 60, { x: 1, y: 0.3 }); avancer(b, 1 / 60, { x: 1, y: 0.3 }); }
  assert.deepEqual(a, b);
});
test('le héros reste dans le monde', () => {
  const p = nouvellePartie(1);
  for (let i = 0; i < 2000; i++) avancer(p, 1 / 60, { x: -1, y: -1 });
  assert.equal(p.heros.x, 0);
  assert.equal(p.heros.y, 0);
});
test('ramasser une étoile la remplace et compte', () => {
  const p = nouvellePartie(3);
  const e = p.etoiles[0];
  p.heros.x = e.x; p.heros.y = e.y;
  const ev = avancer(p, 1 / 60, {});
  assert.equal(p.score, 1);
  assert.equal(ev[0].type, 'etoile');
  assert.equal(p.etoiles.length, REGLAGES.etoiles.nombre);
});
test('aucun hasard ni horloge dans les règles', () => {
  const src = readFileSync(new URL('../js/game.js', import.meta.url), 'utf8');
  assert.ok(!/Math\.random|Date\.now|performance\.now|crypto\./.test(src), 'game.js doit rester pur (section 10)');
});

group('sauvegarde');
test('une partie relue est la même, et se comporte pareil', () => {
  const a = nouvellePartie(9);
  for (let i = 0; i < 300; i++) avancer(a, 1 / 60, { x: 0.5, y: 1 });
  const b = JSON.parse(JSON.stringify(a));
  assert.deepEqual(b, a);
  for (let i = 0; i < 600; i++) { avancer(a, 1 / 60, { x: -1, y: 0.2 }); avancer(b, 1 / 60, { x: -1, y: 0.2 }); }
  assert.deepEqual(b, a);
});

group('dessins');
test('chaque sprite est dans la palette', () => {
  for (const [nom, rows] of Object.entries(SPRITES)) assert.deepEqual(validateSprite(rows, PALETTE), [], nom);
});
