// The candles on the table: a three-branch candlestick (the anchor) and two tall candles beside it (lib.js CANDLES) — the
// room's only warm light. Painted once: the iron, the wax, and every flame at its fullest (layer "flames"); how lit each
// is (`candles` 0…1.6: dimmed toward 0.3 the side ones go out and the middle one shrinks, past 1 the tall ones are
// lit), how it flickers, sways and jumps with the guitar (`strum`, `wild`) is its shader's (candles.glsl, uniforms from
// animate) — and each flame's light (c0…c4: the scene's lights take them over) its animate's.
const CANDLES = e.lib.CANDLES;
g.fillStyle = "#2a3034";
g.beginPath();
g.ellipse(0, -0.835, 0.1, 0.018, 0, 0, 7);
g.fill();
g.fillRect(-0.01, -0.9, 0.02, 0.07);
g.fillRect(-0.1, -0.9, 0.2, 0.014);
// the tall candles' holders: a dish and a short stem
for (const x of [-0.5, 0.17]) {
  g.beginPath();
  g.ellipse(x, -0.84, 0.045, 0.012, 0, 0, 7);
  g.fill();
  g.fillRect(x - 0.008, -0.875, 0.016, 0.035);
}
CANDLES.forEach(([x, h, base], i) => {
  g.fillStyle = "#2a3034";
  g.beginPath();
  g.ellipse(x, base, 0.03, 0.009, 0, 0, 7);
  g.fill();
  // the wax, old ivory, a drip down its side
  const wg = g.createLinearGradient(x - 0.018, 0, x + 0.018, 0);
  wg.addColorStop(0, "#e2d4bc");
  wg.addColorStop(1, "#a89c88");
  g.fillStyle = wg;
  g.beginPath();
  g.moveTo(x - 0.017, base);
  g.lineTo(x - 0.017, base - h);
  g.quadraticCurveTo(x, base - h - 0.006, x + 0.017, base - h + 0.003);
  g.lineTo(x + 0.017, base);
  g.closePath();
  g.fill();
  g.fillRect(x + 0.012, base - h + 0.01, 0.008, 0.05);
  // the wick
  g.strokeStyle = "#1a1612";
  g.lineWidth = 0.002;
  g.beginPath();
  g.moveTo(x, base - h);
  g.lineTo(x + 0.001, base - h - 0.008);
  g.stroke();
  e.at(x, base - h - 0.004, "wick" + i);
  // its light (a small glow at the flame's heart; how far it reaches is the scene's lights')
  e.light(x, base - h - 0.02, 0.45, "#ffb066", 0.6, "c" + i);
});
e.at(0, -1.0);
// every flame at its fullest: a teardrop from the wick, white-gold at its heart
e.layer("flames", {}, (c) => {
  for (const [x, h, base] of CANDLES) {
    const top = base - h,
      fh = 0.05;
    const fg = c.createRadialGradient(x, top - fh * 0.35, 0, x, top - fh * 0.35, fh);
    fg.addColorStop(0, "rgba(255,246,222,1)");
    fg.addColorStop(0.5, "rgba(255,196,110,0.9)");
    fg.addColorStop(1, "rgba(255,140,60,0)");
    c.fillStyle = fg;
    c.beginPath();
    c.moveTo(x, top - fh);
    c.quadraticCurveTo(x + 0.014, top - fh * 0.25, x, top + 0.002);
    c.quadraticCurveTo(x - 0.014, top - fh * 0.25, x, top - fh);
    c.fill();
  }
});
