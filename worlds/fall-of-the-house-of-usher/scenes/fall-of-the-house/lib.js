// The fall of the house — the end of the house of Usher over the black tarn: what its elements paint and move, the causeway's
// line and the run along it, and its film in beats (film(scene), at the end). The sky — the red moon behind the house,
// its glow on the clouds, the far shore, the water — is the sky's own painting (pale, and a second one in the full red
// shown over it as far as `moon` says); what stands in the world (the house, the causeway, the shore, the sedge, the
// mist) is painted once in its own colours and lit by the scene: the night's ambient, the red moon and its glow from
// behind the house (their look `moon` reddens the night), the fissure's and the windows' red glows, the breach; the
// morning is a look too. What moves — the halves of the house parting, leaning, sinking, the clouds, the mist, the
// rings — moves by layers, shaders and particles.
const { clamp } = anim;
const sm = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const H = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const C = (c, a) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
const N = (v) => (v === true ? 1 : v === false ? 0 : clamp(+v || 0, 0, 1));
const mornOf = (s) => N(s.morning);
// how much lighter than the night's paint what stands in the world is painted (its own colours: the night is the light's)
const DAY = 2.6;

// ── the causeway and the run ──
// the causeway: from the house's left wing (149 m) to the near shore; across (m) at a distance d (m)
const TILT = Math.tan((6.3 * Math.PI) / 180);
const across = (d) => -10 + (76 - d) * TILT;
// the near shore's water line (m); the run: `run` 0 — 60 m before the house, 1 — off the causeway at the shore
const SHORE = 9, RUN_FROM = 92, RUN_TO = 8.2;
const runAt = (r) => RUN_FROM + (RUN_TO - RUN_FROM) * r;
const runOf = (d) => clamp((d - RUN_FROM) / (RUN_TO - RUN_FROM), 0, 1);
// the break: the causeway goes down from the house toward the shore as the house falls — at the house's door at fall
// 0, at the shore at fall 1; it reaches the runner's `run` r at fall ≈ 0.4 + 0.6 r
const breakAt = (fall) => 146 - (146 - SHORE) * clamp(fall, 0, 1);
// what the house's fall shows, as `fall` goes (the script sets these keys from it): the halves parting (cw, metres),
// leaning out (radians), sinking (metres, left and right); the crack's glow fading as it goes under
const fallOf = (f) => ({
  cw: 0.15 + 2.5 * sm(0.05, 0.4, f) + 5 * sm(0.35, 0.75, f), lean: sm(0.3, 0.8, f) * 0.13,
  sinkL: sm(0.45, 1, f) * 54, sinkR: sm(0.5, 1, f) * 54, glow: 1 - sm(0.85, 1, f),
});

// ── the sky, the far shore, the tarn (stage heights): painted twice — the moon at 0 (pale) and at 1 (blood red) — the
// shader showing the red one as far as `moon` says; the clouds in their own layers (pale, red), flying (the storm
// faster, thicker); the moon's disc between the high bands and the low one; its path on the water twinkling ──
const HZ = 0.58, WL = HZ + 0.012, MOON = (A) => [A / 2, 0.47], MR = 0.17, CLOUDW = (A) => A + 1.6;
function skyPaint(g, e, mo, mn) {
  const A = e.aspect, [cx, cy] = MOON(A);
  let gr = g.createLinearGradient(0, -0.35, 0, WL);
  gr.addColorStop(0, C(mixc([10, 12, 16], [44, 49, 56], mn), 1));
  gr.addColorStop(0.5, C(mixc([21, 25, 32], [74, 80, 88], mn), 1));
  gr.addColorStop(0.85, C(mixc(mixc([32, 32, 38], [54, 32, 34], mo), [118, 120, 124], mn), 1));
  gr.addColorStop(1, C(mixc(mixc([42, 40, 44], [78, 40, 36], mo), [140, 140, 140], mn), 1));
  g.fillStyle = gr;
  g.fillRect(-0.5, -0.5, A + 1, WL + 0.5);
  const hg = g.createRadialGradient(cx, cy, MR * 0.9, cx, cy, MR * 4.5);
  hg.addColorStop(0, C([170, 48, 34], 0.42 * mo * (1 - mn)));
  hg.addColorStop(0.3, C([120, 40, 34], 0.18 * mo * (1 - mn)));
  hg.addColorStop(1, C([60, 30, 34], 0));
  g.fillStyle = hg;
  g.fillRect(-0.5, -0.5, A + 1, WL + 0.5);
  // the far shore and its dead trees
  g.fillStyle = C(mixc([22, 25, 30], [52, 56, 62], mn), 1);
  g.beginPath();
  g.moveTo(-0.5, WL + 0.004);
  for (let i = 0; i <= 60; i++) {
    const x = -0.5 + (i * (A + 1)) / 60;
    g.lineTo(x, HZ - 0.004 - 0.008 * H(i + 800) - 0.008 * Math.abs(Math.sin(i * 0.37) * Math.sin(i * 0.13)));
  }
  g.lineTo(A + 0.5, WL + 0.004);
  g.closePath();
  g.fill();
  g.strokeStyle = C(mixc([18, 20, 24], [44, 48, 54], mn), 1);
  g.lineCap = 'round';
  const tree = (x, y, h, sd, a, dep) => {
    if (dep > 3 || h < 0.003) return;
    const x2 = x + Math.sin(a) * h, y2 = y - Math.cos(a) * h;
    g.lineWidth = Math.max(0.0008, h * 0.09);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    const n = 2 + (H(sd) > 0.6 ? 1 : 0);
    for (let k = 0; k < n; k++) tree(x2, y2, h * (0.55 + 0.2 * H(sd + k * 3.1)), sd * 1.7 + k + 1, a + (H(sd + k * 7.3) - 0.5) * 1.5, dep + 1);
  };
  const tx = [0.06, 0.13, 0.2, 0.26, A - 0.26, A - 0.19, A - 0.11, A - 0.04, -0.15, A + 0.15];
  for (let i = 0; i < tx.length; i++) tree(tx[i], HZ - 0.004, 0.012 + 0.02 * H(i + 850), i + 3, (H(i + 860) - 0.5) * 0.3, 0);
  // the tarn: its dark water, the red of the sky in it near the far shore, the moon's reflection
  const wg = g.createLinearGradient(0, WL, 0, 1.3);
  wg.addColorStop(0, C(mixc(mixc([40, 38, 44], [74, 38, 36], mo), [112, 114, 118], mn), 1));
  wg.addColorStop(0.2, C(mixc(mixc([28, 28, 34], [44, 28, 30], mo), [80, 84, 90], mn), 1));
  wg.addColorStop(0.55, C(mixc([14, 16, 20], [46, 50, 56], mn), 1));
  wg.addColorStop(1, C(mixc([5, 6, 8], [22, 24, 28], mn), 1));
  g.fillStyle = wg;
  g.fillRect(-0.5, WL, A + 1, 1.3 - WL);
  g.save();
  g.beginPath();
  g.rect(-0.5, WL, A + 1, 1.3);
  g.clip();
  const ry = 2 * WL - cy;
  g.globalAlpha = 1 - mn;
  blob(g, cx, ry - 0.04, MR * 4.2, MR * 1.6, [120, 40, 34], 0.3 * mo);
  const mg2 = g.createRadialGradient(cx, ry, 0, cx, ry, MR);
  mg2.addColorStop(0, C(mixc([110, 60, 56], [190, 56, 38], mo), 0.55));
  mg2.addColorStop(1, C(mixc([80, 44, 44], [140, 30, 24], mo), 0.4));
  g.fillStyle = mg2;
  g.beginPath(); g.arc(cx, ry, MR, 0, 6.2832); g.fill();
  g.restore();
  // the mist lying on the water at the far shore
  blob(g, cx, HZ, A * 0.9, 0.03 + 0.03 * mn, mixc([64, 62, 72], [170, 170, 172], mn), 0.25 + 0.2 * mn);
}
// a soft cloud-lump (an ellipse with a soft edge)
function blob(g, x, y, w, h, col, a) {
  g.save();
  g.translate(x, y);
  g.scale(w, h);
  const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  rg.addColorStop(0, C(col, a));
  rg.addColorStop(0.55, C(col, a * 0.6));
  rg.addColorStop(1, C(col, 0));
  g.fillStyle = rg;
  g.beginPath(); g.arc(0, 0, 1, 0, 6.2832); g.fill();
  g.restore();
}
// a band of clouds (n lumps round y0, as thick as th; sd its seed; sz their size), lit red near the moon as far as mo
// says; each lump painted again a width further either side, so the band's ends meet as the shader wraps it
function band(g, e, y0, th, n, al, sd, sz, mo, mn) {
  const A = e.aspect, W = CLOUDW(A), [cx, cy] = MOON(A), dark = mixc([38, 43, 54], [92, 98, 106], mn), red = [150, 62, 52];
  for (let j = 0; j < n; j++) {
    const r1 = H(sd + j), r2 = H(sd + j + 50), r3 = H(sd + j + 90);
    const x = r1 * W - 0.8, y = y0 + (r2 - 0.5) * th, w = sz * (0.5 + r3), h = w * (0.07 + 0.09 * r2);
    let lit = Math.max(0, 1 - Math.hypot(x - cx, (y - cy) * 1.6) / 0.7);
    lit = lit * lit * mo * (1 - mn);
    const col = mixc(dark, red, lit);
    for (const dx of [0, -W, W]) {
      blob(g, x + dx, y, w, h, col, al * (0.5 + 0.5 * r2));
      blob(g, x + dx + w * 0.4 * (r3 - 0.5), y - h * 0.5, w * 0.55, h * 0.6, mixc(col, [64, 68, 80], 0.35 * (1 - lit)), al * 0.6);
      blob(g, x + dx + w * 0.2, y + h * 0.6, w * 0.7, h * 0.45, [12, 14, 18], al * 0.5);
    }
  }
}
// the moon's disc (gone in the morning), its dark maria
function disc(g, e, mo) {
  const [cx, cy] = MOON(e.aspect);
  const mg = g.createRadialGradient(cx - MR * 0.12, cy - MR * 0.15, MR * 0.1, cx, cy, MR);
  mg.addColorStop(0, C(mixc([140, 86, 80], [208, 78, 54], mo), 1));
  mg.addColorStop(0.7, C(mixc([112, 62, 58], [188, 50, 34], mo), 1));
  mg.addColorStop(1, C(mixc([86, 48, 48], [150, 32, 26], mo), 1));
  g.fillStyle = mg;
  g.beginPath(); g.arc(cx, cy, MR, 0, 6.2832); g.fill();
  for (let m = 0; m < 7; m++)
    blob(g, cx + (H(m + 700) - 0.5) * MR * 1.3, cy + (H(m + 710) - 0.5) * MR * 1.3, MR * (0.1 + 0.16 * H(m + 720)), MR * (0.08 + 0.12 * H(m + 730)), [110, 26, 20], 0.12 * mo);
}
function sky(g, e) {
  const mn = mornOf(e.state), A = e.aspect, [cx] = MOON(A);
  // (the cloud bands as wide as the shader wraps them: −0.8 … A + 0.8, past the sky's own margins)
  const CB = { box: [-0.8, -0.35, A + 0.8, 0.75] };
  // (the clouds as dense as the storm at its most: the shader thins them as `storm` says)
  skyPaint(g, e, 0, mn);
  e.layer('red', {}, (g) => skyPaint(g, e, 1, mn));
  e.layer('high', CB, (g) => { band(g, e, 0.05, 0.25, 16, 0.95, 1, 0.4, 0, mn); band(g, e, 0.22, 0.18, 18, 0.8, 200, 0.28, 0, mn); });
  e.layer('highR', CB, (g) => { band(g, e, 0.05, 0.25, 16, 0.95, 1, 0.4, 1, mn); band(g, e, 0.22, 0.18, 18, 0.8, 200, 0.28, 1, mn); });
  e.layer('disc', {}, (g) => disc(g, e, 0));
  e.layer('discR', {}, (g) => disc(g, e, 1));
  e.layer('low', CB, (g) => band(g, e, 0.42, 0.1, 12, 0.65, 400, 0.16, 0, mn));
  e.layer('lowR', CB, (g) => band(g, e, 0.42, 0.1, 12, 0.65, 400, 0.16, 1, mn));
  // the moon's path on the water: dabs, each twinkling its own way (the shader), red. (The disc and the path are painted
  // whatever the hour: the shader takes them away in the morning — a layer painting nothing is no layer)
  e.layer('path', {}, (g) => {
    for (let k = 0; k < 70; k++) {
      const u = k / 70, y = WL + Math.pow(u, 1.5) * (1.26 - WL), wd = (0.02 + 0.09 * H(k + 900)) * (0.6 + u);
      const x = cx + (H(k + 901) - 0.5) * 0.18 * (0.4 + u);
      g.fillStyle = C([214, 82, 56], (0.55 - 0.35 * u) * 0.6);
      g.fillRect(x - wd / 2, y, wd, 0.0012 + 0.004 * u);
    }
  });
  // the water's strokes, long and sparse toward the eye, short and dense at the far shore (the shader sways them)
  e.layer('strokes', {}, (g) => {
    for (let k = 0; k < 130; k++) {
      const y = WL + Math.pow(H(k + 1000), 2) * (1.26 - WL), dd = y - WL, len = 0.01 + 0.35 * dd, x = H(k + 1001) * (A + 0.8) - 0.4;
      g.strokeStyle = k % 4 ? C([8, 9, 12], 0.35) : C([110, 96, 104], 0.1);
      g.lineWidth = 0.0008 + 0.003 * dd;
      g.beginPath(); g.moveTo(x - len / 2, y); g.lineTo(x + len / 2, y); g.stroke();
    }
  });
}
function skyMotion(e) {
  const s = e.state, m = e.mem, st = s.storm == null ? 0.6 : N(s.storm);
  m.c ??= 0;
  m.c += e.dt * (0.004 + 0.01 * st);
  e.uniform('cloud', m.c);
  e.uniform('moon', N(s.moon));
  e.uniform('storm', st);
  e.uniform('hz', WL);
  e.uniform('morning', mornOf(s));
}

// ── the house (150 m off, 75 wide, 50 high; its foot on the water): two halves split along the fissure F, each a
// layer — its stone (`L`, `R`), the fissure's red glow on its edge (`Lc`, `Rc`, added light: the fissure's lights, and
// the red of the moon seen through its tall windows — their glows) — that part, lean outward and sink as `fall` goes
// (the animate); seen only above the water (clip: above_tarn). Its reflection is house_mirror ──
const F = [[0, -50], [0.3, -41], [0.6, -36.5], [2.6, -33.5], [1.6, -29.5], [-1.4, -27.5], [-0.6, -23], [2.2, -21], [1, -16.5],
  [-1.8, -14.5], [-0.8, -10], [2, -8], [0.8, -4], [-0.6, -2], [0.4, 0.5]];
const fx = (y) => {
  for (let i = 1; i < F.length; i++) if (y <= F[i][1]) { const a = F[i - 1], b = F[i], k = (y - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * k; }
  return 0.4;
};
// the house as painted: K — its palette's brightness (DAY, or the reflection's dark: 0.42 of it); red — the reflection's
// moonlit rims and windows (the water shows the red the moon lays on them: a painted reflection), as bright as `glow`;
// else only the stone
function housePaint(g, K, red, glow = 1) {
  const c = (r, gg, b, a) => `rgba(${Math.min(255, Math.round(r * K))},${Math.min(255, Math.round(gg * K))},${Math.min(255, Math.round(b * K))},${a == null ? 1 : a})`;
  const archPath = (x, y, w, h) => {
    g.moveTo(x - w / 2, y);
    g.lineTo(x - w / 2, y - h + w * 0.8);
    g.quadraticCurveTo(x - w / 2, y - h + w * 0.15, x, y - h);
    g.quadraticCurveTo(x + w / 2, y - h + w * 0.15, x + w / 2, y - h + w * 0.8);
    g.lineTo(x + w / 2, y);
    g.closePath();
  };
  const wall = (x0, y0, x1, y1) => {
    if (red) return;
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, c(20, 22, 28));
    gr.addColorStop(1, c(33, 36, 44));
    g.fillStyle = gr;
    g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.strokeStyle = c(0, 0, 0, 0.14);
    g.lineWidth = 0.1;
    g.beginPath();
    for (let yy = y1 - 1.5; yy > y0; yy -= 1.5) { g.moveTo(x0, yy); g.lineTo(x1, yy); }
    g.stroke();
    const n = Math.floor((x1 - x0) / 3);
    for (let i = 0; i < n; i++) {
      const sx = x0 + ((i + H(x0 * 3 + i)) * (x1 - x0)) / n, sg = g.createLinearGradient(0, y0, 0, y1);
      sg.addColorStop(0, c(8, 9, 12, 0.16));
      sg.addColorStop(1, c(8, 9, 12, 0));
      g.fillStyle = sg;
      g.fillRect(sx, y0, 0.5 + 1.2 * H(x0 + i * 7), (y1 - y0) * (0.4 + 0.6 * H(i + x0 * 5)));
    }
  };
  const win = (x, y, w, h, lit) => {
    if (red) {
      const gr = g.createLinearGradient(0, y - h, 0, y);
      gr.addColorStop(0, 'rgba(140,36,28,0)');
      gr.addColorStop(1, `rgba(150,40,30,${lit * glow})`);
      g.fillStyle = gr;
      g.beginPath(); archPath(x, y, w * 0.8, h * 0.9); g.fill();
      return;
    }
    g.fillStyle = c(10, 11, 14);
    g.beginPath(); archPath(x, y, w, h); g.fill();
    g.fillStyle = c(0, 0, 0, 0.14);
    g.fillRect(x - w * 0.4, y, w * 0.8, 2);
  };
  const fill = (col, path) => { if (red) return; g.fillStyle = col; g.beginPath(); path(); g.fill(); };
  const rim = (path) => { if (!red) return; g.strokeStyle = `rgba(205,70,48,${0.45 * glow})`; g.lineWidth = 0.35; g.beginPath(); path(); g.stroke(); };
  if (!red) { g.fillStyle = c(20, 22, 27); g.fillRect(-37.5, -2.4, 75, 2.9); }
  for (let sd = -1; sd <= 1; sd += 2) {
    const x0 = sd * 16, x1 = sd * 30;
    wall(Math.min(x0, x1), -17, Math.max(x0, x1), -2.4);
    fill(c(16, 18, 22), () => { g.moveTo(x0, -17); g.lineTo(x0 + sd * 1.5, -25); g.lineTo(x1 - sd * 1.5, -25); g.lineTo(x1, -17); g.closePath(); });
    rim(() => { g.moveTo(x0 + sd * 1.5, -25); g.lineTo(x1 - sd * 1.5, -25); });
    if (!red) { g.fillStyle = c(19, 21, 26); g.fillRect(sd * 19 - 0.6, -28.5, 1.2, 4); g.fillRect(sd * 27 - 0.6, -28.5, 1.2, 4); }
    rim(() => { g.moveTo(sd * 19 - 0.6, -28.5); g.lineTo(sd * 19 + 0.6, -28.5); g.moveTo(sd * 27 - 0.6, -28.5); g.lineTo(sd * 27 + 0.6, -28.5); });
    fill(c(21, 23, 28), () => { g.moveTo(sd * 21.6, -20.5); g.lineTo(sd * 23, -24.8); g.lineTo(sd * 24.4, -20.5); g.closePath(); });
    win(sd * 23, -20.6, 1, 2.6, 0.1);
    for (let j = 0; j < 4; j++) { const wx = sd * (18.5 + j * 3); win(wx, -9.6, 1.4, 5.4, 0.12); win(wx, -3.3, 1.3, 3.8, 0.07); }
    const p0 = sd * 30, p1 = sd * 37;
    wall(Math.min(p0, p1), -21, Math.max(p0, p1), -2.4);
    if (!red) { g.fillStyle = c(14, 16, 20, 0.5); g.fillRect(sd > 0 ? 35.6 : -37, -21, 1.4, 18.6); }
    fill(c(16, 18, 22), () => { g.moveTo(p0 - sd * 0.5, -21); g.lineTo(sd * 33.5, -32); g.lineTo(p1 + sd * 0.5, -21); g.closePath(); });
    fill(c(16, 18, 22), () => { g.moveTo(sd * 33.5 - 0.25, -31.5); g.lineTo(sd * 33.5, -35); g.lineTo(sd * 33.5 + 0.25, -31.5); });
    rim(() => { g.moveTo(p0 - sd * 0.5, -21); g.lineTo(sd * 33.5, -32); g.lineTo(p1 + sd * 0.5, -21); });
    win(sd * 33.5, -11.5, 2.2, 7, 0.14);
    win(sd * 33.5, -3.3, 1.6, 4, 0.07);
    fill(c(10, 11, 14), () => g.arc(sd * 33.5, -25, 0.9, 0, 6.283));
  }
  wall(-16, -24, 16, -2.4);
  fill(c(17, 19, 23), () => { g.moveTo(-16.8, -24); g.lineTo(-12.5, -34); g.lineTo(12.5, -34); g.lineTo(16.8, -24); g.closePath(); });
  rim(() => { g.moveTo(-16.8, -24); g.lineTo(-12.5, -34); g.lineTo(12.5, -34); g.lineTo(16.8, -24); });
  win(-10.5, -12, 4.4, 10, 0.3);
  win(10.5, -12, 4.4, 10, 0.3);
  win(-10.5, -3.2, 2, 4.6, 0.07);
  win(10.5, -3.2, 2, 4.6, 0.07);
  win(-14, -3.2, 1.3, 4, 0.05);
  win(14, -3.2, 1.3, 4, 0.05);
  wall(-6.2, -38, 6.2, -2.4);
  if (!red) { g.fillStyle = c(15, 17, 21, 0.6); g.fillRect(-6.2, -38, 1, 35.6); g.fillRect(5.2, -38, 1, 35.6); }
  fill(c(16, 18, 22), () => { g.moveTo(-7, -38); g.lineTo(0, -47); g.lineTo(7, -38); g.closePath(); });
  for (let q = -1; q <= 1; q += 2) fill(c(16, 18, 22), () => { g.moveTo(q * 6.2 - 0.5, -38); g.lineTo(q * 6.2, -42); g.lineTo(q * 6.2 + 0.5, -38); });
  rim(() => { g.moveTo(-7, -38); g.lineTo(0, -47); g.lineTo(7, -38); g.moveTo(-6.2, -38); g.lineTo(-6.2, -34); g.moveTo(6.2, -38); g.lineTo(6.2, -34); });
  fill(c(10, 11, 14), () => g.arc(0, -31, 1.6, 0, 6.283));
  win(-2, -17, 1.3, 6, 0.15);
  win(2, -17, 1.3, 6, 0.15);
  win(0, -2.4, 3.6, 7.5, 0.1);
}
// a half's outline (sd −1 the left, 1 the right): out to its side, in along the fissure
function halfClip(g, sd) {
  g.beginPath();
  g.moveTo(sd * 90, -90);
  g.lineTo(F[0][0], -90);
  for (const p of F) g.lineTo(p[0], p[1]);
  g.lineTo(F[F.length - 1][0], 12);
  g.lineTo(sd * 90, 12);
  g.closePath();
  g.clip();
}
// the fissure's glow (added light: three strokes, wide and dark red to thin and hot)
function crackPaint(g, al) {
  const ws = [[3.4, 0.12], [1.3, 0.26], [0.28, 0.42]], cols = ['160,28,20', '205,52,34', '255,110,80'];
  g.lineJoin = 'miter';
  for (let i = 0; i < 3; i++) {
    g.strokeStyle = `rgba(${cols[i]},${ws[i][1] * al})`;
    g.lineWidth = ws[i][0];
    g.beginPath();
    for (let p = 2; p < F.length; p++) p === 2 ? g.moveTo(F[p][0], F[p][1]) : g.lineTo(F[p][0], F[p][1]);
    g.stroke();
  }
}
// the tall windows the red moon is seen through: [x, y] of their middles on either half, how strong their glows
const MOONLIT = [[10.5, -17, 0.3], [33.5, -15, 0.14], [2, -20, 0.15]];
// one half's layers — stone, (in the reflection: its rims), glow — each turning about its outer corner (the pivot); oy —
// where the water line is in the painting (the reflection's 56 m down), flip — upside down (the reflection, darker)
function halves(e, flip, oy, ghosts) {
  for (const sd of [-1, 1]) {
    // (each layer's box as far as it goes down — or up, in the reflection — as the half sinks: none of it carried past it)
    const n = sd < 0 ? 'L' : 'R', pivot = [sd * 37, oy], box = flip ? [-60, oy - 56, 60, 1] : [-60, -56, 60, 58];
    const under = (g, fn) => { g.save(); g.translate(0, oy); if (flip) g.scale(1, -1); halfClip(g, sd); fn(g); g.restore(); };
    e.layer(n, { pivot, box }, (g) => under(g, (g) => housePaint(g, flip ? 0.42 * DAY : DAY, false)));
    if (flip) e.layer(n + 'r', { pivot, box }, (g) => under(g, (g) => housePaint(g, 0.42 * DAY, true, 0.42)));
    if (ghosts && sd > 0) e.layer('ghosts', { pivot, box }, (g) => under(g, ghosts));
    e.layer(n + 'c', { pivot, box, blend: 'add' }, (g) => under(g, (g) => {
      crackPaint(g, flip ? 0.55 : 1);
      if (flip) return;
      // (its red light: on the house's right half, where the fissure is widest; the moon's red through the tall windows of
      // both halves — their glows)
      if (sd > 0) { e.light(1.5, -30, 9, '#c8321e', 0.3, 'crack1'); e.light(0, -15, 9, '#c8321e', 0.3, 'crack2'); e.light(0.5, -3, 8, '#c8321e', 0.25, 'crack3'); }
      MOONLIT.forEach(([x, y, k], i) => e.light(sd * x, y, 3.2, '#b8402c', k, `win${n}${i}`));
    }));
  }
}
function house(g, e) { clear(g, e); halves(e, false, 0, null); }
// the reflection: the same house upside down in the dark water (its card's top is the water line: its anchor 56 m
// under the water, so what it paints is where the mirror shows it), the ripples breaking it; in the right hall window
// — in the reflection only — the vision of the three of them (ghosts: the ushers module's figures, larger than life)
const MIRROR = 56;
function houseMirror(g, e) {
  clear(g, e);
  halves(e, true, -MIRROR, (g) => {
    // (painted upright, then turned with the half: in the reflection they hang upside down)
    // (the window's red light spreading round it in the water, and the three standing in it larger than the window —
    // larger than life — their feet at its sill)
    g.save();
    g.translate(10.5, -12);
    const rg = g.createRadialGradient(0, -7, 0, 0, -7, 11);
    rg.addColorStop(0, 'rgba(200,58,40,0.8)');
    rg.addColorStop(0.6, 'rgba(170,46,34,0.4)');
    rg.addColorStop(1, 'rgba(150,40,30,0)');
    g.fillStyle = rg;
    g.beginPath(); g.arc(0, -7, 11, 0, Math.PI * 2); g.fill();
    g.translate(0, -0.4);
    g.scale(9, 9);
    ['madeline', 'narrator', 'roderick'].forEach((who, i) => e.kit.ushers.figure(g, e, {
      id: 'ghost_' + who, who, x: (i - 1) * 0.3, face: (i - 1) * -12, wear: who === 'madeline' ? { blood: 1 } : undefined,
      light: 0.32, dark: '#0b0c10', rim: '#e04a36', rimDir: -90,
    }));
    g.restore();
  });
  // the ripples over it (swaying a little: shimmer)
  e.layer('ripples', { shimmer: 0.25 }, (g) => {
    for (let i = 0; i < 60; i++) {
      const yy = 0.5 + Math.pow(H(i + 400), 1.3) * 50, w = 6 + H(i + 401) * 30, xx = (H(i + 402) - 0.5) * 70;
      g.strokeStyle = i % 3 ? 'rgba(7,8,11,0.6)' : 'rgba(90,96,110,0.1)';
      g.lineWidth = 0.25 + yy * 0.014;
      g.beginPath(); g.moveTo(xx - w / 2, yy - MIRROR); g.lineTo(xx + w / 2, yy - MIRROR); g.stroke();
    }
  });
}
// the halves moved as the fall says (the reflection's the other way up)
function houseMotion(e, flip) {
  const s = e.state, f = N(s.fall), mo = s.moon == null ? 1 : N(s.moon), A = fallOf(f), d = flip ? -1 : 1;
  const glow = mo * (0.78 + 0.22 * Math.sin(e.t * 1.7) * Math.sin(e.t * 0.63)) * A.glow;
  for (const sd of [-1, 1]) {
    const n = sd < 0 ? 'L' : 'R', x = (sd * A.cw) / 2, y = d * (sd < 0 ? A.sinkL : A.sinkR), r = d * sd * A.lean;
    for (const k of [n, n + 'c'].concat(flip ? [n + 'r'] : [], flip && sd > 0 ? ['ghosts'] : [])) {
      const L = e.layer(k);
      L.x = x; L.y = y; L.rotate = r;
    }
    if (flip) e.layer(n + 'r').alpha = mo;
    e.layer(n + 'c').alpha = glow;
    // (the moon through the windows: as red as it is, gone as the half goes under)
    if (!flip) MOONLIT.forEach((_, i) => e.glow(`win${n}${i}`, mo * (1 - sm(0.5, 0.8, f))));
  }
  if (flip) e.layer('ghosts').alpha = N(s.ghosts);
  else for (const k of ['crack1', 'crack2', 'crack3']) e.glow(k, f < 0.9 ? glow : 0);
}
// the masks: the water line at the house, above it and under it (unseen cards the house and its reflection are seen
// within)
function aboveTarn(g, e) { g.fillStyle = '#000'; g.fillRect(-90, -100, 180, 100); }
function belowTarn(g, e) { g.fillStyle = '#000'; g.fillRect(-90, -MIRROR - 4, 180, MIRROR + 4); }

// ── the mist over the tarn: long banks drifting (wrapping round its card), in its own pale colour (the night and the
// morning are the light's); thicker in the morning ──
function mist(g, e) {
  clear(g, e);
  const mn = mornOf(e.state), col = '172,166,178', a = 0.22 + 0.14 * mn;
  e.layer('banks', { drift: [0.5, 0] }, (g) => {
    for (let i = 0; i < 12; i++) {
      const r1 = Math.sin(i * 91.7) * 0.5 + 0.5, x = ((i * 31) % 360) - 180, y = -2 - 3 * r1, w = 26 + 20 * r1, h = 3 + 2.5 * r1;
      for (const dx of [0, -360, 360]) {
        g.save();
        g.translate(x + dx, y);
        g.scale(w, h);
        const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
        rg.addColorStop(0, `rgba(${col},${a})`);
        rg.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = rg;
        g.beginPath(); g.arc(0, 0, 1, 0, 6.2832); g.fill();
        g.restore();
      }
    }
  });
}

// ── the old causeway (a plane 146 m long, seen from above: y −73 at the house, +73 at the near shore): its wet boards
// (`boards`) and what is left beyond the break (`sunk`: slabs askew, posts) — its shader shows the boards from the break
// to the shore, the sunk beyond it, and the hot crack running ahead of it ──
function boards(g) {
  g.fillStyle = C([18, 20, 24].map((c) => c * DAY), 1);
  g.fillRect(-0.8, -73, 1.6, 146);
  // (the planks' worn middle, paler)
  const gr = g.createLinearGradient(0, -73, 0, 73);
  gr.addColorStop(0, 'rgba(96,92,96,0.35)');
  gr.addColorStop(1, 'rgba(96,92,96,0.15)');
  g.fillStyle = gr;
  g.fillRect(-0.55, -73, 1.1, 146);
  g.fillStyle = 'rgba(8,9,11,0.35)';
  for (let y = -73, i = 0; y < 73; i++) { g.fillRect(-0.8, y, 1.6, 0.16); y += 1.0 + 0.7 * H(i + 40); }
  g.fillStyle = '#08090b';
  g.fillRect(-0.8, -73, 0.2, 146);
  g.fillRect(0.6, -73, 0.2, 146);
}
function causeway(g, e) {
  clear(g, e);
  e.layer('boards', {}, (g) => boards(g));
  e.layer('sunk', {}, (g) => {
    for (let i = 0; i < 40; i++) {
      const y = -73 + H(i + 300) * 146, w = 0.5 + 0.7 * H(i + 301), h = 0.6 + 1.4 * H(i + 302);
      g.save();
      g.translate((H(i + 303) - 0.5) * 1.4, y);
      g.rotate((H(i + 304) - 0.5) * 1.4);
      g.fillStyle = `rgba(36,38,46,${0.35 + 0.4 * H(i + 305)})`;
      g.fillRect(-w / 2, -h / 2, w, h);
      g.restore();
    }
    g.fillStyle = '#08090b';
    for (let y = -72; y < 73; y += 3.1) { g.fillRect(-0.85, y, 0.22, 0.22); g.fillRect(0.63, y + 1.3, 0.22, 0.22); }
  });
}
function causewayMotion(e) {
  const s = e.state, f = N(s.fall);
  e.uniform('brk', 76 - breakAt(f));
  e.uniform('moon', s.moon == null ? 1 : N(s.moon));
  e.uniform('hot', f > 0.01 && f < 0.995 ? 1 : 0);
}
// (what a shader draws all of by itself: its painting holds nothing but the extent the shader runs over)
function clear(g, e) {
  const [l, t, r, b] = e.area;
  g.fillStyle = 'rgba(0,0,0,0)';
  g.fillRect(l, t, r - l, b - t);
}

// ── the near shore (a plane: its middle 6 m off, 7 m deep): wet dark earth to the water line, which holds the sky's red
// (what the wet edge and the puddles show of the sky is painted: the engine mirrors no sky); the causeway's end comes
// ashore through a gap left in it ──
function shore(g, e) {
  const s = e.state, mo = s.moon == null ? 1 : N(s.moon), mn = mornOf(s), MID = 6;
  const edge = (x) => MID - SHORE + 0.3 * Math.sin(x * 0.7) + 0.18 * Math.sin(x * 1.9 + 1) - 0.5 * Math.exp(-Math.pow((x - across(SHORE)) / 2.2, 2));
  const earth = [13, 13, 16].map((c) => c * DAY);
  g.beginPath();
  g.moveTo(-18, 3.5);
  for (let x = -18; x <= 18.01; x += 0.25) g.lineTo(x, edge(x));
  g.lineTo(18, 3.5);
  g.closePath();
  g.fillStyle = C(earth, 1);
  g.fill();
  g.save();
  g.clip();
  const sheen = mixc([120, 40, 34], [120, 124, 128], mn);
  for (let x = -18; x < 18; x += 0.25) {
    const y = edge(x), gr = g.createLinearGradient(0, y, 0, y + 0.9);
    gr.addColorStop(0, C(sheen, 0.4 * (mo * (1 - mn) + 0.6 * mn)));
    gr.addColorStop(1, C(sheen, 0));
    g.fillStyle = gr;
    g.fillRect(x, y, 0.27, 0.9);
  }
  for (let i = 0; i < 70; i++) {
    const x = -18 + H(i + 10) * 36, y = edge(x) + 0.6 + H(i + 11) * 3.6;
    g.fillStyle = C([6, 7, 9].map((c) => c * DAY), 0.6);
    g.beginPath(); g.ellipse(x, y, 0.2 + 0.5 * H(i + 12), 0.15 + 0.3 * H(i + 13), H(i + 14) * 3, 0, 6.283); g.fill();
  }
  for (let i = 0; i < 9; i++) {
    const x = -15 + H(i + 40) * 30, y = edge(x) + 0.9 + H(i + 41) * 2.6;
    g.fillStyle = C(mixc([70, 30, 30], [110, 112, 116], mn), 0.12 + 0.12 * H(i + 42));
    g.beginPath(); g.ellipse(x, y, 0.2 + 0.45 * H(i + 43), 0.12 + 0.2 * H(i + 44), H(i + 45), 0, 6.283); g.fill();
  }
  g.restore();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath();
  const top = edge(across(SHORE)) - 0.4;
  g.moveTo(across(MID - top) - 0.75, top);
  g.lineTo(across(MID - top) + 0.75, top);
  g.lineTo(across(MID - 3.5) + 0.75, 3.5);
  g.lineTo(across(MID - 3.5) - 0.75, 3.5);
  g.closePath();
  g.fill();
  g.globalCompositeOperation = 'source-over';
}

// ── sedge along the near shore's water line, in clumps either side of where they stand: each clump a layer bending in
// the wind (the storm's look blows harder) ──
function reeds(g, e) {
  clear(g, e);
  const dark = C([8, 9, 11].map((c) => c * DAY), 1);
  g.lineCap = 'round';
  for (let c = 0; c < 16; c++) {
    const side = c % 2 ? 1 : -1, cx = side * (side < 0 ? 5.5 : 3.2) + side * H(c + 1) * 15, n = 8 + Math.floor(H(c + 2) * 12);
    e.layer('clump' + c, { pivot: [cx, 0], wind: { strength: 0.35, gust: 0.5 } }, (g) => {
      for (let i = 0; i < n; i++) {
        const k = c * 31 + i, x = cx + (H(k + 3) - 0.5) * 1.4, h = 0.25 + 0.75 * H(k + 4) * H(k + 8), bend = 0.3 * h * 0.6 + (H(k + 6) - 0.5) * 0.3, w = 0.025 + 0.025 * H(k + 7);
        g.fillStyle = dark;
        g.beginPath();
        g.moveTo(x - w, 0.05);
        g.quadraticCurveTo(x - w * 0.5 + bend * 0.3, -h * 0.6, x + bend, -h);
        g.quadraticCurveTo(x + w * 0.5 + bend * 0.3, -h * 0.6, x + w, 0.05);
        g.closePath();
        g.fill();
      }
    });
  }
}

// ── where the causeway is going down (the breach, at brk_a / brk_d): its glow, red from the fissure, while it breaks
// (its spray and the boards falling are particles) ──
function breach(g, e) {
  clear(g, e);
  // (a round of light that fades to nothing within the card: no edge of it seen)
  e.layer('glow', { blend: 'add' }, (g) => {
    const rg = g.createRadialGradient(0, -1.9, 0, 0, -1.9, 2.3);
    rg.addColorStop(0, 'rgba(200,60,40,0.35)');
    rg.addColorStop(1, 'rgba(200,60,40,0)');
    g.fillStyle = rg;
    g.beginPath(); g.arc(0, -1.9, 2.3, 0, Math.PI * 2); g.fill();
    e.light(0, -1.9, 3.5, '#c8321e', 0.25, 'glow');
  });
}
function breachMotion(e) {
  const k = N(e.state.breaking) * (e.state.moon == null ? 1 : N(e.state.moon));
  e.layer('glow').alpha = k;
  e.glow('glow', k);
}

// ── the rings left on the water where the house went down (a plane on the tarn: its shader spreads them; `rings` how
// much, their near arcs catching the red as far as `moon`) ──
function ringsMotion(e) {
  e.uniform('rings', N(e.state.rings));
  e.uniform('moon', e.state.moon == null ? 1 : N(e.state.moon));
}

// ── the run: where everyone is from where the narrator is (his place: the game's `run` sends him on at his own pace —
// script.js): Madeline at his right hand, Roderick at his left, a stride behind, their hands in his; one stumbling
// (`trip`) drops back and lets go. The camera goes back before them along the causeway (the narrator 12 m away at
// first, 9 m at the end) and stands on the shore: camOf(d) — where it is for the narrator at d (moved there over time,
// as he runs: script.js). ──
const soft = (x, k) => k * Math.log1p(Math.exp(x / k));
const within = (x, lo, hi, k) => lo + soft(x - lo, k) - soft(x - hi, k);
const BEHIND_M = 0.8, BEHIND_R = 0.95, ASIDE = 0.45;
const toward = ([a, d], [a2, d2]) => (Math.atan2(a2 - a, d2 - d) * 180) / Math.PI;
// facing toward us along the causeway (its line runs a little to the right as it nears)
const RUNNING = toward([across(20), 20], [across(10), 10]);
function around(d, trip, md, rd) {
  const dm = d + BEHIND_M + (md ? 0.7 * trip : 0), dr = d + BEHIND_R + (!md && rd ? 0.7 * trip : 0);
  return { mad_a: across(dm) - ASIDE, mad_d: dm, rod_a: across(dr) + ASIDE, rod_d: dr };
}
function camOf(d) {
  const cz = within(d - 9 - (3 * (d - runAt(1))) / (runAt(0) - runAt(1)), 0, 82, 3);
  return { camera_z: cz, camera_x: across(14 + cz) - across(14) };
}
// their hands: in his while they run (the one stumbling lets go, and takes it again as they are up)
function holding(trip, md, rd) {
  const hold = trip < 0.25, m = md && hold, r = rd && (hold || md);
  return {
    narrator_reach: m || r ? { r: m ? 'madeline#hand_l' : null, l: r ? 'roderick#hand_r' : null } : null,
    madeline_reach: m ? { l: 'narrator#hand_r' } : null,
    roderick_reach: r ? { r: 'narrator#hand_l' } : null,
  };
}

// ── the film: the prologue, the flight, the endings (the world's module beats — `beat` names one; notes.md lists them).
// film(scene) — the scene its people are measured on ──
const SHOWCASE = ['prologue', 'run', 'dash', 'stumble', 'ashore', 'end_alone', 'end_madeline', 'end_roderick', 'end_both', 'end_stayed', 'gone'];
function film(scene) {
  const at = (id, [a, d]) => ({ [`${{ narrator: 'nar', madeline: 'mad', roderick: 'rod' }[id]}_a`]: a, [`${{ narrator: 'nar', madeline: 'mad', roderick: 'rod' }[id]}_d`]: d });
  // someone as they are when nothing is said: standing (Madeline: still), turned toward us, looking ahead, hands free
  const rest = (id, does = 'stand') => ({ [`${id}_do`]: does, [`${id}_turn`]: 180, [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_gait`]: null });
  const people = { ...rest('narrator'), ...rest('madeline', 'still'), ...rest('roderick') };
  // the night under the red moon, nobody stirring
  const night = {
    moon: 1, storm: 0.6, morning: 0, ghosts: 0, swim: 0, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0,
    running: false, trip: 0, hand_in_hand: false, ...people,
  };
  // nobody there
  const empty = { narrator_here: false, with_madeline: false, with_roderick: false, madeline_here: false, roderick_here: false };
  // on the causeway, the house splitting: who runs with him is the game's (with_madeline, with_roderick) — where they
  // are, from where the run has them now
  const flight = () => {
    const md = !!scene.get('with_madeline'), rd = !!scene.get('with_roderick'), r = scene.get('run') ?? 0, d = runAt(r);
    return {
      ...night, fall: 0.15, storm: 0.75, narrator_here: true, madeline_here: md, roderick_here: rd, running: true, run: r,
      narrator_turn: RUNNING, madeline_turn: RUNNING, roderick_turn: RUNNING, narrator_gait: 'flee', madeline_gait: 'flee', roderick_gait: 'flee',
      nar_a: across(d) + 0.05, nar_d: d, ...around(d, 0, md, rd), ...camOf(d), ...holding(0, md, rd),
    };
  };
  // an ending: the last of the house going under, them on the near shore
  const ashore = { ...night, fall: 0.78, narrator_here: true };
  // the house goes the rest of the way down, and the wind drops (beside what the people do)
  const sinks = (s) => s.sequence(async (q) => {
    await q.move('fall', 1, { over: 7.5, ease: 'inOut' });
    await q.wait(5.5);
    await q.move('storm', 0.45, { over: 2, ease: 'inOut' });
  });
  // end_alone: off the causeway at a run, slowing on the shore to a stop; turned to the house, half a step back
  const OFF_START = [across(20.5) + 0.05, 20.5], OFF_WAY = [[across(14) + 0.05, 14], [across(9.6) + 0.05, 9.6]], STOP = [-2, 7.8];
  // end_madeline: she at the very water; he comes up beside her and reaches for her
  const MAD_WATER = [-0.7, 8.85], NAR_BESIDE = [-1.9, 7.9];
  // end_roderick: on his knees at the water, half turned; he behind, a step, and no further
  const ROD_KNEEL = [-0.6, 8.6], ROD_TURN = 35, NAR_BEHIND = [-2.3, 7.3];
  // end_both: brother and sister at the water, hand in hand; he apart
  const ROD_AT = [-0.3, 8.7], MAD_AT = [0.32, 8.75];
  // the run, showcased: the narrator runs on to where `run` says (at his pace), the house falling by its own clock
  const dashTo = async (s, r, fall) => {
    const d = runAt(r), T = Math.max(1, (s.state.nar_d - d) / 4.5);
    s.move('fall', fall, { over: T, ease: 'linear' });
    s.set('run', r);
    await s.until(() => s.state.nar_d <= d + 0.25);
  };

  return {
    // ---- The end first, nobody there: the fissure blazes as the moon comes into it, the house splits and goes down into
    // the tarn; rings on the water, the moon in it
    prologue: {
      from: () => ({ ...night, ...empty, fall: 0, moon: 0.55 }),
      run: async (s) => {
        s.move('camera_z', 9, { over: 22, ease: 'inOut' });
        await s.wait(2);
        s.move('moon', 1, { over: 3.5, ease: 'inOut' });
        await s.wait(3);
        // (the fissure opening: the house splits — the game's roar from here)
        s.sequence(async (q) => { await q.wait(4 * 0.75); q.tell('prologue:split'); });
        await s.move('fall', 0.3, { over: 4, ease: 'in' });
        await s.move('fall', 0.55, { over: 3.5, ease: 'inOut' });
        await s.move('fall', 0.88, { over: 5.5, ease: 'inOut' });
        await s.move('fall', 1, { over: 2, ease: 'out' });
        await s.move('storm', 0.45, { over: 2, ease: 'inOut' });
      },
    },
    // ---- On the causeway toward us, the house splitting behind; then the game runs him (run, fall)
    run: {
      from: flight,
      run: async (s) => {
        await s.move('storm', 0.85, { over: 1.5, ease: 'inOut' });
      },
    },
    // ---- (the showcase's) He runs on, half the way, the house coming apart behind
    dash: {
      after: ['run', 'stumble'],
      from: flight,
      run: async (s) => { await dashTo(s, 0.5, 0.33); },
    },
    // ---- One of them stumbles — the one he leads by the hand (he looks back at them), or he himself — and is up again
    stumble: {
      after: ['run', 'stumble', 'dash'],
      from: () => ({ ...flight() }),
      run: async (s) => {
        const one = s.state.with_madeline ? 'madeline' : s.state.with_roderick ? 'roderick' : 'narrator';
        // (into the stumble's own moment: the foot caught at once)
        s.person(one).do('stumble', { going: true, from: 0.6 });
        if (one !== 'narrator') s.sequence(async (q) => { await q.wait(0.1); q.person('narrator').look(one); });
        await s.move('trip', 1, { over: 0.35, ease: 'out' });
        await s.wait(0.25);
        s.move('trip', 0, { over: 1.1, ease: 'inOut' });
        await s.wait(0.5);
        s.person('narrator').look(null);
        await s.wait(0.6);
      },
    },
    // ---- (the showcase's) …and off the causeway onto the shore, the break close behind
    ashore: {
      after: ['dash', 'stumble'],
      from: flight,
      run: async (s) => { await dashTo(s, 1, 0.42); },
    },
    // ---- As in Poe: alone, he runs off the causeway, slows on the shore, turns to the house, and it goes under
    end_alone: {
      from: () => ({ ...night, ...empty, fall: 0.42, narrator_here: true, ...at('narrator', OFF_START), narrator_turn: RUNNING, narrator_gait: 'flee' }),
      run: async (s) => {
        const nar = s.person('narrator');
        s.sequence(async (q) => {
          await q.move('fall', 0.52, { over: 4.6, ease: 'inOut' });
          await q.move('fall', 0.9, { over: 6, ease: 'inOut' });
          await q.move('fall', 1, { over: 2, ease: 'out' });
          // (the tarn closed over it: the game's last line from here)
          q.tell('end_alone:under');
          await q.move('storm', 0.45, { over: 2, ease: 'inOut' });
        });
        await nar.walk(OFF_WAY);
        // (slowing from the run to a walk, onto the edge of the shore)
        nar.gait(null);
        await nar.walk([[-2.12, 8.6], STOP]);
        await nar.turn(8);
        await s.wait(1.2);
        await nar.go('step_back', { from: STOP, turn: 8 });
        await s.wait(4);
      },
    },
    // ---- Madeline at the very water, not leaving it; he beside her reaches for her and lets the hand drop
    end_madeline: {
      from: () => ({
        ...ashore, with_madeline: true, with_roderick: false, madeline_here: true, roderick_here: false,
        ...at('madeline', [-0.9, 7.9]), madeline_turn: 2, madeline_gait: 'sleepwalk', ...at('narrator', [-2.5, 7.1]), narrator_turn: 15,
      }),
      run: async (s) => {
        const nar = s.person('narrator'), mad = s.person('madeline');
        const house = sinks(s);
        await s.wait(1.5);
        await mad.walk([[-0.8, 8.4], MAD_WATER]);
        await mad.turn(2);
        // (she at the very water: the game's line from here)
        s.tell('end_madeline:water');
        await s.wait(0.5);
        await nar.walk([NAR_BESIDE]);
        nar.look('madeline');
        await nar.turn(toward(NAR_BESIDE, MAD_WATER));
        await s.wait(0.8);
        // (the hand out toward her, not reaching her)
        nar.reach({ r: [-1.45, 8.3, 1.25] });
        await s.wait(2.5);
        nar.reach(null);
        await house;
      },
    },
    // ---- Roderick on his knees at the water, listening; he behind, a step, and no further
    end_roderick: {
      from: () => ({
        ...ashore, with_madeline: false, with_roderick: true, madeline_here: false, roderick_here: true,
        ...at('roderick', [-0.7, 7.9]), roderick_turn: 2, ...at('narrator', [-2.6, 6.8]), narrator_turn: 20,
      }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick');
        const house = sinks(s);
        await s.wait(1);
        // to the water, half turned, and down on his knees
        await rod.go('kneel_down', { to: ROD_KNEEL, turn: ROD_TURN });
        rod.do('kneel', { loop: true });
        await s.wait(0.6);
        // the head bowed and turned to the water: listening
        rod.look([-0.9, 9.5, 0]);
        await s.wait(2.5);
        await nar.walk([NAR_BEHIND]);
        nar.look('roderick');
        // (he come up behind him: the game's line from here)
        s.tell('end_roderick:behind');
        await house;
      },
    },
    // ---- Brother and sister at the water, hand in hand; he apart
    end_both: {
      from: () => ({
        ...ashore, with_madeline: true, with_roderick: true, madeline_here: true, roderick_here: true, hand_in_hand: true,
        ...at('roderick', [-0.32, 8.0]), roderick_turn: 0, ...at('madeline', [0.3, 8.05]), madeline_turn: 0, madeline_gait: 'sleepwalk',
        roderick_reach: { r: 'madeline#hand_l' }, madeline_reach: { l: 'roderick#hand_r' }, ...at('narrator', [-3.1, 7.2]), narrator_turn: 30,
      }),
      run: async (s) => {
        const nar = s.person('narrator'), rod = s.person('roderick'), mad = s.person('madeline');
        const house = sinks(s);
        await s.wait(1.5);
        await s.all(rod.walk([ROD_AT]), mad.walk([MAD_AT]));
        await s.all(rod.turn(0), mad.turn(0));
        await s.wait(1.5);
        mad.look('roderick');
        await s.wait(1);
        rod.look('madeline');
        await s.wait(1);
        nar.look('roderick#hand_r');
        // (his eyes on their hands: the game's line from here)
        s.tell('end_both:hands');
        await house;
      },
    },
    // ---- Nobody came out: the eye goes to the water; in the reflection, for a moment, the three of them in a window;
    // the tarn closes
    end_stayed: {
      from: () => ({ ...night, ...empty, fall: 0.4 }),
      run: async (s) => {
        s.move('camera_z', 60, { over: 5, ease: 'inOut' });
        s.move('camera_look', 0.12, { over: 5, ease: 'inOut' });
        s.move('fall', 0.5, { over: 5.5, ease: 'inOut' });
        await s.wait(3.5);
        // (a little nearer, toward the reflected window: the three of them in it)
        s.move('camera_z', 75, { over: 2.5, ease: 'inOut' });
        s.move('camera_x', 6, { over: 2.5, ease: 'inOut' });
        s.move('camera_look', 0.22, { over: 2.5, ease: 'inOut' });
        await s.wait(1);
        s.move('ghosts', 1, { over: 1, ease: 'out' });
        await s.wait(3.5);
        s.move('ghosts', 0, { over: 1.5, ease: 'in' });
        await s.move('fall', 1, { over: 6.5, ease: 'inOut' });
        // (the tarn closed: the game's line from here)
        s.tell('end_stayed:under');
        await s.move('storm', 0.45, { over: 2, ease: 'inOut' });
      },
    },
    // ---- Morning: the empty tarn, the water still; from the causeway only its posts. Once it is all there, out of the
    // dark, the scene tells 'gone:morning'
    gone: {
      from: () => ({ ...night, ...empty, fall: 1, moon: 0, storm: 0.3, morning: 1 }),
      run: async (s) => {
        s.move('camera_z', 2.5, { over: 14, ease: 'inOut' });
        s.tell('gone:morning');
        await s.wait(4);
      },
    },
  };
}

return {
  film, SHOWCASE, N, across, SHORE, runAt, runOf, breakAt, fallOf, sm, around, camOf, holding,
  sky, skyMotion, house, houseMirror, houseMotion, aboveTarn, belowTarn, mist, causeway, causewayMotion, clear, shore, reeds,
  breach, breachMotion, ringsMotion,
};
