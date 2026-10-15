// The lit upper window (UW[0]): the lamp in the room behind it, a glow on the dusk (glows: the dusk does not darken
// it; the tarn mirrors it). Not lit by day. Its animate dims it as the gloom deepens.
const L = e.lib, lt = L.light(e.state || {});
if (lt.lamp > 0.01) e.layer("lamp", {}, (g) => {
  g.globalAlpha = Math.min(1, lt.lamp / 0.45);
  L.lampWindow(g);
  e.light(-12, -11.4, 3, "#e0ac72", 1.4 * lt.lamp, "lamp");
});
