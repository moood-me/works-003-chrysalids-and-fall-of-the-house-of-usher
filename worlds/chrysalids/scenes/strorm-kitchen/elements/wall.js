// The kitchen's back wall (a card facing the room, 6.2 m off), painted once in its daylight colours — the lamp, the
// hearth and the window's light are the scene's: lime-washed plaster over a boarded dado; the window (its opening
// clear: the sky beyond — the element sky), the narrow stair door's opening (the stairs beyond — stairs; its leaf —
// stairdoor), the dresser with its plates, the samplers — “Honour the Image” with the true image, “Keep the Stock
// Pure” — and the hearth: its stone breast, the plaque “Watch Thou for the Mutant!”, the dark mouth (its fire: the
// particles fire and embers, its light: hearth).
const { WIN, DOOR, HEARTH } = e.lib;
const wallP = new Path2D();
wallP.rect(-8, -4.6, 16, 4.7);
wallP.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
wallP.rect(DOOR.a0, -DOOR.h, DOOR.a1 - DOOR.a0, DOOR.h + 0.1);
g.save();
g.clip(wallP, 'evenodd');
g.fillStyle = '#b3a58a';
g.fillRect(-8, -4.6, 16, 4.7);
for (let i = 0; i < 90; i++) {
  const x = -8 + e.rnd() * 16, w = 0.05 + e.rnd() * 0.4;
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(90,75,55,0.06)' : 'rgba(255,246,226,0.07)';
  g.fillRect(x, -4.6, w, 3.7);
}
// the dado: boards to 0.95 m, their joints, a rail
g.fillStyle = '#7a5d43';
g.fillRect(-8, -0.95, 16, 1.05);
g.fillStyle = 'rgba(40,28,20,0.45)';
for (let x = -8; x < 8; x += 0.19) g.fillRect(x, -0.93, 0.012, 0.93);
g.fillStyle = '#5e4632';
g.fillRect(-8, -1.0, 16, 0.06);
// the beams under the ceiling, their shadowed undersides
g.fillStyle = '#6a5038';
g.fillRect(-8, -3.45, 16, 0.18);
g.restore();
// the stair door's casing
g.fillStyle = '#5e4632';
g.beginPath();
g.rect(DOOR.a0 - 0.07, -DOOR.h - 0.08, DOOR.a1 - DOOR.a0 + 0.14, DOOR.h + 0.08);
g.rect(DOOR.a0, -DOOR.h, DOOR.a1 - DOOR.a0, DOOR.h);
g.fill('evenodd');
// the window: its frame, its cross, the sill
const fw = 0.065;
g.fillStyle = '#5e4632';
g.beginPath();
g.rect(WIN.x0 - fw, WIN.y0 - fw, WIN.x1 - WIN.x0 + 2 * fw, WIN.y1 - WIN.y0 + 2 * fw);
g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
g.fill('evenodd');
g.fillRect((WIN.x0 + WIN.x1) / 2 - 0.016, WIN.y0, 0.032, WIN.y1 - WIN.y0);
g.fillRect(WIN.x0, (WIN.y0 + WIN.y1) / 2 - 0.016, WIN.x1 - WIN.x0, 0.032);
g.fillStyle = '#6e543c';
g.fillRect(WIN.x0 - 0.11, WIN.y1 + fw - 0.01, WIN.x1 - WIN.x0 + 0.22, 0.055);
// the dresser with its plates
const DX = -4.3, DW = 1.15;
g.fillStyle = '#6a4e36';
g.fillRect(DX, -0.88, DW, 0.88);
g.fillStyle = '#7a5c40';
g.fillRect(DX - 0.05, -0.93, DW + 0.1, 0.06);
g.fillStyle = 'rgba(30,20,14,0.35)';
g.fillRect(DX + 0.07, -0.8, DW / 2 - 0.1, 0.7);
g.fillRect(DX + DW / 2 + 0.03, -0.8, DW / 2 - 0.1, 0.7);
g.fillStyle = '#4e3a28';
g.fillRect(DX + 0.04, -2.05, DW - 0.08, 1.12);
g.fillStyle = '#6a4e36';
g.fillRect(DX, -2.05, 0.05, 1.12);
g.fillRect(DX + DW - 0.05, -2.05, 0.05, 1.12);
g.beginPath();
g.moveTo(DX - 0.07, -2.04);
g.lineTo(DX + DW + 0.07, -2.04);
g.lineTo(DX + DW + 0.02, -2.16);
g.lineTo(DX - 0.02, -2.16);
g.closePath();
g.fill();
for (let k = 0; k < 3; k++) {
  const sy = -1.2 - k * 0.3;
  g.fillStyle = '#6a4e36';
  g.fillRect(DX + 0.05, sy, DW - 0.1, 0.028);
  for (let j = 0; j < 4; j++) {
    const px = DX + 0.2 + j * 0.25, py = sy - 0.1;
    g.fillStyle = '#cfc6b2';
    g.beginPath();
    g.ellipse(px, py, 0.1, 0.098, 0, 0, 7);
    g.fill();
    g.fillStyle = '#b8ae98';
    g.beginPath();
    g.arc(px, py, 0.06, 0, 7);
    g.fill();
    g.strokeStyle = '#5a6c86';
    g.lineWidth = 0.008;
    g.beginPath();
    g.arc(px, py, 0.085, 0, 7);
    g.stroke();
  }
}
// the samplers: linen in a dark frame, red cross-stitch — the true image (one head, two arms, two legs) and the words
function sampler(cx, cy, w, h, txt, fs, image) {
  g.fillStyle = '#4e3a28';
  g.fillRect(cx - w / 2 - 0.04, cy - h / 2 - 0.04, w + 0.08, h + 0.08);
  g.fillStyle = '#ddd0ae';
  g.fillRect(cx - w / 2, cy - h / 2, w, h);
  g.strokeStyle = '#8c3a2c';
  g.lineWidth = 0.011;
  g.setLineDash([0.022, 0.016]);
  g.strokeRect(cx - w / 2 + 0.04, cy - h / 2 + 0.04, w - 0.08, h - 0.08);
  g.setLineDash([]);
  let ty = cy;
  if (image) {
    const fx = cx, fy = cy - h / 2 + 0.1;
    g.strokeStyle = '#8c3a2c';
    g.lineWidth = 0.02;
    g.setLineDash([0.018, 0.01]);
    g.beginPath();
    g.arc(fx, fy + 0.03, 0.035, 0, 7);
    g.moveTo(fx, fy + 0.07);
    g.lineTo(fx, fy + 0.2);
    g.moveTo(fx - 0.11, fy + 0.09);
    g.lineTo(fx, fy + 0.1);
    g.lineTo(fx + 0.11, fy + 0.09);
    g.moveTo(fx - 0.07, fy + 0.3);
    g.lineTo(fx, fy + 0.2);
    g.lineTo(fx + 0.07, fy + 0.3);
    g.stroke();
    g.setLineDash([]);
    ty = cy + h / 2 - 0.09;
  }
  g.save();
  g.translate(cx, ty);
  g.scale(0.01, 0.01);
  g.font = fs + 'px Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#5a2a20';
  g.fillText(txt, 0, 1);
  g.restore();
}
sampler(-0.45, -2.45, 0.95, 0.62, tr('Honour the Image'), 9.5, true);
sampler(-3.72, -2.62, 1.2, 0.32, tr('Keep the Stock Pure'), 9.5, false);
e.at(-0.45, -2.45, 'sampler');
// the hearth: its stone breast up to the beams, the mantel, the plaque, the arched mouth (soot-dark inside), the pot
// hanging in it on its crane
const HX0 = HEARTH.a - 1.0, HX1 = HEARTH.a + 1.0, HC = HEARTH.a;
g.fillStyle = '#8f877a';
g.fillRect(HX0, -3.45, HX1 - HX0, 3.45);
for (let i = 0; i < 60; i++) {
  const x = HX0 + e.rnd() * (HX1 - HX0 - 0.3), y = -0.1 - e.rnd() * 3.2, w = 0.18 + e.rnd() * 0.22;
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(60,54,46,0.18)' : 'rgba(230,224,210,0.14)';
  g.fillRect(x, y, w, 0.12 + e.rnd() * 0.06);
}
g.fillStyle = '#6a5038';
g.beginPath();
g.moveTo(HX0 - 0.12, -1.56);
g.lineTo(HX1 + 0.12, -1.57);
g.lineTo(HX1 + 0.1, -1.44);
g.lineTo(HX0 - 0.1, -1.43);
g.closePath();
g.fill();
{
  const cx = HC, cy = -2.3, w = 1.45, h = 0.3;
  g.fillStyle = '#5e4632';
  g.fillRect(cx - w / 2, cy - h / 2, w, h);
  g.save();
  g.translate(cx, cy);
  g.scale(0.01, 0.01);
  g.font = '10px Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#d8c6a0';
  g.fillText(tr('Watch Thou for the Mutant!'), 0, 1);
  g.restore();
}
const mouth = new Path2D();
mouth.moveTo(HC - 0.65, 0);
mouth.lineTo(HC - 0.65, -1.08);
mouth.quadraticCurveTo(HC, -1.34, HC + 0.65, -1.08);
mouth.lineTo(HC + 0.65, 0);
mouth.closePath();
g.fillStyle = '#2e2622';
g.fill(mouth);
g.save();
g.clip(mouth);
g.fillStyle = '#3c302a';
g.beginPath();
g.ellipse(HC - 0.15, -0.09, 0.32, 0.06, 0.08, 0, 7);
g.fill();
g.beginPath();
g.ellipse(HC + 0.2, -0.07, 0.28, 0.05, -0.12, 0, 7);
g.fill();
g.strokeStyle = '#1e1a18';
g.lineWidth = 0.012;
g.beginPath();
g.moveTo(HC - 0.3, -1.25);
g.lineTo(HC - 0.3, -0.6);
g.stroke();
g.fillStyle = '#26211e';
g.beginPath();
g.moveTo(HC - 0.45, -0.58);
g.quadraticCurveTo(HC - 0.47, -0.38, HC - 0.3, -0.36);
g.quadraticCurveTo(HC - 0.13, -0.38, HC - 0.15, -0.58);
g.closePath();
g.fill();
g.restore();
e.at(HC - 0.3, -0.48, 'pot');
