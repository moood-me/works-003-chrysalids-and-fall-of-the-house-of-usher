// ── the fugitives, painted together so they can hand Petra over and climb from one horse to another (order = depth);
// how they move: lib.js, people
const s = e.state,
  K = e.kit.chrysalids,
  L = e.lib,
  A = e.anim,
  path = L.path,
  { v, gx, gy, inFar, petraIn, pu } = L.fugitive(e),
  HW = L.HW;
g.save();
L.behindRidge(g);
// the pack great-horse, tied behind
const PK = K.horse(g, e, { id: "pack" });
// David in the far pannier; the great-horse, Rosalind in its near pannier
if (inFar) K.person(g, e, { id: "david" });
const G = K.horse(g, e, { id: "great" });
const bx = G.basket[0],
  by = G.basket[1];
// Petra in the pannier, its wall in front of her; her bow lying across the pannier until she takes it
if (petraIn) { g.save(); L.outsideBasket(g, G.basket, HW); K.person(g, e, { id: "petra" }); g.restore(); }
if (v("ros_bow", 0) <= 0.5) K.prop(g, e, "bow", { ...L.night, x: bx + 0.05, y: by - 0.04, angle: 88 });
// Petra going down into the pannier, its wall in front of her
const petraAt = L.petraAt(e, G.basket);
if (petraAt && pu >= 0.86) { g.save(); L.outsideBasket(g, G.basket, HW); K.person(g, e, { id: "petra" }); g.restore(); }
// Sheba, David's mare; David on his feet; Petra lifted between them
K.horse(g, e, { id: "sheba" });
if (v("david_down", 0) > 0 && !inFar) K.person(g, e, { id: "david" });
if (petraAt && pu < 0.86) K.person(g, e, { id: "petra" });

// the lead rope from the pack horse's halter to the great-horse's saddle
{
  const a = PK.head,
    b = [gx - 0.55 * HW, gy - 0.86 * HW];
  g.strokeStyle = "rgba(20,24,34,0.9)";
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(a[0], a[1] + 0.1);
  g.quadraticCurveTo((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 0.3, b[0], b[1]);
  g.stroke();
}
g.restore();

// Rosalind's arrow, from her bow hand to the first rider of the search (search_a): into him, or (arrow_high) over his head and on
const fly = v("arrow", 0),
  ros = G.riders && G.riders[0];
if (fly > 0 && ros && (s.arrow_high || fly < 1)) {
  const ra = v("search_a", -20),
    S = ros.hand.l,
    T = s.arrow_high ? [ra + 0.3, path(ra) - 3.0] : [ra - 0.05, path(ra) - 2.0];
  const k = s.arrow_high ? 1.9 : 1,
    p = [S[0] + (T[0] - S[0]) * fly * k, S[1] + (T[1] - S[1]) * fly * k - 0.35 * Math.sin(Math.PI * Math.min(1, fly))];
  const ang = Math.atan2(T[1] - S[1] - 0.35 * Math.PI * Math.cos(Math.PI * Math.min(1, fly)), T[0] - S[0]);
  g.save();
  g.translate(p[0], p[1]);
  g.rotate(ang);
  g.globalAlpha = s.arrow_high ? 1 - A.span(fly, 0.7, 1) : 1;
  g.strokeStyle = "rgba(14,16,24,0.95)";
  g.lineWidth = 0.022;
  g.beginPath();
  g.moveTo(-0.72, 0);
  g.lineTo(0, 0);
  g.stroke();
  g.fillStyle = "rgba(14,16,24,0.95)";
  g.beginPath();
  g.moveTo(0.05, 0);
  g.lineTo(-0.04, -0.025);
  g.lineTo(-0.04, 0.025);
  g.fill();
  g.fillStyle = "rgba(150,160,180,0.8)";
  g.beginPath();
  g.moveTo(-0.72, 0);
  g.lineTo(-0.62, -0.04);
  g.lineTo(-0.58, 0);
  g.lineTo(-0.62, 0.04);
  g.fill();
  g.restore();
}
