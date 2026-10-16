// Learning to hear — its mechanics: each child of the valley works (the hoe, the washing, the staff, the cart, the
// bucket) and, listening (lib.LIS), straightens and lifts the head; the grown-ups (`adults_near`): the ploughman stops
// and turns to look up at David, the woman at the door shades her eyes and looks; Rosalind on the fence turns to David
// as `rosalind` grows.
const s = scene, L = s.lib, P = id => s.person(id);
const up = i => { const h = L.HD[i]; return [h[0] * 1.02, h[1] + 40, h[2] + 25]; };
const WORK = {
  david: () => { P('david').do('rake', { loop: true }); P('david').look(null); },
  washer: () => { P('washer').do('stand', { loop: true }); P('washer').reach({ r: 'line#peg_r', l: 'line#peg_l' }); P('washer').look('line#peg_r'); },
  shepherd: () => { P('shepherd').do('staff_lean', { loop: true }); P('shepherd').look('sheep_hill'); },
  cart: () => { P('cart').do('perch_hunch', { loop: true }); P('cart').look(null); },
  far_girl: () => { P('far_girl').do('crouch', { loop: true }); P('far_girl').look(null); },
};
const now = {};
function listen() {
  const st = s.state;
  L.KIDS.forEach((id, k) => {
    if (id === 'rosalind') return;
    const on = L.LIS(k, s.time, st) > 0.35;
    if (now[id] === on) return;
    now[id] = on;
    if (on) {
      if (id === 'washer') P(id).reach(null);
      P(id).do(id === 'cart' ? 'perch_still' : id === 'shepherd' ? 'staff_lean' : 'stand', { loop: true });
      P(id).look(up(k));
    } else WORK[id]();
  });
}
s.every(0.5, listen);
listen();
function rosalind() { P('rosalind').look((+s.get('rosalind') || 0) > 0.3 ? 'david' : null); }
s.on('change', 'rosalind', rosalind);
rosalind();
let near = null;
function adults() {
  const a = (+s.get('adults_near') || 0) > 0.5;
  if (a === near) return;
  near = a;
  P('ploughman').do(a ? 'shade' : 'stand', { loop: true });
  P('ploughman').reach(a ? null : { r: 'plough#handle_r', l: 'plough#handle_l' });
  P('ploughman').turn(a ? 200 : 270);
  P('ploughman').look(a ? 'david' : 'plough_horse');
  P('woman').do(a ? 'shade' : 'stand', { loop: true });
  P('woman').look(a ? 'david' : null);
}
s.on('change', 'adults_near', adults);
s.on('move', 'adults_near', adults);
adults();
