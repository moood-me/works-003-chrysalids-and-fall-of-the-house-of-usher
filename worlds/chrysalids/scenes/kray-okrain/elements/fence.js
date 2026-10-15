const rim = "#7584a4",
  col = "#141c2b";
g.lineCap = "round";
const posts = [];
for (let k = 0; k <= 27; k++) {
  const x = -34 + k * 2.6;
  if (Math.abs(x - 2.4) < 0.3) continue;
  posts.push([x + (e.rnd() - 0.5) * 0.5, (e.rnd() - 0.5) * 0.16, 1.05 + e.rnd() * 0.35]);
}
g.strokeStyle = col;
g.lineWidth = 0.09;
for (const r of [0.42, 0.9]) {
  for (let i = 0; i < posts.length - 1; i++) {
    const a = posts[i],
      b = posts[i + 1];
    const br = e.rnd();
    if (a[0] < 1.4 && b[0] > 1.4) continue;
    if (br < 0.1) continue;
    const ya = -r * a[2],
      yb = -r * b[2];
    const xa = a[0] + Math.sin(a[1]) * r * a[2],
      xb = b[0] + Math.sin(b[1]) * r * b[2];
    g.beginPath();
    g.moveTo(xa, ya);
    g.quadraticCurveTo((xa + xb) / 2, (ya + yb) / 2 + 0.07, xb, yb);
    g.stroke();
    g.strokeStyle = "rgba(122,136,168,0.55)";
    g.lineWidth = 0.025;
    g.beginPath();
    g.moveTo(xa, ya - 0.04);
    g.quadraticCurveTo((xa + xb) / 2, (ya + yb) / 2 + 0.03, xb, yb - 0.04);
    g.stroke();
    g.strokeStyle = col;
    g.lineWidth = 0.09;
  }
}
for (const p of posts) {
  g.save();
  g.translate(p[0], 0);
  g.rotate(p[1]);
  g.fillStyle = col;
  g.fillRect(-0.07, -p[2], 0.14, p[2]);
  g.fillStyle = rim;
  g.globalAlpha = 0.4;
  g.fillRect(-0.07, -p[2], 0.03, p[2]);
  g.globalAlpha = 0.75;
  g.fillRect(-0.07, -p[2], 0.14, 0.03);
  g.globalAlpha = 1;
  g.restore();
}
g.strokeStyle = col;
g.lineWidth = 0.08;
g.beginPath();
g.moveTo(-0.15, -0.85);
g.lineTo(0.9, -0.05);
g.stroke();
g.strokeStyle = "rgba(122,136,168,0.4)";
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(-0.15, -0.89);
g.lineTo(0.9, -0.09);
g.stroke();
const cr = 0.03 * Math.sin(e.t * 0.21) + 0.015 * Math.sin(e.t * 0.53);
g.save();
g.translate(2.55, 0);
g.rotate(-0.07 + cr * 0.3);
g.fillStyle = col;
g.fillRect(-0.11, -2.5, 0.22, 2.5);
g.beginPath();
g.arc(0, -2.5, 0.13, 0, 7);
g.fill();
g.fillStyle = rim;
g.globalAlpha = 0.5;
g.fillRect(-0.11, -2.45, 0.035, 2.45);
g.beginPath();
g.arc(0, -2.5, 0.13, Math.PI * 1.05, Math.PI * 1.7);
g.lineTo(0, -2.5);
g.fill();
g.globalAlpha = 1;
g.fillStyle = col;
g.save();
g.translate(0, -1.95);
g.rotate(-0.12 + cr);
g.fillRect(-0.75, -0.16, 0.85, 0.32);
g.fillStyle = rim;
g.globalAlpha = 0.55;
g.fillRect(-0.75, -0.16, 0.85, 0.03);
g.restore();
g.globalAlpha = 1;
const f = Math.sin(e.t * 0.8) * 0.12 + Math.sin(e.t * 1.37) * 0.06;
g.fillStyle = "rgba(125,136,158,0.55)";
g.beginPath();
g.moveTo(0.1, -2.25);
g.quadraticCurveTo(0.35, -2.2 + f, 0.55 + f, -1.95);
g.lineTo(0.45 + f * 0.8, -1.88);
g.quadraticCurveTo(0.3, -2.05 + f, 0.1, -2.1);
g.closePath();
g.fill();
g.restore();
