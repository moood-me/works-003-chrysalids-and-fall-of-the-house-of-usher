// the elders' chair on the dais, behind the inspector (he sits in it facing us): its tall back with finials, a strip of
// the lamp's light down its edge
const lib = e.lib,
  S = e.state,
  t = e.t;
g.fillStyle = "#140f0f";
g.beginPath();
g.moveTo(-0.27, -0.45);
g.lineTo(-0.27, -1.5);
g.quadraticCurveTo(0, -1.62, 0.27, -1.5);
g.lineTo(0.27, -0.45);
g.closePath();
g.fill();
g.beginPath();
g.arc(-0.27, -1.54, 0.035, 0, 7);
g.arc(0.27, -1.54, 0.035, 0, 7);
g.fill();
g.fillRect(-0.27, -0.47, 0.04, 0.47);
g.fillRect(0.23, -0.47, 0.04, 0.47);
const L = lib.light(S, t);
g.fillStyle = "rgba(" + L.col.join(",") + "," + 0.12 * Math.min(1, L.k) + ")";
g.fillRect(-0.27, -1.5, 0.04, 1.05);
