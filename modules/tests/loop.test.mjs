import { createLoop } from '../loop.js';

group('loop');
test('tick avance de pas fixes', () => {
  let n = 0;
  const loop = createLoop({ update: dt => { n += dt; }, step: 1 / 60 });
  loop.tick(60);
  assert.ok(Math.abs(n - 1) < 1e-9);
  assert.ok(Math.abs(loop.time - 1) < 1e-9);
});
