// The Mortons' farm on the far rise: Rosalind's lit window. Flares when a thought-shape arrives / leaves.
const S = e.state,
  t = e.t;
const uo = ((S.tho_d ?? 4.3) - 4.3) / 55.7,
  ui = ((S.thi_d ?? 4.3) - 4.3) / 55.7;
const fl =
  Math.max(uo > 0.8 && uo < 0.999 ? (uo - 0.8) / 0.2 : 0, ui > 0.75 && ui < 0.999 ? (ui - 0.75) / 0.25 : 0) *
  (S.th_amp ?? 1);
g.fillStyle = "#121a2e";
g.beginPath();
g.moveTo(-26, 1);
g.bezierCurveTo(-14, -2, -8, -6.2, 0, -6.3);
g.bezierCurveTo(8, -6.2, 14, -3, 26, 1);
g.closePath();
g.fill();
g.fillStyle = "#0f1628";
g.fillRect(-2.2, -8.8, 3.8, 2.8);
g.beginPath();
g.moveTo(-2.6, -8.7);
g.lineTo(-0.4, -10.4);
g.lineTo(2.0, -8.7);
g.fill();
g.fillRect(2.8, -8.0, 2.6, 2.0);
g.beginPath();
g.moveTo(2.6, -7.9);
g.lineTo(4.1, -9.0);
g.lineTo(5.6, -7.9);
g.fill();
for (const [x, h] of [
  [-6, 3.0],
  [-7.2, 2.4],
  [8.2, 2.7],
]) {
  g.beginPath();
  g.ellipse(x, -5.4 - h * 0.5, h * 0.45, h * 0.55, 0, 0, 7);
  g.fill();
}
const k = 0.72 + 0.12 * Math.sin(t * 0.9) + 0.6 * fl;
g.fillStyle = "rgba(236,186,110," + Math.min(1, k).toFixed(3) + ")";
g.fillRect(-0.4, -8.05, 0.8, 0.9);
e.light(0, -7.6, 4 + 12 * fl, "#e8b46a", 0.45 + 0.55 * fl);
