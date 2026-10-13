import { createI18n } from '../i18n.js';

group('i18n');
const dict = { fr: { a: 'Bonjour {nom}', b: 'Oui' }, en: { a: 'Hello {nom}' } };
test('traduit et remplit', () => {
  const i = createI18n(dict, { lang: 'en' });
  assert.equal(i.t('a', { nom: 'Lina' }), 'Hello Lina');
});
test('repli sur le français', () => {
  const i = createI18n(dict, { lang: 'en' });
  assert.equal(i.t('b'), 'Oui');
});
test('missing liste les clés absentes', () => {
  assert.deepEqual(createI18n(dict).missing(), { en: ['b'] });
});
test('L pour un texte sans clé', () => {
  assert.equal(createI18n(dict, { lang: 'en' }).L({ fr: 'Non', en: 'No' }), 'No');
});
