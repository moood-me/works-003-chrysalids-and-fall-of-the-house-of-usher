// What the near bank's elements share (all in the near bank's metres: anchor x 0.35, 9 m off; y down).
// The water's surface is at y W; the bank's top (y −1.6) runs left of x −5.5 and slopes down to the toe at x 2;
// past the toe the bottom drops into the pool (bed). The willow is rooted at the toe; the branch Petra holds ends at tip().
const { clamp, mix, span } = anim;
const W = 0.3;
const ys = x => {
  if (x < -5.5) return -1.6 + 0.08 * Math.sin(x * 0.7);
  if (x > 2) return 0.25;
  const u = (x + 5.5) / 7.5;
  return -1.6 + 1.85 * u * u * (3 - 2 * u);
};
const bed = x => (x <= 2 ? ys(x) : 0.25 + Math.pow(x - 2, 1.25) * 0.75);
// the ground's height (m, up) under bank x — for the module's groundAt: feet and knees follow the clay and the bottom
const heightAt = x => -bed(x);
// the branch: bend 0..1 (her weight; at branch 0.85 it breaks)
const ROOT = [2.5, 0.22];
const tip = (branch, t) => {
  const b = clamp(branch / 0.85),
    tug = 0.05 * Math.sin(t * 2.6) + 0.03 * Math.sin(t * 4.1 + 1);
  return [5.05 + 0.2 * b + tug * 0.4, W - 0.5 + 0.25 * b + Math.abs(tug) * 0.3];
};
// the far bank (its own metres: anchor x 0.5, 20 m off): the field's edge, and the slope down to the water (y 0)
const top = x => -2.4 - 0.12 * Math.sin(x / 7 + 0.6) - 0.06 * Math.sin(x / 2.3);

// a ring on the water at (x, W): flattened, spreading, fading — k 0..1 its age
const ring = (g, x, r, k, a, wl = W) => {
  g.globalAlpha = a * (1 - k);
  g.beginPath();
  g.ellipse(x, wl, r, r * 0.16, 0, 0, 7);
  g.stroke();
};
// the cry heard by those who hear: soft pale rings spreading from (cx, cy); Pw 0..1 its strength; R how far
const cry = (g, t, cx, cy, Pw, R, col = '240,238,228', speed = 0.11, n = 4) => {
  if (Pw < 0.01) return;
  const rg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.07);
  rg.addColorStop(0, `rgba(${col},${0.16 * Pw})`);
  rg.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = rg;
  g.fillRect(cx - R * 0.07, cy - R * 0.07, R * 0.14, R * 0.14);
  for (let i = 0; i < n; i++) {
    const k = (t * speed + i / n) % 1,
      r = 0.3 + k * R,
      a = Pw * 0.5 * Math.pow(1 - k, 1.5) * Math.min(1, k * 10),
      w = 0.04 + k * R * 0.05;
    for (let pass = 0; pass < 3; pass++) {
      g.globalAlpha = a * [0.3, 0.55, 0.3][pass];
      g.strokeStyle = `rgb(${col})`;
      g.lineWidth = w * [1.6, 0.6, 0.25][pass];
      g.beginPath();
      for (let j = 0; j <= 80; j++) {
        const an = (j / 80) * 6.2832,
          rr = r * (1 + 0.025 * Math.sin(an * 5 + t * 0.7 + i));
        const x = cx + Math.cos(an) * rr,
          y = cy + Math.sin(an) * rr * 0.62;
        j ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
  }
  g.globalAlpha = 1;
};
// splashes: drops thrown up from (x, wl), s 0..1 how strong; seed varies them
const splash = (g, t, x, s, seed, wl = W, wide = 0.5) => {
  if (s < 0.02) return;
  g.fillStyle = '#e4e6de';
  for (let i = 0; i < 26; i++) {
    const h = anim.hash(i, seed),
      k = (t * (1.6 + h) + anim.hash(i, seed + 1)) % 1;
    const vx = (anim.hash(i, seed + 2) - 0.5) * wide * 2.2,
      vy = 0.6 + anim.hash(i, seed + 3) * 1.2;
    const px = x + vx * k,
      py = wl - (vy * k - 1.6 * k * k) * s;
    if (py > wl + 0.02) continue;
    g.globalAlpha = 0.7 * s * (1 - k);
    g.beginPath();
    g.arc(px, py, 0.015 + 0.02 * h, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
};
// how the figures are lit: the overcast sky from above, a little rim so heads read against the fields
const LIT = { light: 0.55, rim: '#cfd3cb', rimDir: -100, rimWidth: 1.1 };
// where the figures' heads are (bank's metres), for the rings of what they hear: as moved (beforeFrame)
const where = { petra: [5.3, 0.1], david: [0, -1] };
// The people as the state has them now — e: an element's, or beforeFrame's (with the lib, the kit, anim); got: those moved
// before (where they are): moved once a frame (beforeFrame), painted by their elements from the very same
// (e.lib.people.<key>(e)). The far bank's (far_people): Rosalind, the farmhands (they look at her), the late ones.
const sm = (u) => {
  u = clamp(u);
  return u * u * (3 - 2 * u);
};
const people = {
  rosalind: (e) => {
    const s = e.state,
      t = e.t;
    const view = 0.1,
      light = 0.5;
    const bond = s.bond ?? 0,
      af = s.after ?? 0;
    const down = s.ro_down ?? 0,
      wade = s.ro_wade ?? 0,
      rx = s.ro_x ?? 6.2;
    const y0 = top(rx) + 0.12,
      yr = mix(y0, 0.02, sm(down)) + 0.32 * wade;
    const z = -2.2 * down - 0.8 * wade;
    const drop = s.ro_drop ?? 0,
      rk = s.ro_rake ?? 1;
    const ro = {
      who: "rosalind",
      id: "rosalind",
      t: e.t,
      x: rx,
      y: yr,
      at: [rx, z],
      face: s.ro_face ?? 90,
      light,
      view,
      rim: "#cfd3cb",
      rimDir: -100,
      rimWidth: 1.0,
      shadow: wade > 0.05 ? 0 : 0.3,
      pose: { rake: rk, freeze: s.ro_struck ?? 0, head_hands: s.ro_hands ?? 0, slump: (s.ro_away ?? 0) * 0.7 },
      style: (s.ro_away ?? 0) > 0.5 ? "sad" : undefined,
      water: 0.32 * wade,
      hold: drop < 0.05 ? { both: "rake" } : undefined,
      cycle: t * 0.95,
      look:
        bond > 0.3 && af < 0.5
          ? [rx - 4, 1.5, -11]
          : (s.ro_struck ?? 0) > 0.5 && (s.ro_hands ?? 0) < 0.5 && down < 0.05
            ? [rx - 3, 1.2, -6]
            : undefined,
    };
    return ro;
  },
  // the farmhands: they hear nothing. stare 0..1 — they stop raking and look at her (each in his own time);
  // follow 0..1 — one of them goes down the slope after her and stands above the water, looking
  farmhands: (e, got) => {
    const s = e.state,
      t = e.t;
    const view = 0.1,
      light = 0.5;
    const fol = sm(s.follow ?? 0),
      ro = got?.rosalind;
    return [
      { id: "fh1", seed: 3, who: "farmhand", x: 1.4, f: 100, late: 0.9 },
      { id: "fh2", seed: 8, who: "man", x: 3.3, f: 80, late: 0.2 },
      { id: "fh3", seed: 14, who: "farmhand", x: 9.6, f: -95, late: 1.6 },
    ].map((h) => {
      const stare = e.kit.chrysalids.delayed(e, "stare", h.id, h.late);
      const goes = h.id === "fh2" ? fol : 0;
      const hx = mix(h.x, 4.7, goes);
      const y = mix(top(hx) + 0.12, 0.25, goes * 0.65); // he stops on the slope, above the water
      return {
        who: h.who,
        id: h.id,
        seed: h.seed,
        x: hx,
        y,
        at: [hx, -1.1 * goes],
        face: goes > 0.02 && goes < 0.98 ? 120 : h.f,
        light,
        view,
        rim: "#cfd3cb",
        rimDir: -100,
        rimWidth: 1.0,
        pose: { rake: 1 - stare },
        hold: { both: "rake" },
        cycle: t * (0.92 + ((0.1 * h.seed) % 3)) + h.seed,
        look: stare > 0.3 && ro ? [ro.head[0], ro.head[1]] : undefined,
        lookSpeed: 0.5,
      };
    });
  },
  // the late ones: along the cart track from the left, stopping at the edge to stare; never in step
  late: (e) => {
    const s = e.state;
    const view = 0.1,
      light = 0.5;
    const crowd = s.crowd ?? 0;
    if (crowd <= 0.001) return null;
    return [
      { id: "m1", who: "man", seed: 21, x: -1.8 },
      { id: "w1", who: "woman", seed: 5, x: -0.6 },
      { id: "o1", who: "old_man", seed: 9, x: 0.7 },
      { id: "b1", who: "boy", seed: 31, x: 2.3 },
      { id: "w2", who: "woman", seed: 17, x: 4.2 },
    ]
      .map((p, i) => {
        const c = e.kit.chrysalids.delayed(e, "crowd", p.id, 1.5),
          u = clamp((c - i * 0.06) / 0.8),
          w = sm(u);
        if (u <= 0) return null; // not here yet
        const px = mix(p.x - 15, p.x, w);
        const arrived = u > 0.97;
        return {
          who: p.who,
        id: p.id,
        seed: p.seed,
        t: e.t,
        x: px,
        y: top(px) + 0.1,
        at: [px, 0],
        face: arrived ? (i % 2 ? 20 : -15) : 90,
        light,
        view,
        rim: "#cfd3cb",
        rimDir: -100,
        rimWidth: 1.0,
        style: p.who === "old_man" ? "old" : "rushed",
        pose: arrived ? { point_down: p.id === "m1" ? 0.8 : 0, arms_folded: p.id === "o1" ? 1 : 0, shake: p.id === "w1" ? 0.6 : 0 } : undefined,
        look: arrived ? [6, 1, -8] : undefined,
        lookSpeed: 0.6,
      };
      })
      .filter(Boolean);
  },
  // Petra in the pool, until David has her (pt_held: he paints her)
  petra: (e) => {
    const L = e.lib,
      s = e.state,
      t = e.t,
      W = L.W;
    const Bv = s.branch ?? 0.2,
      held = (s.pt_held ?? 0) > 0.5,
      C = s.cry ?? 0,
      D = s.danger ?? 0.4;
    const broke = Bv >= 0.85,
      sink = s.pt_sink ?? 0,
      x0 = s.pt_x ?? 5.3;
    if (held) return null;
    const tp = L.tip(Bv, t);
    // the current tugs her: a slow sway, now and then a dip
    const tug = 0.05 * Math.sin(t * 1.7) + 0.03 * Math.sin(t * 2.9 + 1),
      dip = Math.max(0, Math.sin(t * 1.3) - 0.7) * 0.25 * D;
    const x = x0 + tug;
    // the anchor is her pelvis (tread): the water up to her chest; sinking takes her under but for her hands
    const y = W + 0.1 + sink * 0.75 + dip + (broke ? 0.07 * Math.sin(t * 2.1) : 0);
    let hand, handW;
    if (broke) {
      // swept off: hands up out of the water, grabbing at nothing, out of time with each other
      const up = Math.max(0, Math.sin(t * 4.2)),
        up2 = Math.max(0, Math.sin(t * 3.7 + 2));
      hand = { r: [x + 0.25 + 0.1 * Math.sin(t * 4.2), W - 0.15 - 0.25 * up], l: [x - 0.3 + 0.1 * Math.sin(t * 3.7), W - 0.1 - 0.3 * up2] };
    } else {
      // both hands on the branch's tip; as she cries out the right one lets go and reaches out toward the far field
      hand = {
        l: [tp[0] - 0.02, tp[1] + 0.03],
        r: C > 0.02 ? [L.mix(tp[0] + 0.1, x + 0.75, C), L.mix(tp[1] + 0.05, y - 1.0, C)] : [tp[0] + 0.1, tp[1] + 0.05],
      };
    }
    const lookAt = [null, [-5, -1.6], [9, -3.5, 11], [x, 1.2]][s.pt_look ?? 0] || undefined;
    return {
      ...L.LIT,
      who: 'petra',
      id: 'petra',
      x,
      y,
      at: [x, 0],
      face: broke ? -20 : -20 + 25 * C,
      shadow: 0,
      still: true,
      underAlpha: 0.2,
      water: y - W,
      pose: { tread: 1, look_up: broke ? 0.6 : C },
      handShape: C > 0.3 && !broke ? { r: 'open' } : undefined,
      hand,
      handW,
      look: broke || C > 0.3 ? undefined : lookAt,
    };
  },
  // Petra on her feet beside him (after the swim): nearer the eye than he is, but his hand on her shoulder goes over her
  petra_held: (e) => {
    const L = e.lib,
      s = e.state,
      W = L.W;
    const x = (s.dv_a ?? -18.4) + 2.4;
    if (x < -15.5 || !((s.pt_held ?? 0) > 0.5 && !(L.clamp(s.dv_swim ?? 0) > 0.5) && !((s.dv_carry ?? 0) > 0.01))) return null;
    const ground = L.bed(x),
      sit = s.pt_sit ?? 0;
    const px = s.pt_wx ?? x + 0.5,
      pg = Math.min(L.bed(px), W + 0.5),
      hand = s.dv_hand ?? 0;
    const grip = [(x + px) / 2, Math.max(ground, pg) - 0.62]; // where their hands meet
    return {
      ...L.LIT,
      who: 'petra',
      id: 'petra',
      x: px,
      y: pg,
      at: [px, 0],
      face: s.pt_face ?? -90,
      view: 0.16,
      underAlpha: 0.2,
      water: Math.max(0, pg - W),
      groundAt: pg < W + 0.05 ? L.heightAt : undefined,
      style: sit < 0.5 ? 'sad' : undefined,
      pose: { sit_ground: sit, cry: s.pt_cry ?? 0 },
      hand: hand > 0.01 && sit < 0.5 ? { r: grip } : undefined,
      handW: { r: hand },
      look: (s.pt_cry ?? 0) > 0.5 ? undefined : [x, ground - 1.1],
    };
  },
  // David (dv_…; the element is painted at his across: bank's x = dv_a + 2.4); his hand to her far shoulder as he kneels
  // by her, then both arms under her, to lift her; carrying her (the module paints her between his body and his near arm)
  david: (e, got) => {
    const L = e.lib,
      s = e.state,
      t = e.t,
      W = L.W;
    const x = (s.dv_a ?? -18.4) + 2.4;
    if (x < -15.5) return null;
    const sw = L.clamp(s.dv_swim ?? 0),
      held = (s.pt_held ?? 0) > 0.5,
      af = s.after ?? 0,
      bond = s.bond ?? 0;
    const ground = L.bed(x),
      y = L.mix(ground, W + 0.18, sw); // swimming (the module's swim, grounded low): the lowest point just under the surface
    const v = e.speed('dv_a') ?? 0;
    const clinging = held && sw > 0.5,
      carrying = held && (s.dv_carry ?? 0) > 0.01;
    // Petra on her feet beside him (after the swim): on the bottom, but never deeper than her chest
    const px = s.pt_wx ?? x + 0.5,
      pg = Math.min(L.bed(px), W + 0.5),
      hand = s.dv_hand ?? 0;
    const grip = [(x + px) / 2, Math.max(ground, pg) - 0.62]; // where their hands meet
    const look =
      bond > 0.3 && af < 0.5
        ? [x + 6, -1.2, 11]
        : held && !clinging && !carrying
          ? [px, pg - 0.6]
          : (s.dv_look ?? 0) > 0.5 && !held
            ? [Math.max(s.pt_x ?? 5.3, x + 3), Math.max(W - 0.3, y - 0.9)]
            : undefined;
    const o = {
      ...L.LIT,
      who: 'david',
      id: 'david',
      x,
      y,
      at: [x, 0],
      face: s.dv_face ?? 90,
      view: 0.16,
      style: Math.abs(v) > 2 ? 'rushed' : undefined,
      underAlpha: 0.2,
      water: Math.max(0, y - W),
      groundAt: sw < 0.05 && ground < W + 0.05 ? L.heightAt : undefined, // on the clay; in the water the feet are hidden
      cycle: t * 0.9,
      pose: {
        wade: (s.dv_wade ?? 0) * (1 - sw) * (1 - hand),
        lunge: s.dv_lunge ?? 0,
        swim: sw,
        kneel1: s.dv_kneel ?? 0,
        hand_shoulder: s.dv_shoulder ?? 0,
        scoop: s.dv_scoop ?? 0,
        carry: s.dv_carry ?? 0,
      },
      look,
      lookSpeed: af > 0.5 ? 0.4 : 1,
    };
    if (held && !clinging && hand > 0.01) {
      o.hand = { l: grip };
      o.handW = { l: hand };
    }
    if (carrying) o.carry = { who: 'petra', id: 'petra' };
    const q = got?.petra_held;
    if (q) {
      const sc = s.dv_scoop ?? 0;
      if (sc > 0.01) {
        o.hand = { r: q.chest, l: q.back };
        o.handW = { r: sc, l: sc };
      } else if ((s.dv_shoulder ?? 0) > 0.01) {
        o.hand = { r: q.shoulder.l };
        o.handW = { r: s.dv_shoulder };
      }
    }
    return o;
  },
  // Petra clinging to him while he swims back: at his back, whichever way he swims, her hands on his shoulders
  petra_cling: (e, got) => {
    const L = e.lib,
      s = e.state,
      W = L.W;
    if (!((s.pt_held ?? 0) > 0.5 && L.clamp(s.dv_swim ?? 0) > 0.5) || (s.dv_a ?? -18.4) + 2.4 < -15.5) return null;
    const fd = ((s.dv_face ?? 90) * Math.PI) / 180,
      x = (s.dv_a ?? -18.4) + 2.4,
      qx = x - 0.4 * Math.sin(fd),
      qy = W + 0.3,
      me = got?.david;
    return {
      ...L.LIT,
      who: 'petra',
      id: 'petra',
      x: qx,
      y: qy,
      at: [qx, 0],
      face: (s.dv_face ?? 90) - 20,
      shadow: 0,
      still: true,
      underAlpha: 0.2,
      water: qy - W,
      pose: { tread: 1, cling: 1 },
      hand: me && { r: me.shoulder.r, l: me.shoulder.l },
    };
  },
};
const lib = {
  LIT, where, W, ys, bed, heightAt, tip, ROOT, top, ring, cry, splash, clamp, mix, span, people,
  beforeFrame: (f) => {
    const got = kit.chrysalids.move(people, { ...f, lib, kit, anim }),
      x = (f.state.dv_a ?? -18.4) + 2.4;
    // their heads: the rings', and where their lines go (David's element is painted at his across)
    where.petra = (got.petra_cling ?? got.david?.child ?? got.petra_held ?? got.petra)?.head ?? where.petra;
    where.david = got.david?.head ?? where.david;
    if (got.rosalind) f.at("far_people", got.rosalind.head[0], got.rosalind.head[1] - 0.3);
    if (got.petra) f.at("petra", got.petra.head[0], got.petra.head[1] - 0.2);
    if (got.david) f.at("david", got.david.head[0] - x, got.david.head[1] - 0.25);
  },
};
return lib;
