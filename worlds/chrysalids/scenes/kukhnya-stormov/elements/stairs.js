// the stairs behind the stair door, going straight up away from it into the dark (lib.STEP; the land there: relief.js):
// each step a block of its own at its own depth — its front and the lip of its tread, lit from the kitchen — and the
// stairwell's far wall behind them
const L = e.state.lamp === true ? 1 : Math.max(0, Math.min(1, +e.state.lamp || 0)),
  S = e.lib.STEP,
  D = e.lib.DOOR,
  w = D.a1 - D.a0 + 0.1,
  x0 = D.a0 - 0.05 - e.spot.across;
for (let i = 0; i < S.n; i++) {
  const top = S.rise * (i + 1),
    fade = Math.max(0, 1 - i / (S.n - 2));
  e.part(0, S.d - e.spot.distance + S.run * i, (g2) => {
    g2.fillStyle = "#151112";
    g2.fillRect(x0, -top, w, top);
    g2.fillStyle = "rgba(150,100,60," + (0.1 + 0.18 * L * fade) + ")";
    g2.fillRect(x0, -top, w, 0.014);
    g2.fillStyle = "rgba(0,0,0,0.35)";
    g2.fillRect(x0, -top + 0.014, w, 0.05);
  }, [x0, -top, x0 + w, 0]);
}
// the far wall of the stairwell, above the top step
e.part(0, S.d - e.spot.distance + S.run * S.n, (g2) => {
  const gr = g2.createLinearGradient(0, -4, 0, 0);
  gr.addColorStop(0, "#0c0a0b");
  gr.addColorStop(1, "rgba(" + Math.round(30 + 20 * L) + ",28,30,1)");
  g2.fillStyle = gr;
  g2.fillRect(x0 - 0.3, -4.2, w + 0.6, 4.2);
}, [x0 - 0.3, -4.2, x0 + w + 0.3, 0]);
