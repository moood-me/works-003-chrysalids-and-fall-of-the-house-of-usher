// ── the fog lying in the hollow behind the ridge's shoulder (fog 0…1): drifting banks over the crest line, in front of
// whoever stands down there; lamp / lamp_x — the search's lantern held toward the hollow: a warm pool on the fog
const s = e.state,
  L = e.lib,
  f = typeof s.fog === "number" ? s.fog : 0,
  lamp = typeof s.lamp === "number" ? s.lamp : 0;
if (f <= 0.01 && lamp <= 0.01) return;
const top = (x) => -L.cr(x);
// the banks: soft wide ellipses riding the crest line, thickest over the hollow (x 4…13), drifting slowly
const reach = (x) => Math.max(0, Math.min(1, (x - 2.6) / 1.6)) * Math.max(0, Math.min(1, (17 - x) / 3));
for (let i = 0; i < 26; i++) {
  const sp = 0.05 + e.rnd() * 0.07,
    base = e.rnd() * 16,
    x = 2.5 + ((((base + e.t * sp * (i % 3 ? 1 : -1)) % 16) + 16) % 16),
    k = reach(x);
  if (k <= 0) continue;
  const y = top(x) + 0.25 - e.rnd() * 1.2,
    rw = 1.6 + e.rnd() * 2.2,
    a = (0.14 + 0.2 * e.rnd()) * f * k;
  const gr = g.createRadialGradient(x, y, 0, x, y, rw);
  gr.addColorStop(0, `rgba(128,144,176,${a.toFixed(3)})`);
  gr.addColorStop(1, "rgba(128,144,176,0)");
  g.save();
  g.translate(x, y);
  g.scale(1, 0.32);
  g.translate(-x, -y);
  g.fillStyle = gr;
  g.fillRect(x - rw, y - rw, 2 * rw, 2 * rw);
  g.restore();
}
// a low even veil under the banks, so the hollow reads as full of fog
// (over the crest line only: below it the shoulder is in front)
g.save();
g.beginPath();
g.moveTo(3, -4);
for (let x = 3; x <= 18; x += 0.25) g.lineTo(x, top(x) + 0.02);
g.lineTo(18, -4);
g.lineTo(3, -4);
g.closePath();
g.clip();
for (let x = 3; x < 18; x += 0.5) {
  const y0 = top(x),
    h = 1.1 * reach(x);
  const gr = g.createLinearGradient(0, y0 - h, 0, y0);
  gr.addColorStop(0, "rgba(120,136,168,0)");
  gr.addColorStop(1, `rgba(120,136,168,${(0.5 * f * reach(x)).toFixed(3)})`);
  g.fillStyle = gr;
  g.fillRect(x, y0 - h, 0.52, h + 0.05);
}
g.restore();
// the lantern's light on the fog
if (lamp > 0.01) {
  const x = typeof s.lamp_x === "number" ? s.lamp_x : 6,
    y = top(x) - 0.35,
    r = 1.7,
    fl = 0.9 + 0.1 * Math.sin(e.t * 7.3) * Math.sin(e.t * 3.1);
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(236,188,120,${(0.42 * lamp * fl).toFixed(3)})`);
  gr.addColorStop(0.5, `rgba(220,170,110,${(0.18 * lamp * fl).toFixed(3)})`);
  gr.addColorStop(1, "rgba(220,170,110,0)");
  g.save();
  g.translate(x, y);
  g.scale(1, 0.55);
  g.translate(-x, -y);
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.restore();
}
