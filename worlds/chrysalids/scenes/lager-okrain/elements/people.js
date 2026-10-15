const S = e.state || {};
const f = S.fire ?? 0.8,
  P = S.people ?? 0.8,
  AL = S.alarm ?? 0;
const t = e.t;
const sm = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
const lr = (a, b, r) => a + (b - a) * r;
const fl = 0.6 + 0.08 * Math.sin(t * 6.1) + 0.05 * Math.sin(t * 9.7);
function col(x, s) {
  const sg = x > 0 ? -1 : 1;
  const w = f * Math.max(0, 1 - Math.abs(x) / 6.5) * fl;
  const r = 18 + Math.round(120 * w),
    gg = 15 + Math.round(58 * w),
    b = 21 + Math.round(16 * w);
  const gr = g.createLinearGradient(x + sg * 0.34 * s, 0, x - sg * 0.06 * s, 0);
  gr.addColorStop(0, "rgb(" + r + "," + gg + "," + b + ")");
  gr.addColorStop(1, "#120f15");
  return gr;
}
function arm(Sx, Sy, Tx, Ty, l1, l2, bs, w) {
  const dx = Tx - Sx,
    dy = Ty - Sy;
  const D = Math.max(0.001, Math.hypot(dx, dy));
  const Dm = Math.min(D, l1 + l2 - 0.002);
  const a0 = Math.atan2(dy, dx);
  const c = (l1 * l1 + Dm * Dm - l2 * l2) / (2 * l1 * Dm);
  const a1 = Math.acos(Math.max(-1, Math.min(1, c)));
  const ex = Sx + l1 * Math.cos(a0 + bs * a1),
    ey = Sy + l1 * Math.sin(a0 + bs * a1);
  const hx = Sx + (dx / D) * Dm,
    hy = Sy + (dy / D) * Dm;
  g.lineWidth = w;
  g.beginPath();
  g.moveTo(Sx, Sy);
  g.lineTo(ex, ey);
  g.lineTo(hx, hy);
  g.stroke();
  g.beginPath();
  g.ellipse(hx, hy, w * 0.6, w * 0.5, 0, 0, 7);
  g.fill();
  return [hx, hy];
}
function spear(bx, by, tx, ty, s) {
  g.lineWidth = 0.04 * s;
  g.beginPath();
  g.moveTo(bx, by);
  g.quadraticCurveTo((bx + tx) / 2 + 0.05, (by + ty) / 2 + 0.02, tx, ty);
  g.stroke();
  const a = Math.atan2(ty - by, tx - bx);
  g.save();
  g.translate(tx, ty);
  g.rotate(a);
  g.beginPath();
  g.moveTo(-0.03, -0.035 * s);
  g.quadraticCurveTo(0.12 * s, -0.06 * s, 0.3 * s, 0);
  g.quadraticCurveTo(0.12 * s, 0.06 * s, -0.03, 0.035 * s);
  g.closePath();
  g.fill();
  g.restore();
}
function horn(x, y, d, s) {
  g.beginPath();
  g.moveTo(x, y - 0.02 * s);
  g.quadraticCurveTo(x - d * 0.22 * s, y - 0.06 * s, x - d * 0.34 * s, y - 0.34 * s);
  g.lineTo(x - d * 0.46 * s, y - 0.31 * s);
  g.quadraticCurveTo(x - d * 0.3 * s, y + 0.05 * s, x, y + 0.04 * s);
  g.closePath();
  g.fill();
}
function log(x) {
  g.fillStyle = "#17110e";
  g.beginPath();
  g.ellipse(x, -0.18, 0.45, 0.19, 0, 0, 7);
  g.fill();
  g.fillStyle = "rgba(150,84,46," + 0.35 * f * fl + ")";
  g.beginPath();
  g.ellipse(x + (x < 0 ? 0.08 : -0.08), -0.33, 0.34, 0.035, 0, 0, 7);
  g.fill();
}
function fig(o) {
  const s = o.h / 1.75,
    x = o.x,
    d = o.d,
    th = o.thin || 1,
    ph = o.ph || 0;
  const sit = o.sit,
    hun = o.hunch || 0;
  const br = (Math.sin(t * 0.8 + ph) * 0.012 + Math.sin(t * 1.33 + ph * 1.7) * 0.006) * s;
  const c = col(x, s);
  g.fillStyle = c;
  g.strokeStyle = c;
  g.lineCap = "round";
  g.lineJoin = "round";
  const hx = x,
    hy = -(0.95 - 0.5 * sit) * s;
  const kx = x + d * (0.04 + 0.42 * sit) * s,
    ky = -(0.5 + 0.03 * sit) * s;
  const fx = x + d * (0.5 * sit) * s;
  g.lineWidth = 0.15 * s * th;
  for (const of_ of [-0.06, 0.06]) {
    const k = 1 - sit + (d ? 0 : sit);
    g.beginPath();
    g.moveTo(hx + of_ * s * k, hy);
    g.lineTo(kx + of_ * s * k, ky);
    g.lineTo(fx + of_ * s * k * 1.3, -0.05 * s);
    g.stroke();
    g.beginPath();
    g.ellipse(fx + of_ * s * k * 1.3 + d * 0.05 * s, -0.04 * s, 0.11 * s, 0.045 * s, 0, 0, 7);
    g.fill();
  }
  const lean = hun * 0.8 + sit * 0.12 * Math.abs(d) + (o.lean || 0);
  const L = 0.56 * s * (o.tall || 1);
  const dd = d || 1;
  const sx = hx + dd * Math.sin(lean) * L,
    sy = hy - Math.cos(lean) * L + br;
  const px = dd * Math.cos(lean),
    py = Math.sin(lean);
  const hw = 0.16 * s * th,
    sw = 0.21 * s * th,
    hump = hun * 0.2 * s;
  const tl = (0.42 - 0.22 * sit) * s;
  g.beginPath();
  g.moveTo(hx - px * hw * 1.05, hy - 0.08 * s);
  g.lineTo(hx + px * hw * 1.05, hy - 0.08 * s);
  g.lineTo(hx + px * hw * 1.3 + d * sit * 0.3 * s, hy + tl);
  g.lineTo(hx - px * hw * 1.35 - d * 0.02 * s, hy + tl + 0.04 * s);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(hx + px * hw, hy + py * hw);
  g.quadraticCurveTo(
    (hx + sx) / 2 + px * hw * 1.15,
    (hy + sy) / 2 + py * hw,
    sx + px * sw * 0.85,
    sy + py * sw * 0.85 + 0.03 * s,
  );
  g.quadraticCurveTo(sx + px * sw * 0.2, sy - 0.07 * s, sx - px * sw * 0.9, sy - py * sw * 0.9 + 0.02 * s);
  g.quadraticCurveTo(
    (hx + sx) / 2 - px * (hw + hump + 0.02 * s),
    (hy + sy) / 2 - py * (hw + hump),
    hx - px * hw,
    hy - py * hw,
  );
  g.closePath();
  g.fill();
  const hdx = sx + d * (0.04 + hun * 0.16) * s,
    hdy = sy - 0.16 * s + hun * 0.09 * s;
  g.lineWidth = 0.1 * s * th;
  g.beginPath();
  g.moveTo(sx, sy);
  g.lineTo(hdx, hdy + 0.05 * s);
  g.stroke();
  g.beginPath();
  g.ellipse(hdx, hdy, 0.092 * s, 0.112 * s, d * 0.25, 0, 7);
  g.fill();
  g.beginPath();
  g.ellipse(hdx - d * 0.035 * s, hdy - 0.025 * s, 0.098 * s, 0.1 * s, -d * 0.5, 0, 7);
  g.fill();
  const J = {
    s: s,
    x: x,
    d: d,
    hx: hx,
    hy: hy,
    kx: kx,
    ky: ky,
    sx: sx,
    sy: sy,
    hdx: hdx,
    hdy: hdy,
    Fx: sx + px * sw * 0.55,
    Fy: sy + py * sw * 0.55 + 0.04 * s,
    Bx: sx - px * sw * 0.55,
    By: sy - py * sw * 0.55 + 0.04 * s,
  };
  const al = o.arm || 1;
  const l1 = 0.3 * s * al,
    l2 = 0.3 * s * al;
  const T = o.pose(J);
  const hb = arm(J.Bx, J.By, T[0][0], T[0][1], l1, l2, T[0][2], 0.1 * s * th);
  const hf = arm(J.Fx, J.Fy, T[1][0], T[1][1], l1, l2, T[1][2], 0.1 * s * th);
  if (o.extra) o.extra(J, hb, hf);
}
const ar = (k) => sm((AL - k) / 0.35);
let v, r;
v = sm((P - 0.6) / 0.12);
if (v > 0.01) {
  g.globalAlpha = v;
  r = ar(0.2);
  log(0.2);
  fig({
    x: 0.2,
    d: 0,
    h: 1.7,
    sit: 1 - r,
    ph: 2.1,
    pose: (J) => [
      [lr(J.x - 0.17 * J.s, J.x - 0.24 * J.s, r), lr(-0.5 * J.s, -0.85 * J.s, r), 1],
      [lr(J.x + 0.17 * J.s, J.x + 0.24 * J.s, r), lr(-0.5 * J.s, -0.85 * J.s, r), -1],
    ],
  });
}
v = sm(P / 0.1);
if (v > 0.01) {
  g.globalAlpha = v;
  r = ar(0.0);
  fig({
    x: -2.6,
    d: 1,
    h: 2.3,
    thin: 0.72,
    tall: 1.08,
    sit: 0,
    ph: 0.3,
    pose: (J) => {
      const s = J.s;
      return [
        [lr(J.x + 0.2 * s, J.x - 0.02 * s, r), lr(-1.12 * s, -1.5 * s, r), 1],
        [lr(J.x + 0.1 * s, J.hdx + 0.07 * s, r), lr(-0.8 * s, J.hdy + 0.05 * s, r), 1],
      ];
    },
    extra: (J, hb, hf) => {
      const s = J.s;
      spear(
        lr(hb[0] + 0.03, hb[0] + 0.5 * s, r),
        lr(0, -0.55 * s, r),
        lr(hb[0] - 0.02, hb[0] - 1.0 * s, r),
        lr(-2.5 * s, -2.6 * s, r),
        s,
      );
      if (r > 0.25) {
        g.globalAlpha = v * sm((r - 0.25) / 0.4);
        horn(hf[0], hf[1], 1, s);
        g.globalAlpha = v;
      }
    },
  });
}
v = sm((P - 0.2) / 0.12);
if (v > 0.01) {
  g.globalAlpha = v;
  r = ar(0.1);
  log(-1.3);
  fig({
    x: -1.3,
    d: 1,
    h: 1.75,
    sit: 1 - r,
    lean: 0.22 * (1 - r),
    arm: 1.55,
    ph: 1.2,
    pose: (J) => {
      const s = J.s;
      return [
        [lr(J.x + 0.95 * s, J.x + 0.12 * s, r), lr(-0.5 * s, -0.2 * s, r), 1],
        [lr(J.x + 1.0 * s, J.x + 0.22 * s, r), lr(-0.62 * s, -0.25 * s, r), 1],
      ];
    },
  });
}
v = sm((P - 0.4) / 0.12);
if (v > 0.01) {
  g.globalAlpha = v;
  r = ar(0.3);
  log(1.3);
  fig({
    x: 1.3,
    d: -1,
    h: 1.7,
    hunch: 1,
    sit: 1 - 0.85 * r,
    ph: 3.3,
    pose: (J) => {
      const s = J.s;
      return [
        [lr(J.kx + 0.02, J.x - 0.18 * s, r), lr(J.ky - 0.03, -0.75 * s, r), -1],
        [lr(J.kx - 0.04, J.x - 0.35 * s, r), lr(J.ky - 0.01, -0.95 * s, r), -1],
      ];
    },
  });
}
v = sm((P - 0.8) / 0.12);
if (v > 0.01) {
  g.globalAlpha = v;
  r = ar(0.05);
  fig({
    x: 3.8,
    d: -1,
    h: 1.8,
    sit: 0,
    ph: 4.4,
    pose: (J) => {
      const s = J.s;
      return [
        [lr(J.x + 0.06 * s, J.x + 0.25 * s, r), lr(-0.84 * s, -1.25 * s, r), -1],
        [lr(J.x - 0.22 * s, J.x - 0.12 * s, r), lr(-1.2 * s, -1.45 * s, r), -1],
      ];
    },
    extra: (J, hb, hf) => {
      const s = J.s;
      spear(
        lr(hf[0] + 0.02, hf[0] - 0.45 * s, r),
        lr(0, -0.7 * s, r),
        lr(hf[0] - 0.05, hf[0] + 0.9 * s, r),
        lr(-2.45 * s, -2.55 * s, r),
        s,
      );
    },
  });
}
g.globalAlpha = 1;
