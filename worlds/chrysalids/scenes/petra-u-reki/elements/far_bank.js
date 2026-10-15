// the far bank, 28 m off: from the water's edge (y 0) up a grassy slope to the field's edge (y -1.6); alders at the sides, the middle open
const top = (x) => -2.4 - 0.12 * Math.sin(x / 7 + 0.6) - 0.06 * Math.sin(x / 2.3);
const foot = (x) => 0.02 * Math.sin(x * 1.7);
const slopeTo = (x, v) => foot(x) + (top(x) - foot(x)) * v; // v 0 the water's edge .. 1 the top
g.beginPath();
g.moveTo(-70, 0.4);
for (let x = -70; x <= 70; x += 0.5) g.lineTo(x, top(x));
g.lineTo(70, 0.4);
g.closePath();
let gr = g.createLinearGradient(0, -2.6, 0, 0.4);
gr.addColorStop(0, "#6d6c5c");
gr.addColorStop(0.45, "#5d5b4d");
gr.addColorStop(0.8, "#4b4940");
gr.addColorStop(1, "#3d3c35");
g.fillStyle = gr;
g.fill();
// the field's edge: a band of lighter stubble along the top, the slope's wet clay lower down
g.save();
g.clip();
for (let i = 0; i < 320; i++) {
  const x = -68 + e.rnd() * 136,
    v = e.rnd();
  const y = slopeTo(x, v) + 0.02;
  const L = 0.15 + e.rnd() * 0.45;
  g.globalAlpha = 0.12 + e.rnd() * 0.1;
  g.strokeStyle = v > 0.6 ? (e.rnd() < 0.5 ? "#7f7c69" : "#5a5949") : e.rnd() < 0.5 ? "#3f3e36" : "#6b685a";
  g.lineWidth = 0.03 + e.rnd() * 0.04;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + (e.rnd() - 0.5) * 0.2, y - L * (0.4 + v));
  g.stroke();
}
g.globalAlpha = 0.35;
g.fillStyle = "#3a3934";
g.beginPath();
g.moveTo(-70, 0.4);
for (let x = -70; x <= 70; x += 0.5) g.lineTo(x, foot(x) - 0.12 - 0.05 * Math.sin(x * 0.9));
g.lineTo(70, 0.4);
g.closePath();
g.fill();
g.restore();
g.globalAlpha = 1;
// grass along the top, stirring
g.lineCap = "round";
for (let i = 0; i < 700; i++) {
  const x = -68 + e.rnd() * 136;
  const by = top(x) + 0.05;
  const h = 0.12 + e.rnd() * 0.35;
  const ph = e.rnd() * 6.28;
  const s = 0.05 * Math.sin(e.t * 0.7 + ph + x * 0.2) + 0.025 * Math.sin(e.t * 0.27 + ph);
  g.globalAlpha = 0.75;
  g.strokeStyle = e.rnd() < 0.5 ? "#5c5f4c" : "#707158";
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(x, by);
  g.quadraticCurveTo(x + s * 0.4, by - h * 0.5, x + s, by - h);
  g.stroke();
}
// reeds at the water's edge
for (let i = 0; i < 260; i++) {
  const x = -68 + e.rnd() * 136;
  if (x > -4 && x < 10 && e.rnd() < 0.75) continue;
  const h = 0.3 + e.rnd() * 0.9;
  const ph = e.rnd() * 6.28;
  const s = 0.06 * h * Math.sin(e.t * 0.55 + ph) + 0.03 * h * Math.sin(e.t * 0.21 + ph);
  g.globalAlpha = 0.85;
  g.strokeStyle = e.rnd() < 0.5 ? "#3d4236" : "#4b5042";
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(x, 0.02);
  g.quadraticCurveTo(x + s * 0.3, -h * 0.5, x + s, -h);
  g.stroke();
}
g.globalAlpha = 1;
// alders at the sides (the middle stays open: there the people are)
function alder(ax, h, lean, cA, cB) {
  const by = top(ax) + 0.1;
  const tx = ax + lean * h * 0.4,
    ty = by - h * 0.52;
  g.fillStyle = cA;
  g.beginPath();
  g.moveTo(ax - 0.22, by);
  g.quadraticCurveTo(ax - 0.1 + lean * h * 0.2, by - h * 0.3, tx - 0.08, ty);
  g.lineTo(tx + 0.08, ty);
  g.quadraticCurveTo(ax + 0.12 + lean * h * 0.2, by - h * 0.3, ax + 0.22, by);
  g.closePath();
  g.fill();
  const sw = 0.1 * Math.sin(e.t * 0.31 + ax) + 0.05 * Math.sin(e.t * 0.13 + ax * 2);
  for (let k = 0; k < 170; k++) {
    const a = e.rnd() * 6.28,
      rr = Math.pow(e.rnd(), 0.6);
    const cx = tx + Math.cos(a) * rr * h * 0.4 + sw * rr,
      cy = ty - h * 0.06 + Math.sin(a) * rr * h * 0.3 + rr * rr * h * 0.05;
    const r = h * (0.03 + e.rnd() * 0.045);
    g.globalAlpha = 0.55 + e.rnd() * 0.35;
    g.fillStyle = e.rnd() < 0.55 ? cA : cB;
    g.beginPath();
    g.ellipse(cx, cy, r * 1.4, r, e.rnd(), 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
}
alder(-25, 6.5, -0.1, "#4f5650", "#5b625b");
alder(-18, 7.5, 0.12, "#4a514b", "#565d56");
alder(-12.5, 5.5, 0.2, "#555c55", "#60675f");
alder(13.5, 6.5, -0.18, "#4c534d", "#59605a");
alder(19, 8, 0.06, "#474e48", "#545b54");
alder(25, 6, 0, "#535a53", "#5f665e");
// a cart track along the top, to the left — where the late ones come from
g.globalAlpha = 0.25;
g.strokeStyle = "#4a483e";
g.lineWidth = 0.08;
g.beginPath();
for (let x = -60; x <= 10; x += 0.5) {
  const y = top(x) + 0.04;
  x === -60 ? g.moveTo(x, y) : g.lineTo(x, y);
}
g.stroke();
g.globalAlpha = 1;
