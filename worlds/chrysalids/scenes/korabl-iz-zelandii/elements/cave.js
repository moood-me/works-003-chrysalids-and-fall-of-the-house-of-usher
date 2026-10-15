// the rock with the cave mouth, behind the ledge (metres at its own distance)
const S = e.state || {},
  d = typeof S.dawn === "number" ? S.dawn : 0.5,
  A = e.anim;
const top = (x) => 2.7 + 0.5 * Math.sin(x * 0.9) + 0.3 * Math.sin(x * 2.3) - Math.max(0, x + 3.2) * 1.05;
{
  const gr = g.createLinearGradient(-6, -3.4, -1, 0.1);
  gr.addColorStop(0, "#3b3442");
  gr.addColorStop(0.6, "#302a37");
  gr.addColorStop(1, "#221e28");
  g.fillStyle = gr;
}
g.beginPath();
g.moveTo(-16, 0.05);
for (let x = -16; x <= 0.2; x += 0.25) g.lineTo(x, -Math.max(0, top(x)));
g.lineTo(0.2, 0.05);
g.closePath();
g.fill();
g.strokeStyle = "rgba(214,180,182," + 0.28 * d + ")";
g.lineWidth = 0.04;
g.beginPath();
for (let x = -16; x <= -1.4; x += 0.25) x === -16 ? g.moveTo(x, -top(x)) : g.lineTo(x, -top(x));
g.stroke();
for (let i = 0; i < 30; i++) {
  const x = -15 + A.hash(i, 1) * 14,
    h = 0.4 + A.hash(i, 2) * 2.6;
  if (h > top(x) - 0.2) continue;
  g.strokeStyle = "rgba(20,16,24,0.35)";
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(x, -h);
  g.lineTo(x + (A.hash(i, 3) - 0.5) * 0.6, -h + A.hash(i, 4) * 0.4);
  g.stroke();
}
// the mouth: deep dark, a little above the ledge
const mx = -6.6,
  my = -0.55,
  mw = 1.7,
  mh = 1.5;
g.fillStyle = "#120f16";
g.beginPath();
g.moveTo(mx - mw, my);
g.quadraticCurveTo(mx - mw * 1.05, my - mh * 1.1, mx - mw * 0.2, my - mh * 1.05);
g.quadraticCurveTo(mx + mw * 0.9, my - mh, mx + mw, my);
g.closePath();
g.fill();
