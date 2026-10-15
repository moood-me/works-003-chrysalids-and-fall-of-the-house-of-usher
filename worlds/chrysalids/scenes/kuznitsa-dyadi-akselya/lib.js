// shared by the scene's elements and its script: the thought-shapes, the bellows, where things are
// the thought-shape: three soft arcs travelling in `dir` (radians on screen), `a` how bright, `r` size (element metres)
function shape(g, e, dir, a, r) {
  if (a <= 0.004) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  const gl = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.4);
  gl.addColorStop(0, "rgba(190,200,255," + (0.3 * a).toFixed(3) + ")");
  gl.addColorStop(1, "rgba(190,200,255,0)");
  g.fillStyle = gl;
  g.fillRect(-r * 2.5, -r * 2.5, r * 5, r * 5);
  for (let i = 0; i < 3; i++) {
    const rr = r * (0.45 + i * 0.42),
      wob = 0.08 * Math.sin(e.t * 3 + i * 2);
    g.strokeStyle = "rgba(208,216,255," + (a * (0.9 - i * 0.24)).toFixed(3) + ")";
    g.lineWidth = Math.max(e.px * 1.3, r * 0.1);
    g.beginPath();
    g.arc(-Math.cos(dir) * r * 0.9, -Math.sin(dir) * r * 0.9, rr, dir - 0.8 + wob, dir + 0.8 + wob);
    g.stroke();
  }
  g.restore();
}
// the bellows on the forge's left (the forge's own metres): `pump` 0 (its top board up) … 1 (pressed down);
// the lever rises from the board's end to the handle David pulls down
function bellows(pump) {
  const open = 0.2 - 0.17 * Math.max(0, Math.min(1, pump || 0));
  return { open, end: [-1.75, -0.95 - open], handle: [-2.02, -1.4 - open] };
}
const FORGE = [-3.8, 6.5]; // where the forge stands (across, distance)
// David's head on the barrel (across, height, distance) — where his thoughts go out from — and the far window
const HEAD = [1.3, 1.28, 4.3],
  WIN = [23.6, 7.6, 60];
return { shape, HEAD, WIN, bellows, FORGE };
