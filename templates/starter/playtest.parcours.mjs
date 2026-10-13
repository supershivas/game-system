// Le parcours du harnais de playtest : node outils/playtest/run.mjs --aide
export default {
  cible: 'bureau',
  demarrer: async ({ page }) => { await page.click('#nouvelle'); },
  etapes: [
    { nom: 'depart', texte: 'Le héros apparaît au centre.', faire: async ({ attendre }) => { await attendre(1000); } },
    { nom: 'droite', texte: 'Il marche vers la droite.', faire: async ({ touche }) => { await touche('KeyD', 2500); } },
    { nom: 'bas', texte: 'Puis vers le bas.', faire: async ({ touche }) => { await touche('KeyS', 1500); } },
    { nom: 'coin', texte: 'Téléporté au coin du monde.', faire: async ({ jeu, attendre }) => { await jeu('teleport', 'coin'); await attendre(500); } },
  ],
};
