import { createRng, hashSeed, hash2, dailySeed } from '../rng.js';

group('rng');
test('même graine, même suite', () => {
  const a = createRng(42), b = createRng(42);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
});
test('une graine texte vaut son hachage', () => {
  assert.equal(createRng('monde')(), createRng(hashSeed('monde'))());
});
test('int reste dans les bornes et les atteint', () => {
  const r = createRng(1), vus = new Set();
  for (let i = 0; i < 2000; i++) { const v = r.int(1, 6); assert.ok(v >= 1 && v <= 6); vus.add(v); }
  assert.equal(vus.size, 6);
});
test('shuffle garde les éléments', () => {
  const t = createRng(7).shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual([...t].sort((x, y) => x - y), [1, 2, 3, 4, 5, 6, 7, 8]);
});
test('fork ne dépend pas des tirages déjà faits', () => {
  const a = createRng(9), b = createRng(9);
  for (let i = 0; i < 50; i++) b();
  assert.equal(a.fork('loups')(), b.fork('loups')());
});
test('state et setState rejouent la suite', () => {
  const r = createRng(3); r(); r();
  const s = r.state, suite = [r(), r(), r()];
  r.setState(s);
  assert.deepEqual([r(), r(), r()], suite);
});
test('weighted respecte les poids', () => {
  const r = createRng(5); let a = 0;
  for (let i = 0; i < 4000; i++) if (r.weighted([{ v: 'a', w: 3 }, { v: 'b', w: 1 }]) === 'a') a++;
  assert.ok(a > 2800 && a < 3200, `a = ${a}`);
});
test('hash2 est stable et dans [0, 1[', () => {
  assert.equal(hash2(3, 4, 1), hash2(3, 4, 1));
  const v = hash2(-10, 99);
  assert.ok(v >= 0 && v < 1);
});
test('dailySeed : même jour, même graine', () => {
  assert.equal(dailySeed(new Date(2026, 9, 13, 8)), dailySeed(new Date(2026, 9, 13, 23)));
  assert.notEqual(dailySeed(new Date(2026, 9, 13)), dailySeed(new Date(2026, 9, 14)));
});
