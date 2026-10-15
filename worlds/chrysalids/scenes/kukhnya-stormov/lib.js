// The Strorm kitchen: what its elements and its script share. The people are the engine's (elements with "person",
// the world's cast); here — where the room's things are (metres: across, distance; up), the chairs as painted, the
// stairs behind the stair door (the land there: relief.js), and the wish — the third hand — painted over the boy.
const LAMP = { a: 0.3, h: 1.02, d: 4.45 },
  HEARTH = { a: 3.35, d: 6.2 };
const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
// the stair door in the back wall (the wall at 6.2 m): its opening; the stairs behind it go straight up away from it,
// STEP.n steps of STEP.rise, each STEP.run deep, the first at STEP.d
const DOOR = { a0: -2.95, a1: -2.2, h: 2.02, d: 6.2 },
  STEP = { d: 6.4, run: 0.26, rise: 0.21, n: 10 };
const stairAt = (across, distance) =>
  across > DOOR.a0 - 0.05 && across < DOOR.a1 + 0.05 && distance >= STEP.d ? STEP.rise * Math.min(STEP.n, Math.floor((distance - STEP.d) / STEP.run) + 1) : 0;
// a chair seen three-quarter on: its back on side sg (+1 right), `top` m high; lit on the lamp's side
function chair(g, sg, top, L) {
  const q = (x, y, w, h, c) => {
      g.fillStyle = c;
      g.fillRect(x, y, w, h);
    },
    dk = "#110c0b",
    md = "#1a1310";
  q(-0.13, -0.5, 0.03, 0.46, dk);
  q(0.21, -0.5, 0.03, 0.46, dk);
  g.fillStyle = md;
  g.beginPath();
  g.moveTo(-0.23, -0.46);
  g.lineTo(0.2, -0.46);
  g.lineTo(0.26, -0.51);
  g.lineTo(-0.17, -0.51);
  g.closePath();
  g.fill();
  q(-0.23, -0.46, 0.43, 0.04, md);
  q(-0.22, -0.43, 0.035, 0.43, md);
  q(0.165, -0.43, 0.035, 0.43, md);
  q(-0.2, -0.18, 0.38, 0.02, dk);
  const bx = sg > 0 ? 0.17 : -0.21,
    bw = 0.07;
  g.save();
  g.translate(bx, -0.48);
  g.transform(1, -0.35 * sg, 0, 1, 0, 0);
  q(0, -top + 0.48, 0.032, top - 0.48, md);
  q(bw, -top + 0.46, 0.032, top - 0.48, dk);
  for (let i = 0; i < 3; i++) q(0, -top + 0.52 + i * 0.13, bw + 0.03, 0.028, md);
  g.restore();
  g.fillStyle = "rgba(215,148,84," + 0.38 * L + ")";
  g.fillRect(-0.23, -0.46, 0.43, 0.01);
  g.fillRect(sg > 0 ? -0.22 : 0.19, -0.43, 0.012, 0.43);
}
// the wish: a third hand, pale as a thought, grows out of his side (s: where his chest is in the painting) to the knot
// (h: his hand), holds it, and is gone (w 0 → 1)
function ghost(g, e, s, h, w) {
  if (w < 0.01 || !s || !h) return;
  const fx = h[0] >= s[0] ? 1 : -1,
    s0 = [s[0] + fx * 0.04, s[1] + 0.12],
    el = [s0[0] - fx * 0.05 + 0.015 * Math.sin(e.t * 1.7), s0[1] + 0.2],
    en = [h[0] + fx * 0.02, h[1] - 0.035];
  const u = e.anim.ease.out(cl(w * 1.4, 0, 1)),
    a = w * (0.82 + 0.18 * Math.sin(e.t * 3.1));
  const p1 = [e.anim.mix(s0[0], el[0], cl(u * 2, 0, 1)), e.anim.mix(s0[1], el[1], cl(u * 2, 0, 1))],
    p2 = [e.anim.mix(el[0], en[0], cl(u * 2 - 1, 0, 1)), e.anim.mix(el[1], en[1], cl(u * 2 - 1, 0, 1))];
  g.save();
  g.shadowColor = "rgba(255,240,205,0.9)";
  g.shadowBlur = Math.min(40, 0.06 / e.px);
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const [lw, col] of [
    [0.07, "rgba(235,222,192," + 0.4 * a + ")"],
    [0.022, "rgba(255,248,228," + 0.5 * a + ")"],
  ]) {
    g.strokeStyle = col;
    g.lineWidth = lw;
    g.beginPath();
    g.moveTo(...s0);
    g.quadraticCurveTo(s0[0] + fx * 0.02, (s0[1] + p1[1]) / 2 + 0.02, ...p1);
    if (u > 0.5) g.lineTo(...p2);
    g.stroke();
  }
  if (u > 0.92) {
    const ha = a * e.anim.ease.smooth((u - 0.92) * 12.5);
    g.fillStyle = "rgba(240,230,205," + 0.5 * ha + ")";
    g.beginPath();
    g.ellipse(en[0], en[1], 0.05, 0.04, 0.3 * fx, 0, 7);
    g.fill();
    g.strokeStyle = "rgba(255,248,228," + 0.6 * ha + ")";
    g.lineWidth = 0.018;
    for (let i = 0; i < 5; i++) {
      const an = -1.1 + i * 0.45 + 0.06 * Math.sin(e.t * 3 + i),
        l = i === 0 ? 0.045 : 0.07;
      g.beginPath();
      g.moveTo(en[0] + fx * Math.cos(an) * 0.04, en[1] + Math.sin(an) * 0.04);
      g.lineTo(en[0] + fx * Math.cos(an) * (0.04 + l), en[1] + Math.sin(an) * (0.04 + l));
      g.stroke();
    }
  }
  g.restore();
}
return { LAMP, HEARTH, DOOR, STEP, stairAt, chair, ghost, cl };
