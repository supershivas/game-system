import { createStore, memoryBackend } from '../save.js';

group('save');
const entries = {
  save: { version: 3, migrations: { 1: d => ({ ...d, loups: [] }), 2: d => ({ ...d, v3: true }) } },
  prefs: { version: 1, debugWrites: false, defaults: { musique: 70, effets: 80 } },
};
test('écrire puis relire', () => {
  const s = createStore({ game: 'essai', entries, backend: memoryBackend() });
  s.save('save', { x: 1 });
  assert.deepEqual(s.load('save'), { x: 1 });
});
test('une sauvegarde ancienne est migrée', () => {
  const backend = memoryBackend({ 'essai:save': JSON.stringify({ v: 1, data: { x: 2 } }) });
  const s = createStore({ game: 'essai', entries, backend });
  assert.deepEqual(s.load('save'), { x: 2, loups: [], v3: true });
});
test('une donnée sans enveloppe est lue comme la version 1', () => {
  const backend = memoryBackend({ 'essai:save': JSON.stringify({ x: 3 }) });
  const s = createStore({ game: 'essai', entries, backend });
  assert.deepEqual(s.load('save'), { x: 3, loups: [], v3: true });
});
test('les valeurs par défaut complètent les réglages', () => {
  const s = createStore({ game: 'essai', entries, backend: memoryBackend() });
  assert.deepEqual(s.load('prefs'), { musique: 70, effets: 80 });
  s.save('prefs', { musique: 10 });
  assert.deepEqual(s.load('prefs'), { musique: 10, effets: 80 });
});
test('en debug : autres clés, réglages jamais écrits', () => {
  const backend = memoryBackend();
  const s = createStore({ game: 'essai', entries, backend, debug: true });
  s.save('save', { x: 1 });
  assert.equal(s.save('prefs', { musique: 1 }), false);
  assert.deepEqual(backend.keys(), ['essai:debug:save']);
});
test('export puis import, sans les secrets', () => {
  const a = createStore({ game: 'essai', entries, backend: memoryBackend(), secret: ['gh-token'] });
  a.save('save', { x: 5 });
  a.setSecret('gh-token', 'abc');
  const dump = a.exportAll();
  assert.ok(!('gh-token' in dump.entries));
  const b = createStore({ game: 'essai', entries, backend: memoryBackend() });
  assert.equal(b.importAll(dump), 1);
  assert.deepEqual(b.load('save'), { x: 5 });
});
test("l'import refuse la sauvegarde d'un autre jeu", () => {
  const s = createStore({ game: 'essai', entries, backend: memoryBackend() });
  assert.throws(() => s.importAll({ game: 'autre', entries: {} }));
});
test('une donnée illisible rend les valeurs par défaut', () => {
  const backend = memoryBackend({ 'essai:prefs': '{pas du json' });
  const s = createStore({ game: 'essai', entries, backend });
  assert.deepEqual(s.load('prefs'), { musique: 70, effets: 80 });
});
