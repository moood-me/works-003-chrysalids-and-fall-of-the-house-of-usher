const S = e.state || {};
const r = e.lib.actor(g, e, "sealand");
{
  const sp = S.spray ?? 0;
  if (r && r.hand && sp > 0.01 && (S.sealand_hide ?? 0) < 0.5) {
    const h = r.hand.r,
      dir = Math.sin(((r.face ?? 90) * Math.PI) / 180) >= 0 ? 1 : -1,
      A = e.anim;
    g.fillStyle = "#d8d6ce";
    g.beginPath();
    g.ellipse(h[0], h[1] + 0.02, 0.045, 0.08, 0, 0, 7);
    g.fill();
    for (let i = 0; i < 40; i++) {
      const f = (A.hash(i, 1) + e.t * 0.9) % 1;
      const x = h[0] + dir * f * 1.5 + (A.hash(i, 2) - 0.5) * f * 0.6,
        y = h[1] + f * 0.6 + (A.hash(i, 3) - 0.5) * f * 0.4;
      g.fillStyle = "rgba(236,240,246," + 0.5 * sp * (1 - f) + ")";
      g.beginPath();
      g.arc(x, y, 0.02 + f * 0.07, 0, 7);
      g.fill();
    }
    const cx = h[0] + dir * 0.6,
      cy = h[1] + 0.25,
      rg = g.createRadialGradient(cx, cy, 0, cx, cy, 0.9);
    rg.addColorStop(0, "rgba(230,236,244," + 0.22 * sp + ")");
    rg.addColorStop(1, "rgba(230,236,244,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(cx, cy, 0.9, 0, 7);
    g.fill();
  }
}
