// the ridge the track runs along (metres across at 9 m; y down): the hill and the shoulder paint the same crest
const cr = (x) => {
  let c = 1.2 + 0.12 * Math.sin(x * 0.31 + 0.6) + 0.06 * Math.sin(x * 0.77);
  if (x < -3) {
    const k = Math.min(1, (-3 - x) / 12),
      s = k * k * (3 - 2 * k);
    c = c * (1 - s) + (0.25 + 0.1 * Math.sin(x * 0.2)) * s;
  }
  if (x > 3.5) {
    const k = Math.min(1, (x - 3.5) / 9),
      s = k * k * (3 - 2 * k);
    c = c * (1 - s) + 0.2 * s;
  }
  return c;
};
// the track: along the crest; past x 2.2 it drops down the far side, behind the ridge's shoulder, into a
// hollow (x 4.4…12.5, 1.75 m under the crest: a great-horse's head and its riders' shoulders show above it),
// and past the hollow on down, out of sight
const ss = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const path = (x) => -cr(x) + (x > 2.2 ? 1.75 * ss((x - 2.2) / 2.2) : 0) + (x > 12.5 ? 0.6 * Math.pow(x - 12.5, 1.4) : 0);
// what has gone down the far side (right of x 2, below the crest) is not seen
const behindRidge = (g) => {
  g.beginPath();
  g.moveTo(-60, -40);
  g.lineTo(-60, 8);
  g.lineTo(2, 8);
  for (let x = 2; x <= 60; x += 0.25) g.lineTo(x, -cr(x) + 0.03);
  g.lineTo(60, -40);
  g.closePath();
  g.clip();
};
// the night's light on the figures: dark silhouettes, a cold rim from the dawn on the right
const night = { light: 0.3, dark: "#141a2a", rim: "#9aabc4", rimDir: -15, rimWidth: 1.3, view: 0.19, shadow: 0.25 };
const mix = (a, b, u) => a + (b - a) * u;
const lerp2 = (p, q, u) => [mix(p[0], q[0], u), mix(p[1], q[1], u)];
// everything but a great-horse's near pannier (mouth = the horse's returned basket; Hw its height): its wall in front
const outsideBasket = (g, mouth, Hw) => {
  const w = 0.2 * Hw + 0.06;
  g.beginPath();
  g.rect(-60, -40, 120, 50);
  g.rect(mouth[0] - w, mouth[1] - 0.01, 2 * w, 0.38 * Hw + 0.2);
  g.clip("evenodd");
};
const HW = 2.35, // the great-horse's height
  NEAR = 0.22; // Sheba and David stand a little nearer than the great-horses (lower on the slope)
// what the fugitives' state says: where the great-horses and Sheba are, how far David is down, Petra up and in, David over
function fugitive(e) {
  const s = e.state,
    v = (k, d) => (typeof s[k] === "number" ? s[k] : d);
  const gx = v("gx", 0.3),
    climb = v("david_climb", 0),
    pu = v("petra_up", 0);
  return {
    v, gx, gy: path(gx), shA: v("sheba_led", 0) ? gx - 7.9 : v("sheba_a", -13), // led: on a rope behind the pack horse
    down: v("david_down", 0), pu, climb, inFar: climb > 0.82, petraIn: pu >= 1,
    // the module puts everyone in a pannier at its middle: David (far) and Petra (near) are set beside Rosalind by hand
    floorFar: [gx - 0.12 * HW + 0.42, path(gx) - 0.8 * HW + 0.06],
  };
}
// Petra between Sheba's back and the pannier (its mouth: the great-horse's basket): lifted by David, taken by Rosalind,
// let down into the basket — where she is now, or null
function petraAt(e, basket) {
  const { pu, shA, gy } = fugitive(e),
    sm = anim.ease.smooth,
    span = anim.span;
  if (!(pu > 0 && pu < 1)) return null;
  const [bx, by] = basket;
  const SHp = [shA + 0.08 * 1.55, path(shA) + NEAR - 0.98 * 1.55]; // where she sat on Sheba
  const P1 = [bx - 0.42, gy + NEAR - 1.95],
    P2 = [bx - 0.02, by - 0.32],
    P3 = [bx + 0.24, by + 0.3];
  const p = pu < 0.45 ? lerp2(SHp, P1, sm(span(pu, 0, 0.45))) : pu < 0.78 ? lerp2(P1, P2, sm(span(pu, 0.45, 0.78))) : lerp2(P2, P3, sm(span(pu, 0.78, 1)));
  if (pu < 0.45) p[1] -= 0.18 * Math.sin(Math.PI * span(pu, 0, 0.45));
  return p;
}
const people = {
  // the pack great-horse, tied behind
  pack: (e) => {
    const { v, gx } = fugitive(e),
      px = gx - 4.7;
    return { ...night, horse: true, id: "pack", kind: "great", x: px, y: path(px), at: [px, 0], face: 90, pack: true, pose: { rest: v("pack_rest", 1), graze: v("pack_graze", 0), toss: v("pack_toss", 0) } };
  },
  // David in the far pannier, once over the great-horse's back
  david_far: (e) => {
    const { v, inFar, floorFar } = fugitive(e);
    return inFar ? { ...night, who: "david_teen", id: "david", x: floorFar[0], y: floorFar[1], at: [floorFar[0], 0], still: true, face: v("david_far_face", 90), hold: { l: "bow" }, look: v("david_look", null) ?? undefined } : null;
  },
  // the great-horse, Rosalind's father's: Rosalind kneels up in the near pannier (her bow across it, then in her hand),
  // reaching for Petra, for David
  great: (e) => {
    const { v, gx, gy } = fugitive(e),
      K = kit.chrysalids;
    const rp = v("ros_reach_p", 0),
      rd = v("ros_reach_d", 0),
      bow = v("ros_bow", 0),
      reach = Math.max(rp, rd);
    const tP = K.point("petra", "chest"),
      tD = K.point("david", "hand_l");
    const rHand = {},
      rW = {};
    if (rp > 0.02 && tP) { rHand.r = tP; rHand.l = tP; rW.r = rp; rW.l = rp; }
    else if (rd > 0.02 && tD) { rHand.r = tD; rW.r = rd; }
    const riders = [
      { who: "rosalind", id: "rosalind", basket: "near", face: v("ros_face", -90), pose: { reach, bow: 0.3 * reach, draw_bow: v("ros_draw", 0) }, hand: rHand, handW: rW, hold: bow > 0.5 ? { l: "bow" } : {}, look: v("ros_look", null) ?? undefined, mark: true },
    ];
    return { ...night, horse: true, el: "fugitives", id: "great", kind: "great", x: gx, y: gy, at: [gx, 0], face: 90, pack: true, pose: { toss: v("great_toss", 0) }, rider: riders };
  },
  // Petra in the near pannier beside Rosalind, once let down into it
  petra_in: (e, got) => {
    const { v, petraIn } = fugitive(e),
      [bx, by] = got?.great?.basket ?? [0, 0];
    if (!petraIn) return null;
    const pk = v("petra_peek", 0);
    return { ...night, who: "petra", id: "petra", x: bx + 0.24, y: by + 0.52, at: [bx + 0.24, 0], still: true, face: v("petra_face", 90), pose: { kneel: pk, sit_ground: 1 - pk }, look: v("petra_look", null) ?? undefined };
  },
  // Sheba, David's mare: Petra in front, David behind (or David alone, Petra waiting in the pannier); then nobody
  sheba: (e) => {
    const { v, shA, down, pu } = fugitive(e);
    const shRiders = [];
    if (pu <= 0) shRiders.push({ who: "petra", id: "petra", look: v("petra_look", null) ?? undefined });
    if (down <= 0) shRiders.push({ who: "david_teen", id: "david" });
    return { ...night, horse: true, id: "sheba", kind: "horse", x: shA, y: path(shA) + NEAR, at: [shA, 0.3], face: v("sheba_face", 90), rider: shRiders.length ? shRiders : null, pose: { rear: v("sheba_rear", 0), toss: v("sheba_toss", 0) }, col: { coat: "#2c241f" } };
  },
  // David on his feet: sliding down from Sheba, lifting Petra, a hand on Sheba's neck, the slap, watching her go, climbing
  // the great-horse
  david: (e, got) => {
    const { v, gx, gy, shA, down, pu, climb, inFar, floorFar } = fugitive(e),
      K = kit.chrysalids,
      A = anim,
      sm = A.ease.smooth,
      span = A.span,
      SH = got?.sheba,
      PK = got?.pack;
    if (!(down > 0 && !inFar)) return null;
    const da = v("david_a", -1),
      dy = path(da) + NEAR;
    let x = da,
      y = dy,
      pose = {},
      still = false;
    const hnd = {},
      hw = {};
    if (down < 1) {
      // off Sheba's back: the seat lets go, the feet find the ground, the knees take the weight
      const u = down,
        from = [shA + (pu >= 1 ? 0.08 : -0.42) * 1.55, path(shA) + NEAR - 0.99 * 1.55]; // the saddle, riding alone; else behind Petra
      x = mix(from[0], da, sm(u));
      y = mix(from[1], dy, A.ease.in(u)) - 0.12 * Math.sin(Math.PI * Math.min(1, u * 1.6));
      pose.ride = 1 - span(u, 0.05, 0.9);
      pose.crouch = 0.55 * Math.sin(Math.PI * span(u, 0.7, 1));
      still = true;
    }
    const lift = v("david_lift", 0),
      pat = v("david_pat", 0),
      raise = v("david_raise", 0),
      slap = v("david_slap", 0),
      slump = v("david_slump", 0),
      tie = v("david_tie", 0);
    if (lift > 0) { pose.lift = lift; const t = K.point("petra", "chest"); if (t) { hnd.r = t; hnd.l = t; hw.r = lift; hw.l = lift; } }
    if (pat > 0 && SH) { hnd.l = [SH.head[0] + 0.35 * Math.sign(v("sheba_face", 90)) * -1, SH.head[1] + 0.35 + 0.03 * Math.sin(e.t * 3)]; hw.l = pat; }
    if (raise > 0) pose.raise = raise * (1 - slap);
    if (slap > 0 && SH) { hnd.r = [SH.rump[0] + 0.05, SH.rump[1] + 0.08]; hw.r = slap; }
    if (slump > 0) pose.slump = slump;
    // tying Sheba's rein to the pack horse's crupper
    if (tie > 0 && PK) { hnd.l = [PK.rump[0] - 0.1, PK.rump[1] + 0.25]; hw.l = tie; }
    if (climb > 0) {
      // up the near flank behind the pannier, over the croup, down into the far pannier
      const c = climb,
        F0 = [gx - 1.2, gy + NEAR - 0.95],
        F1 = [gx - 1.0, gy - 0.9 * HW - 0.1],
        F2 = [floorFar[0], floorFar[1] - 0.85];
      x = mix(da, F0[0], sm(span(c, 0, 0.15)));
      y = mix(dy, F0[1], sm(span(c, 0, 0.15)));
      if (c > 0.15) { x = mix(F0[0], F1[0], sm(span(c, 0.15, 0.6))); y = mix(F0[1], F1[1], sm(span(c, 0.15, 0.6))); }
      if (c > 0.6) { x = mix(F1[0], F2[0], sm(span(c, 0.6, 0.82))); y = mix(F1[1], F2[1], sm(span(c, 0.6, 0.82))) - 0.15 * Math.sin(Math.PI * span(c, 0.6, 0.82)); }
      pose = { climb: Math.min(1, c * 5) * (1 - span(c, 0.55, 0.7)), ride: span(c, 0.55, 0.75) };
      still = true;
      // his hands on the croup, then Rosalind's hand
      const croup = [gx - 1.05, gy - 0.9 * HW];
      hnd.r = croup; hw.r = Math.sin(Math.PI * span(c, 0.1, 0.65));
      const tR = K.point("rosalind", "hand_r");
      if (tR && c < 0.7) { hnd.l = tR; hw.l = Math.sin(Math.PI * span(c, 0.15, 0.7)); }
    }
    return { ...night, el: "fugitives", who: "david_teen", id: "david", x, y, at: [x, NEAR], still, face: v("david_face", 90), pose, hand: hnd, handW: hw, look: v("david_look", null) ?? undefined, cycle: climb * 7, mark: true };
  },
  // Petra on her way from Sheba's back to the pannier
  petra: (e, got) => {
    const p = got?.great && petraAt(e, got.great.basket);
    return p ? { ...night, who: "petra", id: "petra", x: p[0], y: p[1], at: [p[0], 0], still: true, face: 90, pose: fugitive(e).pu < 0.8 ? "held_up" : "carried" } : null;
  },
  // the search from Waknuk: two riders with lanterns up the track (searchers.js) — the second, the first; and the first
  // thrown off: search_look — the first raises his lantern, both peer about; lamp / lamp_x — he holds it toward that place
  // of the hollow; search_point — he points there. search_rear — his horse shies; fallen 0…1 — he is hit (jerked back in
  // the saddle), thrown off it backwards and falls onto his back (the kit's recorded fall_back) by his lantern at fallen_a
  searchers: (e) => {
    const s = e.state,
      A = anim,
      span = A.span,
      sm = A.ease.smooth;
    const v = (k, d) => (typeof s[k] === "number" ? s[k] : d);
    const a = v("search_a", -20),
      a2 = v("search2_a", a - 3.4),
      look = v("search_look", 0),
      lamp = v("lamp", 0),
      fall = v("fallen", 0);
    const warm = { ...night, light: 0.12, rim: "#e8b070", rimDir: -60 };
    // where the first one looks: about the plain, or at his lamp's place in the hollow
    const lampAt = [v("lamp_x", 6), path(v("lamp_x", 6)) - 1.6];
    const riders = [
      { x: a2, id: "searcher2", seed: 41, k: 0.3, face: v("search2_face", 90), speed: e.speed("search2_a") },
      { x: a, id: "searcher1", seed: 17, k: 1, face: v("search_face", 90), speed: e.speed("search_a") },
    ].map((r) => {
      const lk = look * r.k,
        first = r.k === 1;
      const thrown = first && fall > 0.14;
      return {
        ...warm,
        horse: true,
        id: r.id + ":horse",
        kind: "horse",
        x: r.x,
        y: path(r.x),
        at: [r.x, 0],
        face: r.face,
        pose: { toss: 0.4 * lk + (thrown ? 0.8 * Math.sin(Math.PI * span(fall, 0.1, 0.6)) : 0), rest: 1 - Math.min(1, Math.abs(r.speed) * 2), rear: first ? v("search_rear", 0) : 0 },
        rider: thrown
          ? null
          : {
              who: "man",
              id: r.id,
              seed: r.seed,
              hold: { r: "lantern" },
              pose: { ride: 1, raise: lk * (1 - span(fall, 0, 0.14)), "point:l": first ? v("search_point", 0) : 0, hit: first ? span(fall, 0, 0.06) : 0 },
              look: first && lamp > 0.05 ? lampAt : lk > 0.3 ? 70 + 40 * Math.sin(e.t * 0.5 + r.seed) : undefined,
              glow: 0.9,
              mark: first,
            },
        col: { coat: first ? "#2a231e" : "#221d1a" },
      };
    });
    if (!(fall > 0.14)) return riders;
    // the first one, thrown: off the horse's near side, his feet coming down to the crest behind it, and the recorded fall
    // onto his back takes him down — over the croup: from the saddle's height down to the crest while the recording
    // staggers him back
    const fx = v("fallen_a", a),
      gy = path(fx),
      u = span(fall, 0.14, 0.5);
    const x = fx - 0.45 - 0.7 * sm(u),
      y = gy - 0.95 * (1 - A.ease.in(u));
    return [...riders, { ...warm, who: "man", id: "searcher1", seed: 17, x, y, at: [x, 0], still: true, inPlace: true, face: 90, pose: { fall_back: 1 }, shadow: 0.25 * u }];
  },
};
const lib = {
  cr, path, behindRidge, outsideBasket, night, mix, lerp2, HW, fugitive, petraAt, people,
  beforeFrame: (f) => kit.chrysalids.move(people, { ...f, lib, kit, anim }),
};
return lib;
