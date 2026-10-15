// The city by the sea (the sky's, round the middle cx): the sea under the horizon and its glints, the light's path on
// the water, the far shore, the mist banks low on the water (more as the dream is weaker), the towers — near and far,
// their windows lit as `lights` says, the lights on their spires — in four layers (city.animate.js: at the waking they
// settle, each tower as far as its own, and pale), the sparks they settle into a layer. `dream`, `lights` — keys the
// game sets seldom (the painting follows them); `waking` moves only layers. Its point is the city's (the choice «far»).
const A = e.aspect, S = e.state || {}, L = e.lib;
const d = S.dream ?? 0.7, li = S.lights ?? 0.7, H = L.H, cx = L.cityX(A);
const vis = 0.18 + 0.82 * d;
const sg = g.createLinearGradient(0, H, 0, 1.25);
sg.addColorStop(0, '#4c4876'); sg.addColorStop(0.06, '#353760'); sg.addColorStop(0.35, '#212543'); sg.addColorStop(1, '#11142b');
g.fillStyle = sg;
g.fillRect(-0.4, H, A + 0.8, 0.7);
const blob = (q, x, y, sy, r, stops) => {
  q.save(); q.translate(x, y); q.scale(1, sy);
  const rg = q.createRadialGradient(0, 0, 0, 0, 0, r);
  for (const [k, c] of stops) rg.addColorStop(k, c);
  q.fillStyle = rg; q.beginPath(); q.arc(0, 0, r, 0, 7); q.fill(); q.restore();
};
blob(g, cx, H - 0.03, 0.22, 0.36, [[0, `rgba(240,214,172,${0.3 * li * (0.3 + 0.7 * vis)})`], [0.5, `rgba(220,190,180,${0.1 * li * (0.3 + 0.7 * vis)})`], [1, 'rgba(220,190,180,0)']]);
blob(g, cx, H + 0.02, 0.14, 0.5, [[0, `rgba(236,206,164,${0.32 * li * vis})`], [1, 'rgba(236,206,164,0)']]);
const T = [];
for (let i = 0; i < 40; i++) {
  const u = (e.rnd() + e.rnd() + e.rnd() - 1.5) / 1.5, far = e.rnd();
  const x = cx + u * 0.25;
  const h = (0.016 + 0.13 * Math.pow(1 - Math.abs(u), 1.5) * (0.3 + 0.7 * e.rnd())) * (far < 0.4 ? 0.8 : 1);
  const wd = 0.0035 + 0.007 * e.rnd() * e.rnd() + 0.001;
  T.push({ x, h, wd, kind: Math.floor(e.rnd() * 4), far: far < 0.4 ? 1 : 0, sd: e.rnd() });
}
T.sort((a, b) => b.far - a.far);
// the towers' reflections and the lights' columns on the water
for (const o of T) {
  if (o.far) continue;
  for (let yy = H + 0.003; yy < H + o.h * 0.9; yy += 0.0032) {
    const f = (yy - H) / (o.h * 0.9);
    const off = 0.0025 * Math.sin(yy * 520 + o.sd * 9) + 0.0015 * Math.sin(yy * 1300);
    g.fillStyle = `rgba(180,172,212,${0.22 * vis * (1 - f) * (0.55 + 0.45 * Math.sin(yy * 900 + o.sd * 4))})`;
    const ww = o.wd * (0.9 + 0.5 * Math.sin(yy * 700));
    g.fillRect(o.x - ww / 2 + off, yy, ww, 0.0018);
  }
}
for (let i = 0; i < 22; i++) {
  const lx = cx + (e.rnd() + e.rnd() - 1) * 0.24, len = 0.05 + e.rnd() * 0.22, ph = e.rnd() * 6.28, warm = e.rnd() < 0.7;
  for (let yy = H + 0.004; yy < H + len; yy += 0.0042) {
    const f = (yy - H) / len;
    const fl = Math.max(0, Math.sin(yy * 800 + ph) * 0.6 + Math.sin(yy * 310 + ph * 2) * 0.5);
    const a = 0.45 * li * vis * (1 - f) * fl;
    if (a < 0.01) continue;
    const ww = 0.002 + 0.01 * f * fl;
    g.fillStyle = warm ? `rgba(250,214,160,${a})` : `rgba(196,212,250,${a})`;
    g.fillRect(lx - ww / 2 + 0.002 * Math.sin(yy * 400), yy, ww, 0.0014);
  }
}
// small waves over all the water: a layer drifting slowly (the water moving)
e.layer('waves', { drift: [0.004, 0], box: [-0.4, H, A + 0.4, 1.25] }, q => {
  const W = A + 0.8;
  q.lineCap = 'round';
  for (let i = 0; i < 150; i++) {
    const r = e.rnd(), y = H + 0.004 + r * r * 0.6, x = -0.4 + e.rnd() * W, len = 0.004 + (y - H) * 0.1 * (0.5 + e.rnd());
    const near = Math.max(0, 1 - Math.abs(x - cx) / 0.5), a = 0.04 + 0.09 * e.rnd();
    q.strokeStyle = near > 0.3 ? `rgba(214,196,190,${a * (0.6 + near)})` : `rgba(140,140,190,${a})`;
    q.lineWidth = 0.0009 * (0.8 + (y - H) * 2);
    for (const k of [-W, 0, W]) { q.beginPath(); q.moveTo(x + k - len / 2, y); q.lineTo(x + k + len / 2, y); q.stroke(); }
  }
});
// the far shore under the city
g.fillStyle = 'rgba(46,46,84,0.95)';
g.beginPath();
g.moveTo(cx - 0.62, H + 0.001);
for (let x = cx - 0.62; x <= cx + 0.58; x += 0.008) {
  const f = x - cx, hh = 0.007 * Math.exp(-f * f * 7) + 0.0015 + 0.0012 * Math.sin(x * 90) + 0.001 * Math.sin(x * 230);
  g.lineTo(x, H - Math.max(0, hh) * (1 - Math.pow(Math.abs(f) / 0.62, 6)));
}
g.lineTo(cx + 0.58, H + 0.001);
g.fill();
function tw(q, o) {
  const x = o.x, wd = o.wd, a = wd * 0.5, b = wd * 0.4, h = o.h;
  q.beginPath();
  q.moveTo(x - a, H + 0.002);
  q.lineTo(x - b, H - h);
  if (o.kind == 1) { q.quadraticCurveTo(x - b, H - h - wd * 0.8, x, H - h - wd * 0.9); q.quadraticCurveTo(x + b, H - h - wd * 0.8, x + b, H - h); }
  else if (o.kind == 2) {
    q.lineTo(x - b * 0.55, H - h); q.lineTo(x - b * 0.55, H - h - h * 0.14);
    q.quadraticCurveTo(x, H - h - h * 0.14 - wd * 0.6, x + b * 0.55, H - h - h * 0.14); q.lineTo(x + b * 0.55, H - h); q.lineTo(x + b, H - h);
  } else if (o.kind == 3) { q.quadraticCurveTo(x - b * 0.7, H - h - wd * 1.5, x, H - h - wd * 3.2); q.quadraticCurveTo(x + b * 0.7, H - h - wd * 1.5, x + b, H - h); }
  else q.lineTo(x + b, H - h);
  q.lineTo(x + a, H + 0.002);
  q.closePath();
}
// the towers in four layers by how far each settles at the waking (sd): pivot at the shore
for (let grp = 0; grp < 4; grp++) {
  e.layer('t' + grp, { pivot: [cx, H], box: [cx - 0.5, H - 0.32, cx + 0.5, H + 0.01] }, q => {
    for (const o of T) {
      if (Math.min(3, Math.floor(o.sd * 4)) !== grp) continue;
      const h = o.h, top = H - h - (o.kind == 2 ? h * 0.14 + o.wd * 0.6 : o.kind == 1 ? o.wd * 0.9 : o.kind == 3 ? o.wd * 3.2 : 0);
      const gt = q.createLinearGradient(0, top, 0, H);
      if (o.far) { gt.addColorStop(0, `rgba(160,152,196,${0.6 * vis})`); gt.addColorStop(1, `rgba(110,104,156,${0.45 * vis})`); }
      else { gt.addColorStop(0, `rgba(222,214,234,${0.95 * vis})`); gt.addColorStop(0.3, `rgba(150,144,188,${0.95 * vis})`); gt.addColorStop(1, `rgba(72,70,114,${0.95 * vis})`); }
      tw(q, o);
      q.fillStyle = gt;
      q.fill();
      if (!o.far) {
        q.save(); tw(q, o); q.clip();
        q.fillStyle = `rgba(30,30,66,${0.3 * vis})`;
        q.fillRect(o.x - o.wd, top - 0.01, o.wd * 0.55, h + 0.05);
        q.strokeStyle = `rgba(244,222,188,${0.4 * vis * li})`;
        q.lineWidth = 0.0009;
        q.beginPath(); q.moveTo(o.x + o.wd * 0.4, top + 0.002); q.lineTo(o.x + o.wd * 0.5, H); q.stroke();
        q.restore();
      }
      if (o.kind == 0 && o.sd > 0.35) {
        const sh = 0.008 + 0.022 * o.sd;
        q.strokeStyle = `rgba(224,218,238,${0.55 * vis})`;
        q.lineWidth = 0.0008;
        q.beginPath(); q.moveTo(o.x, H - h); q.lineTo(o.x, H - h - sh); q.stroke();
        q.fillStyle = `rgba(255,226,190,${0.6 * vis * li})`;
        q.beginPath(); q.arc(o.x, H - h - sh, 0.0013, 0, 7); q.fill();
      }
      const rows = Math.floor(h / 0.0036), cols = Math.max(1, Math.floor(o.wd / 0.0028)), cw = (o.wd * 0.75) / cols;
      for (let r = 1; r < rows; r++) for (let c2 = 0; c2 < cols; c2++) {
        const on = e.rnd(), warm = e.rnd() < 0.62;
        if (on > li * 0.7) continue;
        const a = (0.7 + 0.3 * e.rnd()) * vis * (o.far ? 0.55 : 1);
        q.fillStyle = warm ? `rgba(255,224,170,${a})` : `rgba(210,226,255,${a})`;
        q.fillRect(o.x - o.wd * 0.375 + cw * (c2 + 0.5) - 0.0007, H - r * 0.0036 - 0.0009, 0.0014, 0.0014);
      }
    }
  });
}
// the mist banks low on the water (more when the dream is weak), and the band of haze at the horizon
const mi = 0.15 + 0.75 * (1 - d);
e.layer('mist', { box: [cx - 0.8, H - 0.08, cx + 0.8, H + 0.03] }, q => {
  for (let i = 0; i < 8; i++) blob(q, cx + 0.25 * Math.sin(i * 1.7), H - 0.002 - i * 0.008 * (2.2 - d), 0.016 / 0.45, 0.45, [[0, `rgba(150,144,186,${mi * 0.38})`], [1, 'rgba(150,144,186,0)']]);
});
const hb = g.createLinearGradient(0, H - 0.025, 0, H + 0.02);
hb.addColorStop(0, 'rgba(120,114,160,0)'); hb.addColorStop(0.55, `rgba(120,114,160,${0.18 + 0.25 * (1 - d)})`); hb.addColorStop(1, 'rgba(120,114,160,0)');
g.fillStyle = hb;
g.fillRect(-0.4, H - 0.025, A + 0.8, 0.045);
// the sparks the towers settle into (at the waking)
e.layer('sparks', { box: [cx - 0.35, H - 0.3, cx + 0.35, H] }, q => {
  for (let i = 0; i < 70; i++) {
    const o = T[i % T.length];
    q.fillStyle = 'rgba(240,222,190,0.6)';
    q.beginPath(); q.arc(o.x + (e.rnd() - 0.5) * 0.02, H - o.h * 0.5 - e.rnd() * 0.15, 0.0015, 0, 7); q.fill();
  }
});
e.light(cx, H - 0.05, 0.28, '#f0d8b0', 0.22 * li * vis, 'glow');
e.at(cx, H - 0.06);
