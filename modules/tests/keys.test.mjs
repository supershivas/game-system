import { keyIs } from '../keys.js';

group('keys');
const ev = (key, code, extra = {}) => ({ key, code, ctrlKey: false, metaKey: false, altKey: false, repeat: false, ...extra });
test('une commande se lit par la lettre écrite', () => {
  assert.ok(keyIs(ev('m', 'Semicolon'), 'm'));      // M d'un clavier AZERTY
  assert.ok(!keyIs(ev('q', 'KeyA'), 'a'));          // la touche physique A d'un AZERTY écrit « q »
});
test('repli sur la touche physique hors alphabet latin', () => {
  assert.ok(keyIs(ev('ь', 'KeyM'), 'm'));
});
test('ni modificateur ni répétition', () => {
  assert.ok(!keyIs(ev('m', 'KeyM', { ctrlKey: true }), 'm'));
  assert.ok(!keyIs(ev('m', 'KeyM', { repeat: true }), 'm'));
});
test('touches nommées', () => {
  assert.ok(keyIs(ev('Escape', 'Escape'), 'Escape'));
  assert.ok(keyIs(ev(' ', 'Space'), 'Space'));
});
