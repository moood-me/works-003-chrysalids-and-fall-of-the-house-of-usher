const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = 0;
const LC = ["#6f7d58", "#859168", "#a2a978", "#7a8760", "#b8b07a"];
function birch(x, h, lean, sd) {
  const sw = (k) => k * k * (0.05 * h) * (Math.sin(0 * 0.33 + sd) + 0.45 * Math.sin(0 * 0.87 + sd * 2));
  const tx = x + lean * h;
  const tg = g.createLinearGradient(x - 0.15, 0, x + 0.15, 0);
  tg.addColorStop(0, "#e4dfcf");
  tg.addColorStop(0.55, "#cfcab9");
  tg.addColorStop(1, "#9b9888");
  g.fillStyle = tg;
  const bw = 0.06 + h * 0.012;
  g.beginPath();
  g.moveTo(x - bw, 0.2);
  g.quadraticCurveTo(x + lean * h * 0.4 - bw * 0.6, -h * 0.5, tx + sw(1) - 0.025, -h);
  g.lineTo(tx + sw(1) + 0.025, -h);
  g.quadraticCurveTo(x + lean * h * 0.4 + bw * 0.6, -h * 0.5, x + bw, 0.2);
  g.closePath();
  g.fill();
  const tAt = (f) => x + lean * h * f + sw(f) * 1;
  g.fillStyle = "rgba(70,70,62,0.75)";
  for (let i = 0; i < Math.round(h * 2.2); i++) {
    const f = e.rnd() * 0.85;
    const cx = tAt(f) + (e.rnd() - 0.5) * bw;
    g.beginPath();
    g.ellipse(cx, -h * f, bw * 0.55 * (0.4 + e.rnd() * 0.6), 0.018 + 0.02 * e.rnd(), 0, 0, 7);
    g.fill();
  }
  g.strokeStyle = "#8e8a7c";
  g.lineWidth = 0.035;
  g.lineCap = "round";
  const br = [];
  for (let j = 0; j < 6; j++) {
    const f = 0.4 + 0.5 * e.rnd();
    const dir = e.rnd() < 0.5 ? -1 : 1;
    const len = h * (0.1 + 0.12 * e.rnd());
    const bx = tAt(f),
      by = -h * f;
    const ex = bx + dir * len,
      ey = by - len * 0.55 + sw(f) * 0;
    g.beginPath();
    g.moveTo(bx, by);
    g.quadraticCurveTo(bx + dir * len * 0.5, by - len * 0.5, ex + sw(f), ey);
    g.stroke();
    br.push([ex + sw(f), ey, f]);
  }
  br.push([tAt(1), -h, 1]);
  br.push([tAt(0.75), -h * 0.75, 0.75]);
  for (const b of br) {
    const rr = h * (0.07 + 0.04 * e.rnd());
    const mg = g.createRadialGradient(b[0], b[1] + rr * 0.3, 0, b[0], b[1] + rr * 0.3, rr * 1.3);
    mg.addColorStop(0, "rgba(92,106,72,0.55)");
    mg.addColorStop(1, "rgba(92,106,72,0)");
    g.fillStyle = mg;
    g.beginPath();
    g.ellipse(b[0], b[1] + rr * 0.3, rr * 1.4, rr * 1.2, 0, 0, 7);
    g.fill();
    const n = 110 + Math.floor(e.rnd() * 50);
    for (let k = 0; k < n; k++) {
      const a = e.rnd() * 6.28,
        d = Math.sqrt(e.rnd()) * rr;
      const dx = Math.cos(a) * d * 1.3,
        dy = Math.sin(a) * d * 0.8 + d * 0.5;
      const lx = b[0] + dx + 0.02 * h * Math.sin(0 * 0.6 + k + sd) * (dy / rr + 0.5),
        ly = b[1] + dy;
      const sz = h * (0.007 + 0.007 * e.rnd());
      const lt = (-dx - dy) / rr;
      const ci = lt > 0.4 ? (e.rnd() < 0.6 ? 2 : 1) : lt < -0.3 ? (e.rnd() < 0.6 ? 0 : 3) : e.rnd() < 0.5 ? 1 : 3;
      g.fillStyle = e.rnd() < 0.05 + 0.15 * s ? LC[4] : LC[ci];
      g.beginPath();
      g.ellipse(lx, ly, sz, sz * 1.5, e.rnd() * 0.8 - 0.4, 0, 7);
      g.fill();
    }
  }
  g.globalAlpha = 1;
}
function tuft(x0, w, hh) {
  for (let i = 0; i < Math.round(w * 25); i++) {
    const x = x0 + (e.rnd() - 0.5) * w;
    const y0 = 0.2 + e.rnd() * 0.2;
    const h = hh * (0.4 + 0.6 * e.rnd()) * (0.6 + 0.6 * ov);
    const ph = e.rnd() * 6.28;
    const l = (e.rnd() - 0.5) * 0.7 + 0.09 * Math.sin(0 * 0.42 + ph);
    g.fillStyle = e.rnd() < 0.3 ? "#a39c70" : "#788458";
    g.beginPath();
    g.moveTo(x - 0.04, y0);
    g.quadraticCurveTo(x + l * h * 0.4, y0 - h * 0.6, x + l * h, y0 - h);
    g.quadraticCurveTo(x + l * h * 0.4 + 0.02, y0 - h * 0.5, x + 0.04, y0);
    g.fill();
  }
}
birch(0.5, 10, -0.015, 12);
birch(3.4, 7.5, 0.03, 13);
tuft(0.5, 2, 0.9);
tuft(3.4, 1.6, 0.7);
