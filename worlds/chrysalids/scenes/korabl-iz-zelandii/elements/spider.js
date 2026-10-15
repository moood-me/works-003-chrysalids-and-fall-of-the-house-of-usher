const S = e.state || {},
  id = "spider";
const r = e.lib.actor(g, e, "spider");
{
  // arrows loosed while the fight goes: one every few seconds from the bow hand, off to the left
  if (r && r.hand && (S.fight ?? 0) > 0.3 && (S[id + "_p"] || "").includes("draw_bow")) {
    const per = 2.6 + e.anim.hash(e.lib.CAST.spider.seed || 1, 3) * 1.4,
      u = (e.t / per + e.anim.hash(e.lib.CAST.spider.seed || 1, 4)) % 1;
    if (u < 0.22) {
      const f = u / 0.22,
        h = r.hand.l,
        x = h[0] - f * 9,
        y = h[1] - Math.sin(f * 3.14) * 1.2 + f * 0.6;
      g.strokeStyle = "rgba(30,26,32,0.9)";
      g.lineWidth = 0.025;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + 0.75, y - 0.12 + f * 0.24);
      g.stroke();
    }
  }
}
