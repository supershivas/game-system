import { validateSprite, imageToRows, paletteToGPL, paletteToHex, flipRows, spriteSize } from '../sprites.js';

group('sprites');
const P = { k: '#000000', w: '#ffffff', r: '#ff0000' };
test('un sprite valide', () => assert.deepEqual(validateSprite(['.kk.', 'kwwk'], P), []));
test('lettre hors palette et ligne trop courte', () => {
  const pb = validateSprite(['.kk.', 'kxk'], P);
  assert.equal(pb.length, 2);
});
test('imageToRows ramène à la couleur la plus proche', () => {
  const data = new Uint8ClampedArray([250, 10, 5, 255, 0, 0, 0, 0, 20, 20, 20, 255, 240, 240, 240, 255]);
  assert.deepEqual(imageToRows({ data, width: 2, height: 2 }, P), ['r.', 'kw']);
});
test('palette au format GIMP et Lospec', () => {
  assert.match(paletteToGPL(P, 'Essai'), /^GIMP Palette\nName: Essai/);
  assert.match(paletteToGPL(P), /255 {3}0 {3}0\tr/);
  assert.equal(paletteToHex(P), '000000\nffffff\nff0000\n');
});
test('flipRows retourne et complète', () => {
  assert.deepEqual(flipRows(['ab', 'c']), ['ba', '.c']);
  assert.deepEqual(spriteSize(['abc', 'a']), { w: 3, h: 2 });
});
