// the Inspector (the module's inspector): kneels at the field's edge and breaks off an ear, holds it to his lantern
// before Strorm, nods twice, flings it back into the wheat; later lifts the lantern for the torch and leaves
const o = e.lib.people.in(e);
if (!o) return;
const { mixc } = e.lib;
const A = e.anim,
  s = e.state,
  K = e.kit.chrysalids;
const a = s.in_a ?? 1.35,
  d = s.in_d ?? 7.0,
  f = s.in_f ?? 180,
  show = s.in_show || 0,
  toss = s.in_toss || 0,
  gone = s.in_gone || 0;
g.globalAlpha = 1 - gone;
const fx = Math.sin((f * Math.PI) / 180);
const me = K.person(g, e, o);
// the ear: a long stalk with a monstrous forked head, catching the lantern light
function ear(x, y, ang, sc, litk) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(sc, sc);
  const col = mixc("#3a2c1c", "#e8b868", litk);
  g.strokeStyle = col;
  g.fillStyle = col;
  g.lineCap = "round";
  g.lineWidth = 0.016;
  g.beginPath();
  g.moveTo(0, 0.1);
  g.quadraticCurveTo(0.03, -0.3, 0.15, -0.44);
  g.stroke();
  const E = (x, y, an, L, W) => {
    g.save();
    g.translate(x, y);
    g.rotate(an);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(W, -L * 0.25, W * 0.9, -L * 0.8, 0, -L);
    g.bezierCurveTo(-W * 0.9, -L * 0.8, -W, -L * 0.25, 0, 0);
    g.fill();
    g.lineWidth = 0.006;
    for (let j = 1; j < 7; j++) {
      g.beginPath();
      g.moveTo(0, (-L * j) / 7);
      g.lineTo(0.07, (-L * j) / 7 - 0.05);
      g.moveTo(0, (-L * j) / 7);
      g.lineTo(-0.07, (-L * j) / 7 - 0.05);
      g.stroke();
    }
    g.restore();
  };
  E(0.15, -0.44, 2.5, 0.34, 0.07);
  E(0.11, -0.42, 1.45, 0.26, 0.055);
  g.restore();
}
const hr = me.hand.r,
  REL = 0.52;
if ((s.in_ear || 0) > 0.5 && toss < REL)
  ear(hr[0], hr[1], (fx < 0 ? -1 : 1) * (0.15 - 0.3 * show) - 0.6 * A.span(toss, 0.3, 0.5), 1.15, 0.25 + 0.7 * show);
else if (toss >= REL && toss < 1) {
  // flying: a high arc over the wheat, turning over, smaller as it goes, dropping in some 10 m out
  const q = (toss - REL) / (1 - REL),
    k = d / 10.6,
    tx = (a + 0.6) * k - a,
    ty = 1.7 * (k - 1) - 0.7 * k;
  const x = A.mix(hr[0], tx, q),
    y = A.mix(hr[1], ty, A.ease.in(q)) - Math.sin(q * Math.PI) * 1.1;
  ear(x, y, q * 8, 1.15 - 0.5 * q, 0.45 * (1 - q));
}
