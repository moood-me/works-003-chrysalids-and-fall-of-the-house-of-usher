const s = Math.max(0, Math.min(1, typeof e.state.steam === "number" ? e.state.steam : 1)),
  t = e.t;
if (s < 0.01) return;
g.lineCap = "round";
for (let i = 0; i < 4; i++) {
  const ph = (t * 0.18 + i / 4) % 1,
    a = s * 0.22 * Math.sin(ph * Math.PI);
  g.strokeStyle = "rgba(235,215,185," + a + ")";
  g.lineWidth = 0.025 * (1 + ph);
  g.beginPath();
  const x0 = 0.03 * Math.sin(t * 0.7 + i * 2),
    y0 = -0.03 - ph * 0.35;
  g.moveTo(x0, y0);
  g.bezierCurveTo(
    x0 + 0.05 * Math.sin(t * 1.1 + i),
    y0 - 0.06,
    x0 - 0.05 * Math.sin(t * 0.9 + i),
    y0 - 0.12,
    x0 + 0.03 * Math.sin(t * 0.6 + i * 3),
    y0 - 0.18,
  );
  g.stroke();
}
