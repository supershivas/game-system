import { etatSujet, etatGroupe } from '../labo-shell.js';

group('labo-shell — points d\'état');
const sujet = (...status) => ({ variants: status.map(status => ({ status })) });
test('vert : une variante est en jeu', () => {
  assert.equal(etatSujet(sujet('actuelle', undefined)), 'vert');
  assert.equal(etatSujet(sujet('ancienne', 'retenue')), 'vert');
});
test('orange : aucune variante n\'a de statut', () => {
  assert.equal(etatSujet(sujet(undefined, undefined)), 'orange');
  assert.equal(etatSujet({ variants: [] }), 'orange');
});
test('rouge : des statuts sans variante en jeu, ou une proposition à trancher', () => {
  assert.equal(etatSujet(sujet('ancienne', 'ancienne')), 'rouge');
  assert.equal(etatSujet(sujet('actuelle', 'a-trancher', undefined)), 'rouge');
});
test('un groupe prend le pire de ses sujets', () => {
  const v = sujet('actuelle'), o = sujet(undefined), r = sujet('a-trancher');
  assert.equal(etatGroupe({ topics: [v, v] }), 'vert');
  assert.equal(etatGroupe({ topics: [v, o] }), 'orange');
  assert.equal(etatGroupe({ topics: [v, o, r] }), 'rouge');
});
