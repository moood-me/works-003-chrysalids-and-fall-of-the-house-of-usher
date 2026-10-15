// David (near bank's metres). dv_a — where he is (across, m; the element moves with him; the bank's x = dv_a + 2.4):
// the top (y −1.6) left of −5.5, the clay slope down to the toe (x 2), then the pool, its bottom dropping (wading,
// then swimming); dv_face — which way he faces (deg); poses by weight: dv_wade (deep water, arms out), dv_lunge
// (throwing himself forward), dv_swim, dv_kneel (one knee, by Petra), dv_shoulder (his hand on her shoulder),
// dv_scoop (down on his haunches, his arms under her), dv_carry (he has her in his arms and rises with her);
// dv_look 1 — his eyes on Petra.
// pt_held 1 — he has her, and paints her: clinging to his shoulders while he swims; on her feet beside him after
// (pt_wx — where she is, pt_face, pt_sit — she sits down on the bank, pt_cry — face in her hands); dv_hand — her
// hand in his; bond 0..1 — he and Rosalind hear each other (he looks across); after 0..1 — the others come: he
// looks down at Petra.
const o = e.lib.people.david(e);
if (!o) return;
const L = e.lib,
  s = e.state,
  t = e.t,
  W = L.W,
  K = e.kit.chrysalids;
const x = o.x,
  sw = L.clamp(s.dv_swim ?? 0),
  ground = L.bed(x),
  v = e.speed('dv_a') ?? 0;
g.translate(-x, 0);
// Petra: on her feet beside him — nearer the eye than he is, but his hands on her go over her: her first, then him —,
// in his arms (the module paints her), or clinging to him while he swims back (lib.js: people)
const held = L.people.petra_held(e);
if (held) K.person(g, e, held);
const me = K.person(g, e, o);
const cling = L.people.petra_cling(e);
if (cling) K.person(g, e, cling);
// spray as he goes in fast, and from his strokes
if (ground > W + 0.05 || sw > 0) {
  const cx = me.hip[0];
  L.splash(g, t, cx + Math.sign(v) * 0.2, L.clamp(Math.abs(v) / 2.2) * (sw > 0.5 ? 0.6 : 1), 23, W, 0.5);
  if (sw > 0.5) L.splash(g, t * 1.3, me.hand.r[0], 0.35, 29, W, 0.25);
}
