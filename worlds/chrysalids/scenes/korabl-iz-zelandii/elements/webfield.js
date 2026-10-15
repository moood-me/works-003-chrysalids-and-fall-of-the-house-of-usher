// the web lying over the clearing, seen from above (plane): strands between tufts and bodies
const S = e.state || {},
  A = e.anim,
  T = e.t,
  w = typeof S.web === "number" ? S.web : 0;
if (w < 0.01) return;
g.lineCap = "round";
for (let i = 0; i < 260; i++) {
  const x1 = (A.hash(i, 1) - 0.5) * 34,
    y1 = (A.hash(i, 2) - 0.5) * 24;
  // the web reaches the far side first (under the ship) and the near side last
  const th = A.clamp(0.15 + (y1 / 24 + 0.5) * 0.45 + Math.abs(x1 - 2) / 40, 0, 0.9) * 0.9;
  const k = A.clamp((w - th) / 0.25, 0, 1);
  if (k <= 0) continue;
  const an = A.hash(i, 3) * 6.28,
    L = 0.8 + A.hash(i, 4) * 3.5;
  const x2 = x1 + Math.cos(an) * L,
    y2 = y1 + Math.sin(an) * L;
  g.strokeStyle = "rgba(238,230,236," + 0.32 * k + ")";
  g.lineWidth = 0.03 + A.hash(i, 5) * 0.03;
  g.beginPath();
  g.moveTo(x1, y1);
  g.quadraticCurveTo((x1 + x2) / 2 + 0.3, (y1 + y2) / 2 - 0.3, x2, y2);
  g.stroke();
  if (i % 3 === 0) {
    const tw = Math.max(0, Math.sin(T * (0.5 + A.hash(i, 6)) + i));
    g.fillStyle = "rgba(255,248,238," + 0.8 * k * tw + ")";
    g.beginPath();
    g.arc(x1, y1, 0.06, 0, 7);
    g.fill();
  }
}
