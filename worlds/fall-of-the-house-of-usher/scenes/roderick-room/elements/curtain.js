// The curtain over the windows: two halves of wine-black velvet hanging from the rod (the wall's), gathered at the sides
// or drawn across. Each half is painted drawn — its folds wide — and gathered toward its outer edge by animate as
// `curtain` falls (its folds narrowing as they would: they are spaced evenly between its edges); gathered, its hollows
// deepen (the "deep" layers, multiplied in). The draught of the open window (`window_open`: the light's wind, a look)
// stirs it, the hem most. Drawn, a sliver of the glass shows where the halves meet.
const { mix, span } = e.anim;
const ROD = -7.05,
  HEM = -3.5,
  OUT = 2.45,
  IN = 0.015,
  FOLDS = 9;
const WIND = { strength: 0.12, gust: 0.7, scale: 1.5 };
for (const s of [-1, 1]) {
  const xo = s * OUT,
    xi = s * IN;
  const side = s < 0 ? "l" : "r";
  const P = new Path2D();
  P.moveTo(xo, ROD);
  P.lineTo(xi, ROD);
  P.lineTo(xi, HEM);
  // the hem: a soft wave, one dip per fold
  for (let i = FOLDS; i >= 0; i--) P.lineTo(mix(xo, xi, i / FOLDS), HEM + (i % 2 ? 0.035 : -0.01));
  P.closePath();
  const folds = (c, paint) => {
    for (let i = 0; i < FOLDS; i++) {
      const x0 = mix(xo, xi, i / FOLDS),
        x1 = mix(xo, xi, (i + 1) / FOLDS);
      paint(c, Math.min(x0, x1), Math.abs(x1 - x0));
    }
  };
  // the half, drawn: the folds' light ridges and dark hollows, shallow where it is spread
  e.layer("half_" + side, { pivot: [xo, ROD], wind: WIND }, (c) => {
    c.fillStyle = "#6a3440";
    c.fill(P);
    c.save();
    c.clip(P);
    const depth = 0.24;
    folds(c, (c, a, fw) => {
      const fg = c.createLinearGradient(a, 0, a + fw, 0);
      fg.addColorStop(0, "rgba(0,0,0," + depth + ")");
      fg.addColorStop(0.45, "rgba(150,96,104," + depth * 0.5 + ")");
      fg.addColorStop(0.6, "rgba(176,120,124," + depth * 0.35 + ")");
      fg.addColorStop(1, "rgba(0,0,0," + depth * 0.8 + ")");
      c.fillStyle = fg;
      c.fillRect(a - 0.01, ROD, fw + 0.02, HEM - ROD + 0.1);
    });
    // its top in the rod's shadow
    const top = c.createLinearGradient(0, ROD, 0, ROD + 0.9);
    top.addColorStop(0, "rgba(0,0,0,0.5)");
    top.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = top;
    c.fillRect(-OUT, ROD, 2 * OUT, 0.9);
    c.restore();
  });
  // ... and the hollows that deepen as it is gathered (multiplied over it)
  e.layer("deep_" + side, { pivot: [xo, ROD], wind: WIND, blend: "multiply" }, (c) => {
    c.save();
    c.clip(P);
    folds(c, (c, a, fw) => {
      const fg = c.createLinearGradient(a, 0, a + fw, 0);
      fg.addColorStop(0, "rgba(110,84,88,1)");
      fg.addColorStop(0.3, "rgba(255,255,255,1)");
      fg.addColorStop(0.7, "rgba(255,255,255,1)");
      fg.addColorStop(1, "rgba(130,104,108,1)");
      c.fillStyle = fg;
      c.fillRect(a - 0.01, ROD, fw + 0.02, HEM - ROD + 0.1);
    });
    c.restore();
  });
}
