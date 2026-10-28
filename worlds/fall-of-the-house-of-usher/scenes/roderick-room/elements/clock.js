// A tall case clock against the right wall, dark mahogany, an ivory dial, brass behind its glass door. Painted once: the
// case (its door an opening), behind it — inside the case — its dark back and the chains ("inside"), the two weights
// ("weights": wound up high or run low, `clock`) and the pendulum ("pendulum", hung from its pivot, swinging: `clock` 0
// stopped, 0.5 going as found, 1 wound and swinging full) — moved by animate; and the glass's faint sheen over them.
const WOOD = "#3a2620";
// the door's outline into a path
const doorPath = (p) => {
  p.moveTo(-0.105, -0.46);
  p.lineTo(-0.105, -1.36);
  p.quadraticCurveTo(-0.105, -1.46, 0, -1.48);
  p.quadraticCurveTo(0.105, -1.46, 0.105, -1.36);
  p.lineTo(0.105, -0.46);
  p.closePath();
  return p;
};
const door = doorPath(new Path2D());
// what is inside the case, seen through the door (behind the case's face)
e.layer("inside", { depth: -0.08 }, (c) => {
  c.fillStyle = "#140e0b";
  c.fillRect(-0.16, -1.54, 0.32, 1.12);
  for (const x of [-0.055, 0.055]) {
    c.strokeStyle = "rgba(170,140,96,0.6)";
    c.lineWidth = 0.004;
    c.beginPath();
    c.moveTo(x, -1.56);
    c.lineTo(x, -0.44);
    c.stroke();
  }
});
// the weights, run low (animate lifts them as it is wound)
e.layer("weights", { depth: -0.06 }, (c) => {
  for (const x of [-0.055, 0.055]) {
    const y = -0.6 + (x > 0 ? 0.05 : 0);
    const wg = c.createLinearGradient(x - 0.022, 0, x + 0.022, 0);
    wg.addColorStop(0, "#d8b070");
    wg.addColorStop(1, "#4a3420");
    c.fillStyle = wg;
    c.fillRect(x - 0.022, y - 0.12, 0.044, 0.16);
  }
});
// the pendulum: a thin rod and a brass bob, hung from its pivot
e.layer("pendulum", { depth: -0.04, pivot: [0, -1.5] }, (c) => {
  c.strokeStyle = "#a0845a";
  c.lineWidth = 0.006;
  c.beginPath();
  c.moveTo(0, -1.5);
  c.lineTo(0, -0.6);
  c.stroke();
  const bg = c.createRadialGradient(-0.015, -0.61, 0.004, 0, -0.6, 0.055);
  bg.addColorStop(0, "#ffe2a8");
  bg.addColorStop(0.45, "#c8924c");
  bg.addColorStop(1, "#4a3018");
  c.fillStyle = bg;
  c.beginPath();
  c.arc(0, -0.6, 0.052, 0, 7);
  c.fill();
});
// the case: plinth, trunk with its door open to what is inside, hood, finials
g.fillStyle = "#30201a";
g.fillRect(-0.25, -0.34, 0.5, 0.34);
g.fillStyle = "#3e2a22";
g.fillRect(-0.27, -0.38, 0.54, 0.05);
g.fillRect(-0.27, -0.04, 0.54, 0.04);
const trunk = new Path2D();
trunk.rect(-0.18, -1.56, 0.36, 1.2);
doorPath(trunk);
g.fillStyle = WOOD;
g.fill(trunk, "evenodd");
const tg = g.createLinearGradient(-0.18, 0, 0.18, 0);
tg.addColorStop(0, "rgba(120,80,56,0.25)");
tg.addColorStop(0.5, "rgba(60,40,30,0.05)");
tg.addColorStop(1, "rgba(0,0,0,0.3)");
g.fillStyle = tg;
g.fill(trunk, "evenodd");
g.strokeStyle = "#1e1410";
g.lineWidth = 0.02;
g.stroke(door);
// the glass: a faint sheen over the door
e.layer("glass", { depth: 0.005 }, (c) => {
  const gs = c.createLinearGradient(-0.1, -1.4, 0.1, -0.5);
  gs.addColorStop(0, "rgba(200,214,224,0.12)");
  gs.addColorStop(0.4, "rgba(200,214,224,0)");
  gs.addColorStop(1, "rgba(220,180,140,0.06)");
  c.fillStyle = gs;
  c.fill(door);
});
const hood = new Path2D();
hood.moveTo(-0.24, -1.56);
hood.lineTo(-0.24, -2.1);
hood.quadraticCurveTo(-0.24, -2.3, 0, -2.33);
hood.quadraticCurveTo(0.24, -2.3, 0.24, -2.1);
hood.lineTo(0.24, -1.56);
hood.closePath();
g.fillStyle = WOOD;
g.fill(hood);
g.fillStyle = "rgba(0,0,0,0.25)";
g.fillRect(0.12, -2.3, 0.12, 0.74);
g.fillStyle = "#30201a";
g.fillRect(-0.27, -1.6, 0.54, 0.05);
g.fillStyle = WOOD;
for (const [x, y] of [[-0.21, -2.15], [0, -2.35], [0.21, -2.15]]) {
  g.beginPath();
  g.ellipse(x, y - 0.035, 0.022, 0.035, 0, 0, 7);
  g.fill();
}
// the dial: aged ivory, its hours as small ticks, two dark hands
const dx = 0, dy = -1.85, r = 0.15;
const dg = g.createRadialGradient(dx - 0.05, dy - 0.04, 0.01, dx, dy, r);
dg.addColorStop(0, "#e8dcc4");
dg.addColorStop(1, "#9a8e7a");
g.fillStyle = dg;
g.beginPath();
g.arc(dx, dy, r, 0, 7);
g.fill();
g.strokeStyle = "rgba(20,16,12,0.7)";
g.lineWidth = 0.006;
g.beginPath();
for (let h = 0; h < 12; h++) {
  const a = (h / 12) * Math.PI * 2;
  g.moveTo(dx + Math.sin(a) * r * 0.78, dy - Math.cos(a) * r * 0.78);
  g.lineTo(dx + Math.sin(a) * r * 0.92, dy - Math.cos(a) * r * 0.92);
}
g.stroke();
g.lineCap = "round";
g.strokeStyle = "rgba(14,10,8,0.95)";
for (const [a, len, w] of [[(4.8 / 12) * Math.PI * 2, 0.07, 0.012], [(49 / 60) * Math.PI * 2, 0.11, 0.007]]) {
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(dx, dy);
  g.lineTo(dx + Math.sin(a) * len, dy - Math.cos(a) * len);
  g.stroke();
}
g.strokeStyle = "#2a1c16";
g.lineWidth = 0.025;
g.beginPath();
g.arc(dx, dy, r + 0.01, 0, 7);
g.stroke();
e.at(dx, dy, "dial");
