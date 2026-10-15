// The land from above (x across, y = 200 − distance, toward us): stubble everywhere, its rows running away; the standing
// wheat to the left of the fence; the trodden yard round the well, the barn and the house; the road from our feet to the
// house's door, two ruts in it; a strip of grass along the fence.
const L = e.lib, Y = d => 200 - d;
g.fillStyle = '#bca674';
g.fillRect(-400, -200, 800, 400);
for (let x = -400; x < 400; x += 0.8) { g.fillStyle = e.rnd() < 0.5 ? 'rgba(150,128,80,0.35)' : 'rgba(214,196,146,0.3)'; g.fillRect(x, -200, 0.14, 400); }
// the wheat: left of the fence, and the field running on behind the barn
g.fillStyle = '#a88a4c';
g.beginPath();
g.moveTo(L.fenceAt(0), Y(0));
g.lineTo(L.fenceAt(L.FENCE.d1), Y(L.FENCE.d1));
g.lineTo(-14, Y(L.FENCE.d1));
g.lineTo(-14, Y(70));
g.lineTo(-400, Y(70));
g.lineTo(-400, Y(0));
g.closePath();
g.fill();
// the yard
g.fillStyle = '#8e7a5c';
g.beginPath();
g.moveTo(L.fenceAt(5), Y(5));
g.quadraticCurveTo(6, Y(4), 11, Y(12));
g.quadraticCurveTo(13, Y(22), 8, Y(26));
g.lineTo(-17, Y(26));
g.lineTo(-17, Y(L.FENCE.d1));
g.lineTo(L.fenceAt(L.FENCE.d1), Y(L.FENCE.d1));
g.closePath();
g.fill();
for (let i = 0; i < 140; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(104,88,64,0.3)' : 'rgba(178,160,118,0.28)';
  g.beginPath();
  g.ellipse(-12 + e.rnd() * 22, Y(6 + e.rnd() * 19), 0.3 + e.rnd() * 1.4, 0.12 + e.rnd() * 0.4, e.rnd() * 3, 0, 7);
  g.fill();
}
// grass along the fence, on the yard's side
g.fillStyle = '#7c7c4c';
g.beginPath();
g.moveTo(L.fenceAt(0), Y(0)); g.lineTo(L.fenceAt(L.FENCE.d1), Y(L.FENCE.d1));
g.lineTo(L.fenceAt(L.FENCE.d1) + 0.6, Y(L.FENCE.d1)); g.lineTo(L.fenceAt(0) + 1.1, Y(0));
g.closePath();
g.fill();
// the road to the door
const r0 = [0.4, 0], r1 = [2.1, 18.4];
g.fillStyle = '#a8977a';
g.beginPath();
g.moveTo(r0[0] - 1.4, Y(r0[1])); g.lineTo(r1[0] - 1.0, Y(r1[1])); g.lineTo(r1[0] + 1.0, Y(r1[1])); g.lineTo(r0[0] + 1.4, Y(r0[1]));
g.closePath();
g.fill();
g.strokeStyle = 'rgba(110,94,72,0.5)';
g.lineWidth = 0.16;
for (const k of [-0.55, 0.55]) { g.beginPath(); g.moveTo(r0[0] + k, Y(r0[1])); g.lineTo(r1[0] + k * 0.75, Y(r1[1])); g.stroke(); }
