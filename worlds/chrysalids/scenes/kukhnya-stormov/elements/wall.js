const s = e.state,
  LB = e.lib,
  PI = Math.PI,
  T = e.t,
  LAMP = LB.LAMP,
  st = (k, d) => {
    const v = s[k];
    return typeof v === "number" && isFinite(v) ? v : d;
  };
const L = st("lamp", 1),
  dk = st("dusk", 0),
  yd = st("yard_door", 0),
  sd = st("stair_door", 0);
const fl = 1 + 0.05 * Math.sin(T * 8.3) + 0.035 * Math.sin(T * 12.9 + 1) + 0.03 * Math.sin(T * 2.7);
const WX0 = 0.4,
  WX1 = 1.2,
  WY0 = -2.45,
  WY1 = -1.4,
  DX0 = -2.95,
  DX1 = -2.2,
  DY0 = -2.02;
const wallP = new Path2D();
wallP.rect(-8, -4.6, 16, 4.7);
wallP.rect(WX0, WY0, WX1 - WX0, WY1 - WY0);
wallP.rect(DX0, DY0, DX1 - DX0, -DY0 + 0.1);
// the narrow stair door, open as far as stair_door says (the stairs behind it: the element stairs, seen through it)
g.save();
g.beginPath();
g.rect(DX0, DY0, DX1 - DX0, -DY0);
g.clip();
const lw = (DX1 - DX0) * Math.cos(((sd * PI) / 2) * 0.92);
g.fillStyle = "#1c1512";
g.fillRect(DX0, DY0, lw, -DY0);
if (lw > 0.04) {
  g.fillStyle = "rgba(0,0,0,0.3)";
  for (let i = 1; i < 3; i++) g.fillRect(DX0 + (lw * i) / 3, DY0, 0.008, -DY0);
  g.fillStyle = "rgba(200,140,80," + 0.18 * L * (1 - sd) + ")";
  g.fillRect(DX0 + lw - 0.012, DY0, 0.012, -DY0);
  g.fillStyle = "#2a201b";
  g.beginPath();
  g.arc(DX0 + lw - 0.08, -1.0, 0.022, 0, 7);
  g.fill();
}
g.restore();
g.save();
g.clip(wallP, "evenodd");
let gr = g.createLinearGradient(0, -3.4, 0, 0);
gr.addColorStop(0, "#141011");
gr.addColorStop(1, "#1f1918");
g.fillStyle = gr;
g.fillRect(-8, -4.6, 16, 4.7);
for (let i = 0; i < 80; i++) {
  const x = -8 + e.rnd() * 16,
    w = 0.05 + e.rnd() * 0.35;
  g.fillStyle = "rgba(" + (e.rnd() < 0.5 ? "0,0,0" : "255,235,210") + "," + (0.012 + e.rnd() * 0.02) + ")";
  g.fillRect(x, -3.4, w, 3.4);
}
g.fillStyle = "#1a1514";
g.fillRect(-8, -0.95, 16, 0.95);
for (let x = -8; x < 8; x += 0.19) {
  g.fillStyle = "rgba(0,0,0,0.2)";
  g.fillRect(x, -0.93, 0.01, 0.93);
}
g.fillStyle = "rgba(60,46,38,0.35)";
g.fillRect(-8, -0.98, 16, 0.03);
g.restore();
// door casing
g.fillStyle = "#211a17";
g.beginPath();
g.rect(DX0 - 0.07, DY0 - 0.08, DX1 - DX0 + 0.14, -DY0 + 0.08);
g.rect(DX0, DY0, DX1 - DX0, -DY0);
g.fill("evenodd");
// window
g.fillStyle = "#211a17";
const fw = 0.065;
g.beginPath();
g.rect(WX0 - fw, WY0 - fw, WX1 - WX0 + 2 * fw, WY1 - WY0 + 2 * fw);
g.rect(WX0, WY0, WX1 - WX0, WY1 - WY0);
g.fill("evenodd");
g.fillRect((WX0 + WX1) / 2 - 0.016, WY0, 0.032, WY1 - WY0);
g.fillRect(WX0, (WY0 + WY1) / 2 - 0.016, WX1 - WX0, 0.032);
g.fillStyle = "#2a211d";
g.fillRect(WX0 - 0.11, WY1 + fw - 0.01, WX1 - WX0 + 0.22, 0.055);
g.fillStyle = "rgba(150,170,200," + 0.05 * (1 - dk) + ")";
g.fillRect(WX0, WY0, WX1 - WX0, WY1 - WY0);
gr = g.createRadialGradient(0.62, -1.62, 0, 0.62, -1.62, 0.12);
gr.addColorStop(0, "rgba(255,190,120," + 0.35 * L * fl + ")");
gr.addColorStop(1, "rgba(255,190,120,0)");
g.fillStyle = gr;
g.fillRect(0.4, -1.85, 0.5, 0.5);
g.save();
g.clip(wallP, "evenodd");
// dresser with plates
const DXd = -4.3,
  DW = 1.15;
g.fillStyle = "#1b1513";
g.fillRect(DXd, -0.88, DW, 0.88);
g.fillStyle = "#241c18";
g.fillRect(DXd - 0.05, -0.93, DW + 0.1, 0.06);
g.fillStyle = "rgba(0,0,0,0.3)";
g.fillRect(DXd + 0.07, -0.8, DW / 2 - 0.1, 0.7);
g.fillRect(DXd + DW / 2 + 0.03, -0.8, DW / 2 - 0.1, 0.7);
g.fillStyle = "#151010";
g.fillRect(DXd + 0.04, -2.05, DW - 0.08, 1.12);
g.fillStyle = "#211a17";
g.fillRect(DXd, -2.05, 0.05, 1.12);
g.fillRect(DXd + DW - 0.05, -2.05, 0.05, 1.12);
g.beginPath();
g.moveTo(DXd - 0.07, -2.04);
g.lineTo(DXd + DW + 0.07, -2.04);
g.lineTo(DXd + DW + 0.02, -2.16);
g.lineTo(DXd - 0.02, -2.16);
g.closePath();
g.fill();
for (let k = 0; k < 3; k++) {
  const sy = -1.2 - k * 0.3;
  g.fillStyle = "#261e1a";
  g.fillRect(DXd + 0.05, sy, DW - 0.1, 0.028);
  for (let j = 0; j < 4; j++) {
    const px = DXd + 0.2 + j * 0.25,
      py = sy - 0.1;
    g.fillStyle = "#2c2623";
    g.beginPath();
    g.ellipse(px, py, 0.1, 0.098, 0, 0, 7);
    g.fill();
    g.fillStyle = "#24201d";
    g.beginPath();
    g.arc(px, py, 0.06, 0, 7);
    g.fill();
    g.strokeStyle = "rgba(240,195,140," + 0.1 * L + ")";
    g.lineWidth = 0.01;
    g.beginPath();
    g.arc(px, py, 0.092, -0.6, 0.4);
    g.stroke();
  }
}
// samplers: the true image — a man with one head, two arms, two legs — and the words
function sampler(cx, cy, w, h, txt, fs, norm) {
  const d = Math.hypot(cx - 0.3, cy + 1.1);
  const b = Math.max(0.28, L * Math.max(0, 1 - d / 4.3) * fl);
  g.fillStyle = "#1a1411";
  g.fillRect(cx - w / 2 - 0.04, cy - h / 2 - 0.04, w + 0.08, h + 0.08);
  const c = (a, z) => Math.round(a + (z - a) * Math.min(1, b));
  g.fillStyle = "rgb(" + c(48, 170) + "," + c(42, 150) + "," + c(36, 116) + ")";
  g.fillRect(cx - w / 2, cy - h / 2, w, h);
  g.strokeStyle = "rgba(110,48,40," + (0.3 + 0.5 * b) + ")";
  g.lineWidth = 0.011;
  g.setLineDash([0.022, 0.016]);
  g.strokeRect(cx - w / 2 + 0.04, cy - h / 2 + 0.04, w - 0.08, h - 0.08);
  g.setLineDash([]);
  let ty = cy;
  if (norm) {
    const fx = cx,
      fy = cy - h / 2 + 0.1;
    g.strokeStyle = "rgba(120,40,34," + (0.45 + 0.5 * b) + ")";
    g.lineWidth = 0.018;
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
  g.font = fs + "px Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(34,22,18," + (0.7 + 0.3 * b) + ")";
  g.fillText(txt, 0, 1);
  g.restore();
}
sampler(-0.45, -2.45, 0.95, 0.62, "Чти образ Божий", 9.5, 1);
sampler(-3.72, -2.62, 1.2, 0.32, "Береги чистоту рода", 9.5, 0);
// the hearth
const HX0 = 2.35,
  HX1 = 4.35,
  HC = (HX0 + HX1) / 2;
gr = g.createLinearGradient(HX0, 0, HX1, 0);
gr.addColorStop(0, "#221c1a");
gr.addColorStop(0.5, "#29221f");
gr.addColorStop(1, "#1d1817");
g.fillStyle = gr;
g.fillRect(HX0, -3.45, HX1 - HX0, 3.45);
for (let i = 0; i < 55; i++) {
  const x = HX0 + e.rnd() * (HX1 - HX0 - 0.3),
    y = -0.1 - e.rnd() * 3.2,
    w = 0.18 + e.rnd() * 0.2;
  g.fillStyle = "rgba(0,0,0," + (0.05 + e.rnd() * 0.07) + ")";
  g.fillRect(x, y, w, 0.12 + e.rnd() * 0.06);
}
g.fillStyle = "#251c18";
g.beginPath();
g.moveTo(HX0 - 0.12, -1.56);
g.lineTo(HX1 + 0.12, -1.57);
g.lineTo(HX1 + 0.1, -1.44);
g.lineTo(HX0 - 0.1, -1.43);
g.closePath();
g.fill();
{
  const cx = HC,
    cy = -2.3,
    w = 1.45,
    h = 0.3;
  g.fillStyle = "#2a201b";
  g.beginPath();
  g.moveTo(cx - w / 2, cy - h / 2);
  g.lineTo(cx + w / 2, cy - h / 2 + 0.01);
  g.lineTo(cx + w / 2 - 0.02, cy + h / 2);
  g.lineTo(cx - w / 2 + 0.01, cy + h / 2 - 0.01);
  g.closePath();
  g.fill();
  g.save();
  g.translate(cx, cy);
  g.scale(0.01, 0.01);
  g.font = "10px Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(165,134,100," + (0.5 + 0.35 * L) + ")";
  g.fillText("Блюди, не мутант ли", 0, 1);
  g.restore();
}
const op = new Path2D();
op.moveTo(HC - 0.65, 0);
op.lineTo(HC - 0.65, -1.08);
op.quadraticCurveTo(HC, -1.34, HC + 0.65, -1.08);
op.lineTo(HC + 0.65, 0);
op.closePath();
g.fillStyle = "#0d0a0a";
g.fill(op);
const em = 0.75 + 0.15 * Math.sin(T * 0.9) + 0.1 * Math.sin(T * 2.3 + 1);
g.globalCompositeOperation = "screen";
gr = g.createRadialGradient(LAMP.a, -1.25, 0.1, LAMP.a, -1.25, 4.3 * (0.97 + 0.03 * fl));
gr.addColorStop(0, "rgba(200,128,64," + 0.62 * L * fl + ")");
gr.addColorStop(0.35, "rgba(160,96,48," + 0.3 * L * fl + ")");
gr.addColorStop(1, "rgba(150,90,45,0)");
g.fillStyle = gr;
g.fillRect(-8, -4.6, 16, 4.7);
gr = g.createRadialGradient(HC, -0.3, 0.1, HC, -0.3, 2.0);
gr.addColorStop(0, "rgba(170,70,30," + 0.24 * em + ")");
gr.addColorStop(1, "rgba(170,70,30,0)");
g.fillStyle = gr;
g.fillRect(1, -3, 6, 3.1);
if (yd > 0.01) {
  gr = g.createRadialGradient(-6.8, -0.6, 0.1, -6.8, -0.6, 3.2);
  gr.addColorStop(0, "rgba(110,135,180," + 0.28 * yd + ")");
  gr.addColorStop(1, "rgba(110,135,180,0)");
  g.fillStyle = gr;
  g.fillRect(-8, -4.6, 6, 4.7);
}
g.globalCompositeOperation = "source-over";
gr = g.createLinearGradient(0, -3.45, 0, -2.7);
gr.addColorStop(0, "rgba(14,11,12,1)");
gr.addColorStop(1, "rgba(14,11,12,0)");
g.fillStyle = gr;
g.fillRect(-8, -4.6, 16, 1.9);
g.restore();
// the fire
g.save();
g.clip(op);
gr = g.createRadialGradient(HC, -0.05, 0.02, HC, -0.05, 0.8);
gr.addColorStop(0, "rgba(200,85,40," + 0.55 * em + ")");
gr.addColorStop(1, "rgba(120,40,20,0)");
g.fillStyle = gr;
g.fillRect(HC - 0.7, -1.4, 1.4, 1.4);
g.fillStyle = "#110c0b";
g.beginPath();
g.ellipse(HC - 0.15, -0.09, 0.32, 0.06, 0.08, 0, 7);
g.fill();
g.beginPath();
g.ellipse(HC + 0.2, -0.07, 0.28, 0.05, -0.12, 0, 7);
g.fill();
for (let i = 0; i < 26; i++) {
  const x = HC - 0.4 + e.rnd() * 0.8,
    y = -0.03 - e.rnd() * 0.12,
    ph = e.rnd() * 6.28,
    f = 0.5 + e.rnd() * 1.2,
    rr = 0.012 + e.rnd() * 0.012,
    cr = 190 + Math.round(e.rnd() * 40),
    cg = 70 + Math.round(e.rnd() * 40);
  const a = 0.35 + 0.6 * Math.max(0, Math.sin(T * f + ph));
  g.fillStyle = "rgba(" + cr + "," + cg + ",30," + a * 0.8 + ")";
  g.beginPath();
  g.arc(x, y, rr, 0, 7);
  g.fill();
}
g.strokeStyle = "#0b0909";
g.lineWidth = 0.012;
g.beginPath();
g.moveTo(HC - 0.3, -1.25);
g.lineTo(HC - 0.3, -0.6);
g.stroke();
g.fillStyle = "#0b0909";
g.beginPath();
g.moveTo(HC - 0.45, -0.58);
g.quadraticCurveTo(HC - 0.47, -0.38, HC - 0.3, -0.36);
g.quadraticCurveTo(HC - 0.13, -0.38, HC - 0.15, -0.58);
g.closePath();
g.fill();
for (let i = 0; i < 3; i++) {
  const ph = (T * 0.25 + i / 3) % 1;
  g.strokeStyle = "rgba(190,180,170," + 0.12 * (1 - ph) + ")";
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(HC - 0.3 + 0.04 * Math.sin(T + i), -0.6 - ph * 0.5);
  g.quadraticCurveTo(HC - 0.25, -0.7 - ph * 0.5, HC - 0.3 + 0.05 * Math.sin(T * 0.7 + i * 2), -0.8 - ph * 0.5);
  g.stroke();
}
g.restore();
e.light(HC, -0.08, 1.4, "#ff7a3c", 0.45 * em);
