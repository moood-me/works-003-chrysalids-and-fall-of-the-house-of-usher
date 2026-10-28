const A = e.aspect,
  L = e.lib,
  lt = L.light(e.state || {}),
  H = 0.5;
const T = (dusk, dark, day) => L.tone(lt, dusk, day, 1, dark);
let gr = g.createLinearGradient(0, -0.35, 0, H);
gr.addColorStop(0, T("#10151b", "#080b0f", "#6c757a"));
gr.addColorStop(0.5, T("#242d36", "#161c24", "#899196"));
gr.addColorStop(0.84, T("#58646e", "#3a4652", "#a6adb0"));
gr.addColorStop(1, T("#849096", "#58646e", "#b9bebf"));
g.fillStyle = gr;
g.fillRect(-0.4, -0.4, A + 0.8, H + 0.41);
let wg = g.createLinearGradient(0, H, 0, 1.25);
wg.addColorStop(0, T("#5c6870", "#3c4852", "#8b9497"));
wg.addColorStop(0.06, T("#2c383e", "#1e262e", "#5b666a"));
wg.addColorStop(0.3, T("#101a1d", "#0b1216", "#323d41"));
wg.addColorStop(1, T("#070b0d", "#05080a", "#1b2427"));
g.fillStyle = wg;
g.fillRect(-0.4, H, A + 0.8, 0.85);
function blob(cx, cy, rx, ry, c) {
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  rg.addColorStop(0, c);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.save();
  g.translate(cx, cy);
  g.scale(rx, ry);
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
const glow = 1 - 0.6 * lt.dark;
blob(A / 2, H - 0.02, 0.85, 0.2, "rgba(166,176,182," + 0.38 * glow + ")");
blob(A / 2, H - 0.005, 0.55, 0.05, "rgba(186,194,198," + 0.3 * glow + ")");
blob(A / 2, H + 0.02, 0.7, 0.06, "rgba(130,142,150," + 0.22 * glow + ")");
