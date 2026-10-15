const S = e.state || {};
const ov = S.overgrowth ?? 0.6;
const s = S.sun ?? 0.2;
const edgeY = (x) => -0.04 + 0.05 * Math.sin(x * 1.3) + 0.03 * Math.sin(x * 3.1);
let gr = g.createLinearGradient(0, -0.1, 0, 1.8);
gr.addColorStop(0, "rgba(100,112,80,0)");
gr.addColorStop(0.06, "#66714f");
gr.addColorStop(0.5, "#566142");
gr.addColorStop(1, "#454f36");
g.fillStyle = gr;
g.beginPath();
g.moveTo(-10, 1.9);
for (let x = -10; x <= 10; x += 0.25) g.lineTo(x, edgeY(x));
g.lineTo(10, 1.9);
g.closePath();
g.fill();
const D = 5.5;
const cl = [];
for (let i = 0; i < 520; i++) {
  const d = 2.3 + Math.pow(e.rnd(), 0.8) * 3.9;
  cl.push([d, e.rnd(), e.rnd(), e.rnd(), e.rnd()]);
}
cl.sort((a, b) => b[0] - a[0]);
const near = ["#56613f", "#4e5939", "#5f6a45", "#48522f"],
  far = ["#6f7b55", "#76815a", "#6a7550"];
for (const c of cl) {
  const [d, r0, r1, r2, r3] = c;
  const k = D / d;
  const cy = (1.7 / d - 1.7 / D) * D;
  const cx = (r0 - 0.5) * 2.1 * D;
  const edge = Math.min(1, Math.max(0, (Math.abs(cx) - 3.4) / 3));
  const dp = Math.min(1, Math.max(0, (D - d) / 2.5));
  const H = (0.12 + 0.2 * ov) * (0.6 + 1.8 * edge * edge) * (0.45 + 0.55 * r1) * k;
  const n = 9 + Math.floor(r2 * 12);
  const ph = r3 * 6.28;
  const pal = dp > 0.3 ? near : far;
  for (let j = 0; j < n; j++) {
    const x = cx + (e.rnd() - 0.5) * 0.4 * k;
    const h = H * (0.35 + 0.65 * e.rnd());
    const l =
      ((x - cx) / k) * 1.1 +
      (e.rnd() - 0.5) * 0.35 +
      0.07 * Math.sin(e.t * 0.42 + ph + j * 0.3) +
      0.03 * Math.sin(e.t * 1.13 + ph);
    const dd = e.rnd() < 0.12;
    g.fillStyle = dd ? (dp > 0.3 ? "#7c7553" : "#968e66") : pal[Math.floor(e.rnd() * pal.length)];
    const w = 0.011 * k;
    g.beginPath();
    g.moveTo(x - w, cy + 0.03 * k);
    g.quadraticCurveTo(x + l * h * 0.4, cy - h * 0.6, x + l * h, cy - h);
    g.quadraticCurveTo(x + l * h * 0.4 + w * 0.5, cy - h * 0.5, x + w, cy + 0.03 * k);
    g.fill();
    if (e.rnd() < 0.05) {
      g.beginPath();
      g.ellipse(x + l * h, cy - h - 0.03 * k, 0.012 * k, 0.038 * k, l, 0, 7);
      g.fill();
    }
  }
  if (r1 > 0.975) {
    const h = H * 1.25;
    const sw = (0.05 * Math.sin(e.t * 0.5 + ph) + 0.02 * Math.sin(e.t * 1.3 + ph)) * k;
    g.strokeStyle = "rgba(104,116,80,0.95)";
    g.lineWidth = 0.009 * k;
    g.beginPath();
    g.moveTo(cx, cy);
    g.quadraticCurveTo(cx, cy - h * 0.5, cx + sw, cy - h);
    g.stroke();
    g.fillStyle = r2 < 0.75 ? "rgba(214,208,184,0.8)" : "rgba(206,192,132,0.92)";
    for (let m = 0; m < 7; m++) {
      const a = (m / 7) * 6.28;
      g.beginPath();
      g.arc(
        cx + sw + Math.cos(a) * 0.026 * k * (0.6 + 0.4 * (m % 2)),
        cy - h - 0.01 * k + Math.sin(a) * 0.01 * k,
        0.01 * k,
        0,
        7,
      );
      g.fill();
    }
  }
}
const bg = g.createLinearGradient(0, 0.6, 0, 1.9);
bg.addColorStop(0, "rgba(52,60,40,0)");
bg.addColorStop(1, "rgba(52,60,40,0.45)");
g.fillStyle = bg;
g.fillRect(-10, 0.6, 20, 1.3);
const canes = [
  [-9.6, 1.7, -8.2, -0.5, -5.9, 0.9],
  [-9.0, 1.9, -7.2, -0.9, -5.0, 0.7],
  [-9.8, 1.0, -8.8, -1.2, -7.0, 0.1],
  [-8.4, 1.9, -6.8, 0.0, -4.6, 1.4],
  [-9.5, 0.6, -8.6, -1.4, -7.6, -0.6],
  [9.6, 1.6, 8.4, -0.4, 6.4, 1.0],
  [9.2, 1.9, 7.8, -0.6, 5.6, 1.5],
];
g.lineCap = "round";
for (let c = 0; c < canes.length; c++) {
  const q = canes[c];
  const sw = 0.04 * Math.sin(e.t * 0.35 + c * 1.7) + 0.015 * Math.sin(e.t * 0.9 + c);
  g.strokeStyle = "#40472f";
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(q[0], q[1]);
  g.quadraticCurveTo(q[2], q[3] + sw, q[4] + sw, q[5]);
  g.stroke();
  for (let j = 1; j < 14; j++) {
    const t = j / 14;
    const it = 1 - t;
    const px = it * it * q[0] + 2 * it * t * q[2] + t * t * (q[4] + sw),
      py = it * it * q[1] + 2 * it * t * (q[3] + sw) + t * t * q[5];
    for (let m = 0; m < 3; m++) {
      if ((j * 7 + m * 3 + c) % 5 === 0) continue;
      g.fillStyle = m === 0 ? "#4f5a39" : m === 1 ? "#434d2e" : "#5a6542";
      g.beginPath();
      g.ellipse(
        px + (m - 1) * 0.09 + 0.03 * Math.sin(j * 2.7 + c),
        py - 0.02 + (m % 2) * 0.07,
        0.085,
        0.05,
        m - 1 + 0.5 * Math.sin(j * 1.3 + c),
        0,
        7,
      );
      g.fill();
    }
    if ((j + c) % 5 === 2) {
      g.fillStyle = "#382e31";
      g.beginPath();
      g.arc(px + 0.05, py + 0.09, 0.028, 0, 7);
      g.arc(px + 0.09, py + 0.07, 0.024, 0, 7);
      g.fill();
    }
  }
}
