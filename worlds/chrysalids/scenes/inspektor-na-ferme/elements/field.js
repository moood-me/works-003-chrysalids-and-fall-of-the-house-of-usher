const S = e.state || {},
  s = S.season ?? 0,
  r = S.rain ?? 0;
const M = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const C = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (a === undefined ? 1 : a) + ")";
const W = (x) => M(x, [x[0] * 0.74, x[1] * 0.75, x[2] * 0.8], r);
const base = W(M([182, 156, 102], [124, 110, 90], s));
g.fillStyle = C(base);
g.fillRect(-600, -200, 1200, 400);
const tones = [
  M([198, 172, 114], [138, 124, 104], s),
  M([158, 132, 86], [100, 88, 74], s),
  M([172, 152, 106], [116, 106, 94], s),
  M([142, 118, 80], [92, 80, 68], s),
];
for (let i = 0; i < 60; i++) {
  const x = -600 + e.rnd() * 1200,
    y = -200 + e.rnd() * 330,
    w = 50 + e.rnd() * 170,
    h = 25 + e.rnd() * 70;
  const c = W(tones[Math.floor(e.rnd() * 4)]);
  const rot = (e.rnd() - 0.5) * 0.3;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.fillStyle = C(c, 0.25);
  g.fillRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6);
  g.fillStyle = C(c, 0.45);
  g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
}
g.strokeStyle = C(M(base, [70, 58, 44], 0.35), 0.14);
g.lineWidth = 0.22;
g.beginPath();
for (let x = -260; x < 260; x += 1.4) {
  g.moveTo(x, -200);
  g.lineTo(x + 3, 200);
}
g.stroke();
const rd = W(M([204, 186, 146], [152, 142, 126], s));
g.lineCap = "round";
g.strokeStyle = C(rd, 0.75);
g.lineWidth = 3.6;
g.beginPath();
g.moveTo(600, 138);
g.bezierCurveTo(300, 142, 90, 148, 34, 156);
g.bezierCurveTo(12, 160, 4, 176, 0, 200);
g.stroke();
g.strokeStyle = C(M(rd, [90, 78, 60], 0.4), 0.35);
g.lineWidth = 0.35;
for (const o of [-0.9, 0.9]) {
  g.beginPath();
  g.moveTo(600, 138 + o);
  g.bezierCurveTo(300, 142 + o, 90, 148 + o, 34, 156 + o);
  g.bezierCurveTo(12 + o, 160, 4 + o, 176, o, 200);
  g.stroke();
}
