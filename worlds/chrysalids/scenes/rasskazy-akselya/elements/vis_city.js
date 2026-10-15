const S = e.state || {};
const A = e.aspect;
const t = e.t;
const st = Math.max(0, Math.min(1, S.story ?? 0.7));
const dw = S.dawn ?? 0;
const v = Math.max(0, Math.min(3, S.vision ?? 1));
if (st < 0.01) return;
const C = "190,200,224";
const lerp = (a, b, k) => a + (b - a) * k;
function soft(body, a, B, rule) {
  const bp = g.beginPath,
    fl = g.fill,
    sk = g.stroke;
  const nop = function () {};
  g.save();
  g.filter = "blur(" + B + "px)";
  g.globalAlpha = a;
  bp.call(g);
  g.beginPath = nop;
  g.fill = nop;
  g.stroke = nop;
  try {
    body();
  } finally {
    delete g.beginPath;
    delete g.fill;
    delete g.stroke;
    if (g.fill !== fl) {
      g.beginPath = bp;
      g.fill = fl;
      g.stroke = sk;
    }
  }
  g.fill(rule || "nonzero");
  g.globalAlpha = a * 0.45;
  g.lineWidth = 0.005;
  g.stroke();
  g.restore();
  g.filter = "none";
}
function grad(top) {
  const gr = g.createLinearGradient(0, top, 0, 0.02);
  gr.addColorStop(0, "rgba(" + C + ",0.25)");
  gr.addColorStop(0.5, "rgba(" + C + ",0.85)");
  gr.addColorStop(0.85, "rgba(" + C + ",0.8)");
  gr.addColorStop(1, "rgba(" + C + ",0)");
  g.fillStyle = gr;
  g.strokeStyle = gr;
}
function puff(x, y, rx, ry, col, al) {
  g.save();
  g.translate(x, y);
  g.scale(rx, ry);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  rg.addColorStop(0, "rgba(" + col + "," + al + ")");
  rg.addColorStop(1, "rgba(" + col + ",0)");
  g.fillStyle = rg;
  g.fillRect(-1, -1, 2, 2);
  g.restore();
}
function smoke(a, w, top) {
  for (let i = 0; i < 9; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd(),
      r3 = e.rnd();
    const x = (r1 - 0.5) * w * 2 + 0.03 * Math.sin(t * (0.05 + r3 * 0.06) + i * 2);
    const y = top * (0.15 + r2 * 0.8) + 0.006 * Math.sin(t * 0.11 + i);
    puff(x, y, 0.05 + r3 * 0.08, 0.012 + r2 * 0.015, "18,26,52", 0.5 * Math.min(1, a * 4));
  }
  g.globalAlpha = 1;
  for (let i = 0; i < 6; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd();
    const x = (r1 - 0.5) * w * 2.2 + 0.04 * Math.sin(t * 0.04 + i * 1.7);
    const y = top * (0.1 + r2 * 0.9);
    puff(x, y, 0.07 + r2 * 0.06, 0.02 + r1 * 0.02, C, a * 0.7);
  }
}
function sea(a, w) {
  for (let i = 0; i < 9; i++) {
    const r1 = e.rnd(),
      r2 = e.rnd();
    const y = 0.008 + i * 0.007 + i * i * 0.0006;
    const x = (r1 - 0.5) * w * 1.4 + 0.012 * Math.sin(t * 0.13 + i * 1.3);
    puff(x, y, 0.06 + r2 * w * 0.6, 0.008 + i * 0.001, C, a * 0.75 * (1 - i / 10));
  }
}
function draw(a, s) {
  const tw = [
    [-0.27, 0.05, 0.09, 1],
    [-0.21, 0.045, 0.15, 1],
    [-0.145, 0.06, 0.22, 0],
    [-0.08, 0.035, 0.11, 1],
    [-0.025, 0.05, 0.27, 1],
    [0.04, 0.07, 0.17, 1],
    [0.11, 0.04, 0.24, 1],
    [0.165, 0.05, 0.1, 1],
    [0.225, 0.06, 0.07, 0],
  ];
  grad(-0.28);
  soft(
    () => {
      for (const q of tw) {
        const x = q[0],
          w = q[1],
          h = q[2],
          br = q[3];
        const lean = br ? x * 0.08 : 0;
        g.beginPath();
        g.moveTo(x - w / 2, 0.01);
        g.lineTo(x - w / 2 + lean, -h * (br ? 0.82 : 1));
        if (br) {
          g.lineTo(x - w / 5 + lean, -h * 0.95);
          g.lineTo(x + lean, -h * 0.74);
          g.lineTo(x + w / 6 + lean, -h);
          g.lineTo(x + w / 3 + lean, -h * 0.86);
          g.lineTo(x + w / 2 + lean, -h * 0.62);
        } else g.lineTo(x + w / 2, -h);
        g.lineTo(x + w / 2, 0.01);
        g.closePath();
        if (h > 0.14) {
          g.rect(x - w * 0.22, -h * 0.5, w * 0.44, h * 0.14);
        }
        g.fill("evenodd");
      }
      g.beginPath();
      g.moveTo(-0.34, 0.014);
      for (let i = 0; i <= 24; i++) {
        const x = -0.34 + i * 0.028;
        g.lineTo(x, -0.01 - 0.02 * Math.abs(Math.sin(i * 1.7)) * Math.abs(Math.sin(i * 0.6 + 1)));
      }
      g.lineTo(0.34, 0.014);
      g.closePath();
      g.fill();
      g.lineWidth = 0.004;
      g.beginPath();
      g.moveTo(-0.12, -0.13);
      g.quadraticCurveTo(-0.08, -0.115, -0.05, -0.09);
      g.stroke();
    },
    a,
    3.6,
    "evenodd",
  );
  smoke(a, 0.3, -0.27);
}
const K = 2;
const sp = [A * 0.73, 0.43, 0.62];
const dom = [A * 0.7, 0.5, 1.0];
const base = Math.max(0, 1 - v);
const pulse = 0.85 + 0.15 * Math.sin(t * 0.21 + K) * Math.sin(t * 0.13 + 1);
const fade = st * (1 - dw * 0.75) * pulse;
const d = Math.max(0, 1 - Math.abs(v - K));
const w = Math.max(d, 0.55 * base);
const a = fade * 0.3 * w;
if (a < 0.004) return;
const dr = 0.012 * Math.sin(t * 0.05 + K * 2) + 0.006 * Math.sin(t * 0.13 + K);
const x = lerp(sp[0], dom[0], d) + dr,
  y = lerp(sp[1], dom[1], d) + 0.004 * Math.sin(t * 0.09 + K * 1.3),
  s = lerp(sp[2], dom[2], d);
g.save();
g.translate(x, y);
g.scale(s, s);
draw(a, s);
g.restore();
g.globalAlpha = 1;
