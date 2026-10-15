import { etapeA, avancer } from '../labo-timeline.js';

group('labo-timeline');
const E = [{ t: 0, nom: 'Calme' }, { t: 6, nom: 'Préparation' }, { t: 14, nom: 'Sortie' }];
test('etapeA : la dernière étape commencée', () => {
  assert.equal(etapeA(E, 0), 0);
  assert.equal(etapeA(E, 5.99), 0);
  assert.equal(etapeA(E, 6), 1);
  assert.equal(etapeA(E, 99), 2);
});
test('avancer : joue, boucle et borne', () => {
  assert.equal(avancer(1, 0.5, 10).t, 1.5);
  assert.equal(avancer(9.5, 1, 10).t, 0.5);
  assert.deepEqual(avancer(9.5, 1, 10, { boucle: false }), { t: 10, fini: true });
  assert.equal(avancer(1, 1, 10, { vitesse: 2 }).t, 3);
  assert.equal(avancer(0.5, -1, 10).t, 9.5);
  assert.deepEqual(avancer(0.5, -1, 10, { boucle: false }), { t: 0, fini: true });
});
