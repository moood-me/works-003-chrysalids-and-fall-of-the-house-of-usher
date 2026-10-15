const A = e.aspect,
  S = e.state || {};
const d = S.dream ?? 0.7,
  li = S.lights ?? 0.7,
  w = S.waking ?? 0;
const H = 0.6,
  cx = A * 0.665;
const vis = (0.18 + 0.82 * d) * (1 - 0.9 * w);
const sg = g.createLinearGradient(0, H, 0, 1.25);
sg.addColorStop(0, "#4c4876");
sg.addColorStop(0.06, "#353760");
sg.addColorStop(0.35, "#212543");
sg.addColorStop(1, "#11142b");
g.fillStyle = sg;
g.fillRect(-0.4, H, A + 0.8, 0.7);
if (w > 0) {
  g.fillStyle = "rgba(8,8,14," + 0.6 * w + ")";
  g.fillRect(-0.4, H, A + 0.8, 0.7);
}
g.save();
g.translate(cx, H - 0.03);
g.scale(1, 0.22);
let rg = g.createRadialGradient(0, 0, 0, 0, 0, 0.36);
rg.addColorStop(0, "rgba(240,214,172," + 0.3 * li * (0.3 + 0.7 * vis) + ")");
rg.addColorStop(0.5, "rgba(220,190,180," + 0.1 * li * (0.3 + 0.7 * vis) + ")");
rg.addColorStop(1, "rgba(220,190,180,0)");
g.fillStyle = rg;
g.beginPath();
g.arc(0, 0, 0.36, 0, 7);
g.fill();
g.restore();
g.save();
g.translate(cx, H + 0.02);
g.scale(1, 0.14);
rg = g.createRadialGradient(0, 0, 0, 0, 0, 0.5);
rg.addColorStop(0, "rgba(236,206,164," + 0.32 * li * vis + ")");
rg.addColorStop(1, "rgba(236,206,164,0)");
g.fillStyle = rg;
g.beginPath();
g.arc(0, 0, 0.5, 0, 7);
g.fill();
g.restore();
const T = [];
for (let i = 0; i < 40; i++) {
  const u = (e.rnd() + e.rnd() + e.rnd() - 1.5) / 1.5;
  const far = e.rnd();
  const x = cx + u * 0.25;
  const h = (0.016 + 0.13 * Math.pow(1 - Math.abs(u), 1.5) * (0.3 + 0.7 * e.rnd())) * (far < 0.4 ? 0.8 : 1);
  const wd = 0.0035 + 0.007 * e.rnd() * e.rnd() + 0.001;
  const kind = Math.floor(e.rnd() * 4);
  const sd = e.rnd();
  T.push({ x, h, wd, kind, far: far < 0.4 ? 1 : 0, sd });
}
T.sort((a, b) => b.far - a.far);
for (const o of T) {
  if (o.far) continue;
  for (let yy = H + 0.003; yy < H + o.h * 0.9; yy += 0.0032) {
    const f = (yy - H) / (o.h * 0.9);
    const off = 0.0025 * Math.sin(yy * 520 + e.t * 0.7 + o.sd * 9) + 0.0015 * Math.sin(yy * 1300 - e.t * 1.1);
    const a = 0.22 * vis * (1 - f) * (0.55 + 0.45 * Math.sin(yy * 900 + e.t * 0.5 + o.sd * 4));
    g.fillStyle = "rgba(180,172,212," + a + ")";
    const ww = o.wd * (0.9 + 0.5 * Math.sin(yy * 700 + e.t * 0.9));
    g.fillRect(o.x - ww / 2 + off, yy, ww, 0.0018);
  }
}
for (let i = 0; i < 22; i++) {
  const lx = cx + (e.rnd() + e.rnd() - 1) * 0.24;
  const len = 0.05 + e.rnd() * 0.22;
  const ph = e.rnd() * 6.28;
  const warm = e.rnd() < 0.7;
  for (let yy = H + 0.004; yy < H + len; yy += 0.0042) {
    const f = (yy - H) / len;
    const fl = Math.max(0, Math.sin(yy * 800 + e.t * 0.8 + ph) * 0.6 + Math.sin(yy * 310 - e.t * 0.5 + ph * 2) * 0.5);
    const a = 0.45 * li * vis * (1 - f) * fl;
    if (a < 0.01) continue;
    const ww = 0.002 + 0.01 * f * fl;
    g.fillStyle = warm ? "rgba(250,214,160," + a + ")" : "rgba(196,212,250," + a + ")";
    g.fillRect(lx - ww / 2 + 0.002 * Math.sin(yy * 400 + e.t), yy, ww, 0.0014);
  }
}
for (let i = 0; i < 150; i++) {
  const r = e.rnd();
  const y = H + 0.004 + r * r * 0.6;
  const x = -0.3 + e.rnd() * (A + 0.6);
  const len = 0.004 + (y - H) * 0.1 * (0.5 + e.rnd());
  const ph = e.rnd() * 6.28;
  const xx = x + 0.01 * Math.sin(e.t * 0.12 + ph);
  const near = Math.max(0, 1 - Math.abs(xx - cx) / 0.5);
  const a = (0.04 + 0.09 * e.rnd()) * (0.6 + 0.4 * Math.sin(e.t * 0.3 + ph)) * (1 - 0.5 * w);
  g.strokeStyle = near > 0.3 ? "rgba(214,196,190," + a * (0.6 + near) + ")" : "rgba(140,140,190," + a + ")";
  g.lineWidth = e.px * (0.8 + (y - H) * 2);
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(xx - len / 2, y);
  g.lineTo(xx + len / 2, y);
  g.stroke();
}
g.fillStyle = "rgba(46,46,84," + 0.95 * (1 - 0.5 * w) + ")";
g.beginPath();
g.moveTo(cx - 0.62, H + 0.001);
for (let x = cx - 0.62; x <= cx + 0.58; x += 0.008) {
  const f = x - cx;
  const hh = 0.007 * Math.exp(-f * f * 7) + 0.0015 + 0.0012 * Math.sin(x * 90) + 0.001 * Math.sin(x * 230);
  g.lineTo(x, H - Math.max(0, hh) * (1 - Math.pow(Math.abs(f) / 0.62, 6)));
}
g.lineTo(cx + 0.58, H + 0.001);
g.fill();
function tw(o, h) {
  const x = o.x,
    wd = o.wd,
    a = wd * 0.5,
    b = wd * 0.4;
  g.beginPath();
  g.moveTo(x - a, H + 0.002);
  g.lineTo(x - b, H - h);
  if (o.kind == 1) {
    g.quadraticCurveTo(x - b, H - h - wd * 0.8, x, H - h - wd * 0.9);
    g.quadraticCurveTo(x + b, H - h - wd * 0.8, x + b, H - h);
  } else if (o.kind == 2) {
    g.lineTo(x - b * 0.55, H - h);
    g.lineTo(x - b * 0.55, H - h - h * 0.14);
    g.quadraticCurveTo(x, H - h - h * 0.14 - wd * 0.6, x + b * 0.55, H - h - h * 0.14);
    g.lineTo(x + b * 0.55, H - h);
    g.lineTo(x + b, H - h);
  } else if (o.kind == 3) {
    g.quadraticCurveTo(x - b * 0.7, H - h - wd * 1.5, x, H - h - wd * 3.2);
    g.quadraticCurveTo(x + b * 0.7, H - h - wd * 1.5, x + b, H - h);
  } else {
    g.lineTo(x + b, H - h);
  }
  g.lineTo(x + a, H + 0.002);
  g.closePath();
}
for (const o of T) {
  const h = o.h * (1 - 0.6 * w * o.sd);
  const top = H - h - (o.kind == 2 ? h * 0.14 + o.wd * 0.6 : o.kind == 1 ? o.wd * 0.9 : o.kind == 3 ? o.wd * 3.2 : 0);
  const gt = g.createLinearGradient(0, top, 0, H);
  if (o.far) {
    gt.addColorStop(0, "rgba(160,152,196," + 0.6 * vis + ")");
    gt.addColorStop(1, "rgba(110,104,156," + 0.45 * vis + ")");
  } else {
    gt.addColorStop(0, "rgba(222,214,234," + 0.95 * vis + ")");
    gt.addColorStop(0.3, "rgba(150,144,188," + 0.95 * vis + ")");
    gt.addColorStop(1, "rgba(72,70,114," + 0.95 * vis + ")");
  }
  tw(o, h);
  g.fillStyle = gt;
  g.fill();
  if (!o.far) {
    g.save();
    tw(o, h);
    g.clip();
    g.fillStyle = "rgba(30,30,66," + 0.3 * vis + ")";
    g.fillRect(o.x - o.wd, top - 0.01, o.wd * 0.55, h + 0.05);
    g.strokeStyle = "rgba(244,222,188," + 0.4 * vis * li + ")";
    g.lineWidth = e.px;
    g.beginPath();
    g.moveTo(o.x + o.wd * 0.4, top + 0.002);
    g.lineTo(o.x + o.wd * 0.5, H);
    g.stroke();
    g.restore();
  }
  if (o.kind == 0 && o.sd > 0.35) {
    const sh = 0.008 + 0.022 * o.sd;
    g.strokeStyle = "rgba(224,218,238," + 0.55 * vis + ")";
    g.lineWidth = e.px * 0.8;
    g.beginPath();
    g.moveTo(o.x, H - h);
    g.lineTo(o.x, H - h - sh);
    g.stroke();
    const bl = 0.5 + 0.5 * Math.sin(e.t * 0.6 + o.sd * 10);
    g.fillStyle = "rgba(255,226,190," + 0.8 * bl * vis * li + ")";
    g.beginPath();
    g.arc(o.x, H - h - sh, 0.0013, 0, 7);
    g.fill();
  }
  const rows = Math.floor(h / 0.0036),
    cols = Math.max(1, Math.floor(o.wd / 0.0028));
  const cw = (o.wd * 0.75) / cols;
  for (let r = 1; r < rows; r++) {
    for (let c2 = 0; c2 < cols; c2++) {
      const on = e.rnd(),
        warm = e.rnd() < 0.62,
        ph = e.rnd() * 6.28;
      if (on > li * 0.7) continue;
      const xx = o.x - o.wd * 0.375 + cw * (c2 + 0.5);
      const yy = H - r * 0.0036;
      const a = (0.65 + 0.35 * Math.sin(e.t * (0.15 + on * 0.3) + ph)) * vis * (o.far ? 0.55 : 1);
      g.fillStyle = warm ? "rgba(255,224,170," + a + ")" : "rgba(210,226,255," + a + ")";
      g.fillRect(xx - 0.0007, yy - 0.0009, 0.0014, 0.0014);
    }
  }
}
const mi = 0.15 + 0.75 * (1 - d) + 0.4 * w;
for (let i = 0; i < 8; i++) {
  const y = H - 0.002 - i * 0.008 * (2.2 - d);
  const off = cx + 0.25 * Math.sin(e.t * 0.02 + i * 1.7);
  g.save();
  g.translate(off, y);
  g.scale(0.45, 0.016);
  const mg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  mg.addColorStop(0, "rgba(150,144,186," + mi * 0.38 + ")");
  mg.addColorStop(1, "rgba(150,144,186,0)");
  g.fillStyle = mg;
  g.beginPath();
  g.arc(0, 0, 1, 0, 7);
  g.fill();
  g.restore();
}
const hb = g.createLinearGradient(0, H - 0.025, 0, H + 0.02);
hb.addColorStop(0, "rgba(120,114,160,0)");
hb.addColorStop(0.55, "rgba(120,114,160," + (0.18 + 0.25 * (1 - d)) + ")");
hb.addColorStop(1, "rgba(120,114,160,0)");
g.fillStyle = hb;
g.fillRect(-0.4, H - 0.025, A + 0.8, 0.045);
e.light(cx, H - 0.05, 0.28, "#f0d8b0", 0.22 * li * vis);
if (w > 0.01) {
  for (let i = 0; i < 70; i++) {
    const o = T[i % T.length];
    const sp = 0.01 + e.rnd() * 0.02;
    const ph = e.rnd();
    const f = (ph + e.t * sp) % 1;
    const x = o.x + (e.rnd() - 0.5) * 0.02 + 0.01 * Math.sin(e.t * 0.3 + i);
    const y = H - o.h * 0.5 - f * 0.15;
    const a = w * (1 - w * 0.6) * 0.6 * Math.sin(f * 3.14);
    g.fillStyle = "rgba(240,222,190," + a + ")";
    g.beginPath();
    g.arc(x, y, 0.0015, 0, 7);
    g.fill();
  }
}
