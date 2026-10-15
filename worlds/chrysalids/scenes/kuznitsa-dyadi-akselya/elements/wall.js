const S = e.state || {};
const f = S.fire ?? 0.7;
const fl = 0.85 + 0.1 * Math.sin(e.t * 2.3) + 0.05 * Math.sin(e.t * 5.1 + 1);
const F = f * fl;
const dL = 0.9,
  dR = 5.0,
  dT = -3.4;
g.save();
g.beginPath();
g.rect(-11, -7, 22, 7.2);
g.moveTo(dL, 0.2);
g.lineTo(dL, dT);
g.lineTo(dR, dT);
g.lineTo(dR, 0.2);
g.closePath();
g.clip("evenodd");
g.fillStyle = "#1a1411";
g.fillRect(-11, -7, 22, 7.2);
for (let x = -11; x < 11; x += 0.3 + e.rnd() * 0.14) {
  g.fillStyle = "rgba(8,6,5," + (0.15 + e.rnd() * 0.2) + ")";
  g.fillRect(x, -7, 0.02, 7.2);
  g.fillStyle = "rgba(60,44,34," + (0.04 + e.rnd() * 0.07) + ")";
  g.fillRect(x + 0.04, -7, 0.1 + e.rnd() * 0.1, 7.2);
}
let rg = g.createRadialGradient(-4.4, -1.2, 0, -4.4, -1.2, 9);
rg.addColorStop(0, "rgba(214,112,52," + 0.55 * F + ")");
rg.addColorStop(0.25, "rgba(170,82,40," + 0.32 * F + ")");
rg.addColorStop(0.6, "rgba(90,46,28," + 0.15 * F + ")");
rg.addColorStop(1, "rgba(40,24,18,0)");
g.fillStyle = rg;
g.fillRect(-11, -7, 22, 7.2);
let cg = g.createLinearGradient(0, -7, 0, -3.2);
cg.addColorStop(0, "rgba(8,6,6,0.85)");
cg.addColorStop(1, "rgba(8,6,6,0)");
g.fillStyle = cg;
g.fillRect(-11, -7, 22, 4);
const tc = "#0e0a08";
const sw = 0.012 * Math.sin(e.t * 0.4) + 0.006 * Math.sin(e.t * 0.93);
g.strokeStyle = tc;
g.lineCap = "round";
g.fillStyle = tc;
for (const [px, py] of [
  [-2.55, -2.4],
  [-2.2, -2.42],
  [-1.8, -2.4],
  [-1.45, -2.44],
  [-1.05, -2.41],
  [-0.55, -2.25],
  [-0.2, -2.28],
  [0.15, -2.24],
]) {
  g.beginPath();
  g.arc(px, py, 0.025, 0, 7);
  g.fill();
}
g.lineWidth = 0.032;
for (const tx of [-2.55, -2.2]) {
  g.beginPath();
  g.moveTo(tx, -2.4);
  g.quadraticCurveTo(tx - 0.07 + sw, -1.9, tx - 0.05 + sw, -1.35);
  g.moveTo(tx, -2.4);
  g.quadraticCurveTo(tx + 0.06 + sw, -1.9, tx + 0.08 + sw, -1.37);
  g.stroke();
}
for (const [hx, hy, L] of [
  [-1.8, -2.4, 0.55],
  [-1.45, -2.44, 0.72],
  [-1.05, -2.41, 0.46],
]) {
  g.lineWidth = 0.035;
  g.beginPath();
  g.moveTo(hx, hy);
  g.lineTo(hx + sw, hy + L);
  g.stroke();
  g.beginPath();
  g.moveTo(hx - 0.11 + sw, hy + L - 0.02);
  g.lineTo(hx + 0.11 + sw, hy + L - 0.03);
  g.lineTo(hx + 0.1 + sw, hy + L + 0.06);
  g.lineTo(hx - 0.1 + sw, hy + L + 0.07);
  g.fill();
}
g.lineWidth = 0.05;
for (const hx of [-0.55, -0.2, 0.15]) {
  const s2 = sw * 1.5;
  g.beginPath();
  g.moveTo(hx - 0.09 + s2, -2.25 + 0.26);
  g.lineTo(hx - 0.1 + s2, -2.25 + 0.08);
  g.quadraticCurveTo(hx + s2, -2.25 - 0.02, hx + 0.1 + s2, -2.25 + 0.08);
  g.lineTo(hx + 0.09 + s2, -2.25 + 0.26);
  g.stroke();
}
g.fillStyle = "rgba(200,104,52," + 0.18 * F + ")";
g.fillRect(-2.8, -2.47, 2.0, 0.012);
g.restore();
g.fillStyle = "#110d0b";
g.beginPath();
g.moveTo(dL - 0.28, 0.2);
g.lineTo(dL - 0.26, dT - 0.3);
g.lineTo(dR + 0.3, dT - 0.34);
g.lineTo(dR + 0.3, 0.2);
g.lineTo(dR, 0.2);
g.lineTo(dR, dT);
g.lineTo(dL, dT);
g.lineTo(dL, 0.2);
g.closePath();
g.fill();
let pg = g.createLinearGradient(dL - 0.28, 0, dL, 0);
pg.addColorStop(0, "rgba(190,96,46," + 0.3 * F + ")");
pg.addColorStop(1, "rgba(190,96,46,0)");
g.fillStyle = pg;
g.fillRect(dL - 0.28, dT - 0.3, 0.28, 3.5 + 0.3);
const door = S.door ?? 1,
  ed = 0.9 + 3.55 * door,
  DW = 4.1,
  top = dT - 0.32;
g.fillStyle = "#0b0807";
g.fillRect(dL - 0.45, top - 0.14, 10, 0.09);
g.fillStyle = "#18120e";
g.fillRect(ed, top, DW, 0.2 - top);
// (where hands take the door's edge to slide it)
e.at(ed + 0.06, -1.12, "grip_low");
e.at(ed + 0.06, -1.32, "grip_high");
for (let x = ed + 0.3; x < ed + DW - 0.05; x += 0.34) {
  g.fillStyle = "rgba(6,5,4,0.55)";
  g.fillRect(x, top, 0.022, 0.2 - top);
  g.fillStyle = "rgba(70,50,38,0.08)";
  g.fillRect(x + 0.03, top, 0.12, 0.2 - top);
}
g.strokeStyle = "#0d0a08";
g.lineWidth = 0.13;
g.beginPath();
g.moveTo(ed + 0.1, top + 0.35);
g.lineTo(ed + DW - 0.1, top + 0.35);
g.moveTo(ed + 0.1, -0.35);
g.lineTo(ed + DW - 0.1, -0.35);
g.moveTo(ed + 0.15, -0.4);
g.lineTo(ed + DW - 0.15, top + 0.4);
g.stroke();
let dg = g.createRadialGradient(-4.4, -1.2, 0, -4.4, -1.2, 11);
dg.addColorStop(0, "rgba(200,104,52," + 0.3 * F + ")");
dg.addColorStop(0.5, "rgba(150,72,36," + 0.12 * F + ")");
dg.addColorStop(1, "rgba(60,30,18,0)");
g.fillStyle = dg;
g.fillRect(ed, top, DW, 0.2 - top);
g.fillStyle = "rgba(120,140,190,0.18)";
g.fillRect(ed, top, 0.05, 0.2 - top);
g.fillStyle = "#0a0706";
g.fillRect(ed + 0.12, -1.55, 0.07, 0.5);
for (const wx of [ed + 0.5, ed + DW - 0.5]) {
  g.beginPath();
  g.arc(wx, top - 0.1, 0.09, 0, 7);
  g.fill();
  g.fillRect(wx - 0.025, top - 0.1, 0.05, 0.14);
}
