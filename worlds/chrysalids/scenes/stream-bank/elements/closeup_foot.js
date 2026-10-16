// The close-up's foot (over closeup and its glints, through the same iris; in the close-up's own frame, lib.cuFrame):
// two wet stones; her freed bare foot on them, the ankle up-left, the toes down-right — six toes, each its own, the last
// a small extra one by the little toe (layers: closeup_foot.animate.js curls them as `cu_wig` says); a red scrape where
// the stones held it; the hem of her dress (a layer drawn along the foot over it as `cu_hide` — her own hand — or `hem`
// — his — goes 0 → 1); her fingers on it while she pulls; his hand on its edge while `cu_cover` (he is to pull it: the
// game's “The hem”); his hands with the shoe, drawing back as `cu_pull` goes 0 → 1. (The way his hand pulls is the
// close-up's points closeup#hem → closeup#foot: closeup.js.)
const { cuFrame, cuBox, cuAt, FOOT_CU } = e.lib;
const { AX, AY, ANG, L, HX, COVER } = FOOT_CU;
cuFrame(g);
function stone(x, y, rx, ry) {
  const gr = g.createLinearGradient(0, y - ry, 0, y + ry);
  gr.addColorStop(0, '#b6af90');
  gr.addColorStop(1, '#5d5c4c');
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, 7);
  g.fill();
  g.strokeStyle = '#f4ead0';
  g.globalAlpha = 0.7;
  g.lineWidth = 0.006;
  g.beginPath();
  g.ellipse(x, y, rx * 0.97, ry * 0.95, 0, Math.PI * 1.1, Math.PI * 1.8);
  g.stroke();
  g.globalAlpha = 1;
}
stone(-0.3, 0.08, 0.2, 0.14);
stone(0.33, 0.12, 0.25, 0.17);
// the foot (its own frame: the ankle at its origin, along x to the toes)
const skin = '#c79a76', skinD = '#9c7558', pale = '#f6e2c0', line = '#6e4c38';
const ws = [0.056, 0.04, 0.037, 0.034, 0.031, 0.026], ls = [0.085, 0.075, 0.07, 0.064, 0.057, 0.047], gap = 0.007;
const tot = ws.reduce((a, w) => a + w + gap, 0) - gap;
g.save();
g.translate(AX, AY);
g.rotate(ANG);
g.fillStyle = 'rgba(60,50,30,0.3)';
g.beginPath();
g.ellipse(L * 0.6, 0.09, L * 0.75, 0.07, 0, 0, 7);
g.fill();
const fg = g.createLinearGradient(0, -0.12, 0, 0.12);
fg.addColorStop(0, skin);
fg.addColorStop(1, skinD);
g.fillStyle = fg;
g.beginPath();
g.moveTo(-0.12, -0.07);
g.quadraticCurveTo(L * 0.5, -0.1, L, -tot / 2 - 0.004);
g.lineTo(L + 0.012, tot / 2 + 0.004);
g.quadraticCurveTo(L * 0.55, 0.12, -0.12, 0.075);
g.closePath();
g.fill();
g.strokeStyle = pale;
g.lineWidth = 0.006;
g.globalAlpha = 0.9;
g.beginPath();
g.moveTo(-0.12, -0.069);
g.quadraticCurveTo(L * 0.5, -0.099, L, -tot / 2 - 0.004);
g.stroke();
g.globalAlpha = 1;
// a red scrape where the stones held it
g.strokeStyle = 'rgba(165,75,58,0.45)';
g.lineWidth = 0.004;
for (let i = 0; i < 3; i++) {
  g.beginPath();
  g.moveTo(-0.04 + i * 0.012, 0.045 + i * 0.008);
  g.lineTo(0.03 + i * 0.012, 0.04 + i * 0.008);
  g.stroke();
}
g.restore();
// the toes: each a layer painted in the foot's frame not yet turned (its animate turns it into the foot about the ankle,
// and curls it — shorter from its root)
let yy = -tot / 2;
const ankle = cuAt(AX, AY);
ws.forEach((w, i) => {
  const cy = yy + w / 2, l = ls[i], x0 = L - 0.012 - i * 0.004;
  e.layer(`toe${i}`, { pivot: ankle, box: cuBox(AX - 0.2, AY - 0.3, AX + 0.6, AY + 0.4) }, q => {
    cuFrame(q);
    q.translate(AX, AY);
    q.fillStyle = skin;
    q.strokeStyle = line;
    q.lineWidth = 0.0035;
    q.beginPath();
    q.moveTo(x0, cy - w / 2);
    q.lineTo(x0 + l - w / 2, cy - w / 2);
    q.arc(x0 + l - w / 2, cy, w / 2, -Math.PI / 2, Math.PI / 2);
    q.lineTo(x0, cy + w / 2);
    q.closePath();
    q.fill();
    q.stroke();
    q.fillStyle = skinD;
    q.globalAlpha = 0.45;
    q.beginPath();
    q.ellipse(x0 + l * 0.55, cy + w * 0.25, l * 0.42, w * 0.18, 0, 0, 7);
    q.fill();
    q.globalAlpha = 1;
    q.fillStyle = '#ead2bc';
    q.beginPath();
    q.ellipse(x0 + l - w * 0.42, cy - w * 0.03, w * 0.3, w * 0.3, 0, 0, 7);
    q.fill();
    q.strokeStyle = pale;
    q.globalAlpha = 0.8;
    q.lineWidth = 0.003;
    q.beginPath();
    q.arc(x0 + l - w / 2, cy, w / 2 - 0.002, -Math.PI / 2, -0.2);
    q.stroke();
    q.globalAlpha = 1;
  });
  yy += w + gap;
});
// the hem of her dress, its edge where it is with nothing pulled (HX along the foot): drawn along the foot over it; her
// fingers on its edge while she pulls; his hand on it — a boy's hand in a blue sleeve, from above — while he does
const hem = (q, who) => {
  cuFrame(q);
  q.translate(AX, AY);
  q.rotate(ANG);
  if (who === 'her') {
    q.fillStyle = skin;
    for (let i = 0; i < 4; i++) {
      q.beginPath();
      q.ellipse(HX + 0.005, -0.06 + i * 0.03, 0.018, 0.011, 0, 0, 7);
      q.fill();
    }
    return;
  }
  if (who === 'his') {
    q.fillStyle = '#4f6a8a';
    q.beginPath();
    q.moveTo(HX - 0.07, -0.62);
    q.lineTo(HX + 0.07, -0.62);
    q.lineTo(HX + 0.055, -0.13);
    q.lineTo(HX - 0.055, -0.13);
    q.closePath();
    q.fill();
    q.fillStyle = '#b88d6e';
    q.beginPath();
    q.ellipse(HX, -0.085, 0.05, 0.06, 0, 0, 7);
    q.fill();
    for (let i = 0; i < 4; i++) {
      q.beginPath();
      q.ellipse(HX + 0.012, -0.06 + i * 0.024, 0.02, 0.01, 0.2, 0, 7);
      q.fill();
    }
    return;
  }
  q.fillStyle = '#86473a';
  q.beginPath();
  q.moveTo(-1.4, -0.2);
  q.lineTo(HX, -0.15);
  q.quadraticCurveTo(HX + 0.05, -0.02, HX - 0.02, 0.13);
  q.lineTo(-1.4, 0.17);
  q.closePath();
  q.fill();
  q.strokeStyle = '#c78a6c';
  q.lineWidth = 0.006;
  q.beginPath();
  q.moveTo(HX, -0.15);
  q.quadraticCurveTo(HX + 0.05, -0.02, HX - 0.02, 0.13);
  q.stroke();
};
// (each moved along the foot as far as the cover goes: its box holds that way)
e.layer('hem', { box: cuBox(-1.75, -0.75, COVER + 0.4, 0.75) }, q => hem(q, null));
e.layer('fingers', { box: cuBox(-0.75, -0.55, COVER + 0.2, 0.45) }, q => hem(q, 'her'));
e.layer('his_hand', { box: cuBox(-0.9, -0.9, COVER + 0.3, 0.45) }, q => hem(q, 'his'));
// his hands with the shoe
e.layer('hands', { box: cuBox(0.1, -0.35, 1.1, 0.1) }, q => {
  cuFrame(q);
  q.translate(0.32, -0.12);
  q.rotate(-0.3);
  q.fillStyle = '#33271f';
  q.beginPath();
  q.moveTo(-0.11, -0.035);
  q.quadraticCurveTo(-0.13, 0.05, -0.03, 0.055);
  q.lineTo(0.15, 0.055);
  q.quadraticCurveTo(0.17, 0.0, 0.1, -0.02);
  q.lineTo(0.0, -0.05);
  q.closePath();
  q.fill();
  q.strokeStyle = '#6c5a46';
  q.lineWidth = 0.004;
  q.beginPath();
  q.moveTo(-0.07, -0.03);
  q.lineTo(-0.01, -0.045);
  q.stroke();
  q.fillStyle = '#a5805f';
  q.beginPath();
  q.ellipse(0.12, -0.01, 0.05, 0.035, 0.3, 0, 7);
  q.fill();
  q.beginPath();
  q.ellipse(0.04, 0.06, 0.045, 0.03, -0.2, 0, 7);
  q.fill();
  q.fillStyle = '#56626c';
  q.fillRect(0.15, -0.06, 0.3, 0.12);
});
