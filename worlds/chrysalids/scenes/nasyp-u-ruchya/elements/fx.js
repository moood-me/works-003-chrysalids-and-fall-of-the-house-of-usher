// dust where a body lands in the sand (puff 0…1 at puff_a), rings where something meets the water (ring 0…1 at ring_a)
const s = e.state,
  L = e.lib;
function puff(p, A) {
  if (p <= 0.001 || p >= 0.999) return;
  const x = A - L.BX,
    y = -L.bankL(x),
    k = e.anim.ease.out(p);
  for (let i = 0; i < 14; i++) {
    const an = Math.PI * (0.05 + 0.9 * e.anim.hash(i, 3)),
      r = (0.15 + 0.5 * e.anim.hash(i, 5)) * k,
      up = 0.25 * e.anim.hash(i, 9) * k;
    const px = x + Math.cos(an) * r * (i % 2 ? 1 : -1),
      py = y - Math.sin(an) * r * 0.35 - up,
      rad = 0.05 + 0.1 * k * e.anim.hash(i, 11);
    g.globalAlpha = 0.32 * (1 - p) * (0.6 + 0.4 * e.anim.hash(i, 13));
    g.fillStyle = i % 3 ? "#e4d3a4" : "#cdb985";
    g.beginPath();
    g.ellipse(px, py, rad * 1.4, rad, 0, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
}
function rings(p, A) {
  if (p <= 0.001 || p >= 0.999) return;
  const x = A - L.BX;
  for (let i = 0; i < 3; i++) {
    const q = p * 1.25 - i * 0.18;
    if (q <= 0 || q >= 1) continue;
    g.strokeStyle = "#eef0dc";
    g.globalAlpha = 0.55 * (1 - q);
    g.lineWidth = 0.012;
    g.beginPath();
    g.ellipse(x, 0.1, 0.12 + 0.5 * q, 0.03 + 0.09 * q, 0, 0, 7);
    g.stroke();
  }
  // a few drops
  for (let i = 0; i < 8; i++) {
    const q = p * 2.2;
    if (q >= 1) break;
    const vx = (e.anim.hash(i, 21) - 0.5) * 0.8,
      vy = 0.9 + 0.8 * e.anim.hash(i, 23);
    g.fillStyle = "#f1f2e2";
    g.globalAlpha = 0.7 * (1 - q);
    g.beginPath();
    g.arc(x + vx * q, 0.05 - vy * q + 1.6 * q * q, 0.012, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
}
puff(s.puff ?? 0, s.puff_a ?? 1);
puff(s.puff2 ?? 0, s.puff2_a ?? 1);
rings(s.ring ?? 0, s.ring_a ?? 2.7);
