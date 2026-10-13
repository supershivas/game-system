// Le rendu : dessine l'état, ne le modifie jamais (section 12).
// Tout est en pixels logiques ; pixel-canvas.js s'occupe de l'échelle entière.
import { spriteCanvas } from './lib/sprites.js';
import { PALETTE, ROLES } from './palette.js';

export function dessiner(ctx, etat, vue, sprites, reglages) {
  const { largeur, hauteur } = reglages.monde;
  // La caméra suit le héros, sans sortir du monde (centrée si le monde est plus petit que la vue)
  const cam = {
    x: largeur <= vue.width ? (largeur - vue.width) / 2 : Math.max(0, Math.min(largeur - vue.width, etat.heros.x - vue.width / 2)),
    y: hauteur <= vue.height ? (hauteur - vue.height) / 2 : Math.max(0, Math.min(hauteur - vue.height, etat.heros.y - vue.height / 2)),
  };
  cam.x = Math.round(cam.x); cam.y = Math.round(cam.y);

  ctx.fillStyle = ROLES.fond;
  ctx.fillRect(0, 0, vue.width, vue.height);
  // Le sol : une trame accrochée au MONDE, jamais à la caméra (sinon elle scintille)
  ctx.fillStyle = ROLES.ombre;
  for (let y = 8 - (cam.y % 16); y < vue.height; y += 16) {
    for (let x = 8 - (cam.x % 16); x < vue.width; x += 16) ctx.fillRect(x, y, 1, 1);
  }
  // Les bords du monde
  ctx.strokeStyle = ROLES.ombre;
  ctx.strokeRect(-cam.x + 0.5, -cam.y + 0.5, largeur - 1, hauteur - 1);

  const etoile = spriteCanvas(sprites.etoile, PALETTE);
  for (const e of etat.etoiles) ctx.drawImage(etoile, Math.round(e.x - cam.x - 2), Math.round(e.y - cam.y - 2));
  const heros = spriteCanvas(sprites.heros, PALETTE, { flip: etat.heros.dir < 0 });
  ctx.drawImage(heros, Math.round(etat.heros.x - cam.x - 4), Math.round(etat.heros.y - cam.y - 7));
  return cam;
}
