// the back wall of the meeting house, 7.5 m away: planks, four windows and the door cut out
// (the yard and the sky show through), the motto board, the lamp's light
const lib = e.lib,
  S = e.state,
  t = e.t;
const L = lib.light(S, t),
  F = lib.outside(S, t),
  D = lib.N(S.door);
const WIN = [
  [-5.9, 0.6],
  [-2.8, 0.7],
  [1.1, 0.7],
  [4.9, 0.6],
];
const WY0 = -2.9,
  WY1 = -1.5;
const DX0 = 2.0,
  DX1 = 3.0,
  DY = -2.1;
const holes = new Path2D();
holes.rect(-10, -4.3, 20, 4.3);
for (const [x, w] of WIN) holes.rect(x - w / 2, WY0, w, WY1 - WY0);
holes.rect(DX0, DY, DX1 - DX0, -DY);
g.save();
g.clip(holes, "evenodd");
let gr = g.createLinearGradient(0, -4.3, 0, 0);
gr.addColorStop(0, "#110d0f");
gr.addColorStop(1, "#1d1716");
g.fillStyle = gr;
g.fillRect(-10, -4.3, 20, 4.3);
for (let x = -10; x < 10; x += 0.24) {
  g.fillStyle = "rgba(" + (e.rnd() < 0.5 ? "0,0,0" : "255,235,210") + "," + (0.01 + e.rnd() * 0.02) + ")";
  g.fillRect(x, -4.3, 0.24, 4.3);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fillRect(x, -4.3, 0.012, 4.3);
}
g.fillStyle = "#171211";
g.fillRect(-10, -0.95, 20, 0.95);
g.fillStyle = "rgba(60,46,38,0.35)";
g.fillRect(-10, -0.98, 20, 0.03);
g.fillStyle = "#0f0b0c";
g.fillRect(-10, -4.3, 20, 0.22);
// the board over the elders' table
const b = Math.max(0.12, 0.55 * L.k * (L.low ? 0.8 : 1));
const bx = -0.3,
  by = -3.2,
  bw = 2.7,
  bh = 0.44;
g.fillStyle = "#1a1411";
g.fillRect(bx - bw / 2 - 0.05, by - bh / 2 - 0.05, bw + 0.1, bh + 0.1);
const c = (a, z) => Math.round(a + (z - a) * Math.min(1, b));
g.fillStyle = "rgb(" + c(44, 168) + "," + c(38, 142) + "," + c(32, 104) + ")";
g.fillRect(bx - bw / 2, by - bh / 2, bw, bh);
g.save();
g.translate(bx, by);
g.scale(0.01, 0.01);
g.font = "15px Georgia, serif";
g.textAlign = "center";
g.textBaseline = "middle";
g.fillStyle = "rgba(34,22,18," + (0.7 + 0.3 * b) + ")";
g.fillText("Благословенна норма", 0, 1);
g.restore();
// the main light on the wall
const ly = -L.Y,
  rad = (7.5 - L.d) * (L.low ? 2.4 : 2.1);
g.globalCompositeOperation = "screen";
gr = g.createRadialGradient(L.x, ly, 0.1, L.x, ly, rad);
gr.addColorStop(0, "rgba(" + L.col.join(",") + "," + 0.42 * Math.min(1.2, L.k) + ")");
gr.addColorStop(0.4, "rgba(" + L.col.join(",") + "," + 0.22 * Math.min(1.2, L.k) + ")");
gr.addColorStop(1, "rgba(" + L.col.join(",") + ",0)");
g.fillStyle = gr;
g.fillRect(-10, -4.3, 20, 4.3);
if (F > 0.01) {
  for (const x of [1.1, 2.5, 4.9]) {
    gr = g.createRadialGradient(x, -1.6, 0.1, x, -1.6, 2.2);
    gr.addColorStop(0, "rgba(220,100,45," + 0.25 * F + ")");
    gr.addColorStop(1, "rgba(220,100,45,0)");
    g.fillStyle = gr;
    g.fillRect(x - 2.2, -3.8, 4.4, 3.8);
  }
}
g.globalCompositeOperation = "source-over";
// under the table's height the lamp on it lights nothing
if (!L.low && L.k > 0.01) {
  gr = g.createLinearGradient(0, -1.2, 0, -0.6);
  gr.addColorStop(0, "rgba(12,9,10,0)");
  gr.addColorStop(1, "rgba(12,9,10," + 0.5 * Math.min(1, L.k) + ")");
  g.fillStyle = gr;
  g.fillRect(-3.5, -1.2, 6, 1.2);
}
g.restore();
// window frames and the door frame
g.fillStyle = "#1e1714";
for (const [x, w] of WIN) {
  const fw = 0.06;
  g.beginPath();
  g.rect(x - w / 2 - fw, WY0 - fw, w + 2 * fw, WY1 - WY0 + 2 * fw);
  g.rect(x - w / 2, WY0, w, WY1 - WY0);
  g.fill("evenodd");
  g.fillRect(x - 0.015, WY0, 0.03, WY1 - WY0);
  g.fillRect(x - w / 2, (WY0 + WY1) / 2 - 0.015, w, 0.03);
  g.fillStyle = "rgba(150,170,205,0.05)";
  g.fillRect(x - w / 2, WY0, w, WY1 - WY0);
  g.fillStyle = "#1e1714";
  g.fillRect(x - w / 2 - 0.1, WY1 + 0.05, w + 0.2, 0.05);
}
g.fillRect(DX0 - 0.08, DY - 0.1, DX1 - DX0 + 0.16, 0.1);
g.fillRect(DX0 - 0.08, DY, 0.08, -DY);
g.fillRect(DX1, DY, 0.08, -DY);
// the door leaf, hinged on the right, opening inward
const w = (DX1 - DX0) * Math.cos(D * 1.35);
if (w > 0.02) {
  const x0 = DX1 - w;
  g.fillStyle = "#18120f";
  g.beginPath();
  g.moveTo(x0, DY - 0.02 * D);
  g.lineTo(DX1, DY);
  g.lineTo(DX1, 0);
  g.lineTo(x0, 0.03 * D);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(0,0,0,0.4)";
  g.lineWidth = 0.012;
  for (let k = 1; k < 4; k++) {
    g.beginPath();
    g.moveTo(x0 + (w * k) / 4, DY);
    g.lineTo(x0 + (w * k) / 4, 0);
    g.stroke();
  }
  g.fillStyle = "rgba(" + L.col.join(",") + "," + 0.12 * Math.min(1, L.k) + ")";
  g.fillRect(x0, DY, w, -DY);
}
if (F > 0.01) e.light((DX0 + DX1) / 2, -1, 1.6, "#ff8040", 0.35 * F * (0.3 + 0.7 * D));
