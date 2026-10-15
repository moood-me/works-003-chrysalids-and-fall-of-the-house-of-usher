// the yard and the barn beyond the hall, seen through the windows and the door
const F = e.lib.outside(e.state, e.t);
const t = e.t;
g.fillStyle = "#0e121c";
g.fillRect(-40, -2, 80, 2.2);
g.fillStyle = "#0a0d15";
g.beginPath();
g.moveTo(-40, -1.2);
for (let x = -40; x <= 40; x += 2) g.lineTo(x, -1.2 - 1.2 * Math.abs(Math.sin(x * 0.13)) - 0.6 * e.rnd());
g.lineTo(40, 0.2);
g.lineTo(-40, 0.2);
g.closePath();
g.fill();
// the barn, right of the door's line of sight
const bx = 12;
g.fillStyle = "#0b0a0f";
g.beginPath();
g.moveTo(bx - 7, 0);
g.lineTo(bx - 7, -4);
g.lineTo(bx, -8);
g.lineTo(bx + 7, -4);
g.lineTo(bx + 7, 0);
g.closePath();
g.fill();
if (F > 0.01) {
  let gr = g.createRadialGradient(bx, -4, 0.5, bx, -4, 14);
  gr.addColorStop(0, "rgba(255,150,70," + 0.55 * F + ")");
  gr.addColorStop(1, "rgba(255,110,50,0)");
  g.fillStyle = gr;
  g.fillRect(bx - 20, -18, 40, 18.2);
  for (let i = 0; i < 9; i++) {
    const x = bx - 6 + i * 1.5,
      ph = e.rnd() * 6.28,
      h = (2.5 + 2.5 * e.rnd()) * F * (0.75 + 0.25 * Math.sin(t * (3 + i * 0.7) + ph));
    const y0 = -4 - (4 - Math.abs(x - bx) * 0.57) * 0.9;
    gr = g.createLinearGradient(0, y0, 0, y0 - h);
    gr.addColorStop(0, "rgba(255,200,110," + 0.9 * F + ")");
    gr.addColorStop(1, "rgba(255,90,40,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(x - 0.8, y0 + 0.5);
    g.quadraticCurveTo(x + 0.4 * Math.sin(t * 2.1 + ph), y0 - h * 0.6, x + 0.3 * Math.sin(t * 1.3 + ph), y0 - h);
    g.quadraticCurveTo(x + 0.5, y0 - h * 0.4, x + 0.8, y0 + 0.5);
    g.closePath();
    g.fill();
  }
  for (let i = 0; i < 24; i++) {
    const ph = e.rnd(),
      u = (t * (0.15 + 0.1 * e.rnd()) + ph) % 1;
    g.fillStyle = "rgba(255,190,110," + (1 - u) * 0.8 * F + ")";
    g.beginPath();
    g.arc(bx - 5 + e.rnd() * 10 + 1.5 * Math.sin(t * 0.7 + i), -6 - u * 10, 0.08, 0, 7);
    g.fill();
  }
  e.light(bx, -5, 9, "#ff8a40", 0.6 * F);
}
