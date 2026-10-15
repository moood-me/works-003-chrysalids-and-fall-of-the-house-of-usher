// What the scene's elements share: colours, the light of the night, the fire and the grey morning, a row of the wheat,
// one of the congregation.
const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
const sm = (v) => {
  v = cl(v, 0, 1);
  return v * v * (3 - 2 * v);
};
const hx = (c) =>
  c[0] == "#"
    ? [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
    : c
        .slice(c.indexOf("(") + 1, -1)
        .split(",")
        .slice(0, 3)
        .map(Number);
const mixc = (a, b, t) => {
  const p = hx(a),
    q = hx(b);
  t = cl(t, 0, 1);
  return "rgb(" + p.map((v, i) => Math.round(v + (q[i] - v) * t)).join(",") + ")";
};
const mixh = (a, b, t) => {
  const p = hx(a),
    q = hx(b);
  t = cl(t, 0, 1);
  return "#" + p.map((v, i) => Math.round(v + (q[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
const rgba = (c, a) => {
  const p = hx(c);
  return "rgba(" + p[0] + "," + p[1] + "," + p[2] + "," + cl(a, 0, 1).toFixed(3) + ")";
};
// the fire starts at across X0 (on the edge of the field, 9.5 m) and spreads 50·ignite m; the ash follows, 60·ash m.
// Left of FIELD_L — the true wheat and the track: they never burn.
const X0 = 0.5,
  FIELD_L = -3.0;
// the light now: the dawn, the fire, the ash (the state), and what they make of a place and of a person
function now(e) {
  const S = e.state || {};
  const st = (k, d) => (typeof S[k] === "number" ? S[k] : d);
  const DAWN = st("dawn", 0),
    FIRE = st("fire", 0),
    IGN = st("ignite", 0),
    ASH = st("ash", 0);
  const litAt = (a, d) => (a < FIELD_L ? 0 : cl((IGN * 50 - Math.abs(a - X0) - (d - 9.5) * 0.9) / 1.2, 0, 1));
  const burntAt = (a, d) => (a < FIELD_L ? 0 : cl((ASH * 60 - Math.abs(a - X0) - (d - 9.5) * 0.9) / 3, 0, 1));
  // how much the fire lights the world
  const FL = FIRE * cl(IGN * 8, 0, 1) * (1 - 0.88 * sm(ASH * 1.05));
  // light on a person standing at (a, d): night silhouettes, the fire behind them, then the grey morning
  const litP = (a, d) => {
    const dir = (Math.atan2(-0.9, (3.5 - a) / 3) * 180) / Math.PI;
    return {
      light: 0.13 + 0.22 * DAWN + 0.05 * FL,
      dark: mixh("#17151c", "#2a2830", DAWN * 0.5),
      rim: mixh("#8c96b4", "#ffae6a", cl(FL * 1.4, 0, 1)),
      rimDir: FL > 0.05 ? dir : 200,
      rimWidth: 1.1 + 1.6 * FL,
      rimAlpha: 0.35 + 0.6 * Math.max(FL, 0.4 * (1 - DAWN)),
      tint: FL > 0.08 ? mixh("#c8c4d0", "#ffb37a", FL) : null,
    };
  };
  return { st, T: e.t, DAWN, FIRE, IGN, ASH, FL, litAt, burntAt, litP };
}
// a row of the wheat across the fields at distance RD (metres from the viewer)
function wheat(g, e, RD) {
  const { T, DAWN, FIRE, IGN, litAt, burntAt } = now(e);
  // one row of wheat across the fields at distance RD (metres from the viewer):
  // left of the track (a < -4) and beyond 30 m — true wheat, even and upright; right of the track, up to 30 m — the Offence:
  // stalks of all heights, too tall ones, ears too heavy that hang like hooks, forked ears. Then the fire in it, then ash.
  const HS = RD * 1.25 + 3,
    SP = 0.075 * Math.max(1, RD / 9.5) * (RD > 25 ? 1.3 : 1);
  const OFF = (a) => a > -2.95 && a < 30 && RD <= 30;
  const edge = (a) => cl((a + 2.95) / 0.7, 0, 1);
  const lit = (a) => (OFF(a) ? litAt(a, RD) * edge(a) : 0),
    brn = (a) => (OFF(a) ? burntAt(a, RD) : 0);
  const fireH = (a, ph) => {
    const l = lit(a);
    if (l <= 0) return 0;
    const b = brn(a);
    if (b >= 1) return 0;
    const n =
      0.5 +
      0.35 * Math.sin(a * 0.9 + T * 1.3 + ph) * Math.sin(a * 0.31 - T * 0.53) +
      0.25 * Math.sin(a * 2.1 - T * 2.7 + ph * 2) +
      0.6 * Math.pow(Math.max(0, Math.sin(a * 0.23 + RD + T * 0.15)), 3);
    return FIRE * l * (1 - b) * (0.9 + 2.4 * Math.max(0.05, n)) * (RD < 12 ? 1.2 : 1);
  };
  // flame tongues: many ragged teardrops rising from the burning line
  function tongues(scale, alphaK, c0, c1, c2, lighter) {
    if (!(FIRE > 0.01 && IGN > 0)) return;
    const st2 = 0.3 * Math.max(1, RD / 12);
    const top = 3.6 * scale;
    const gr = g.createLinearGradient(0, 0.1, 0, -top);
    gr.addColorStop(0, rgba(c0, alphaK));
    gr.addColorStop(0.3, rgba(c1, alphaK * 0.92));
    gr.addColorStop(0.62, rgba(c2, alphaK * 0.5));
    gr.addColorStop(1, rgba(c2, 0));
    g.fillStyle = gr;
    if (lighter) g.globalCompositeOperation = "lighter";
    g.beginPath();
    let any = false;
    for (let a = -3.0; a < Math.min(HS, 30); a += st2) {
      const k = Math.floor((a + 10) / st2);
      const ph = (k * 2.399) % 6.28;
      const h = Math.min(
        (RD < 10 ? 2.3 : RD < 16 ? 1.3 : 1.0) * scale,
        fireH(a, ph) * scale * (0.7 + 0.3 * Math.sin(T * (3 + (k % 5)) + ph)),
      );
      if (h < 0.08) continue;
      any = true;
      const w = st2 * (0.9 + 0.5 * Math.abs(Math.sin(k * 1.7))) + h * 0.1,
        lean = -0.15 * h + 0.3 * h * Math.sin(T * 2.1 + ph + k * 0.9) + 0.08 * h * Math.sin(T * 5.3 + k);
      g.moveTo(a - w, 0.1);
      g.bezierCurveTo(a - w * 1.3, -h * 0.45, a + lean * 0.2 - w * 0.2, -h * 0.75, a + lean, -h);
      g.bezierCurveTo(a + lean * 0.1 + w * 0.6, -h * 0.7, a + w * 1.3, -h * 0.4, a + w, 0.1);
      g.closePath();
    }
    if (any) g.fill();
    g.globalCompositeOperation = "source-over";
  }
  tongues(1.0, (0.5 + 0.45 * FIRE) * (RD < 12 ? 1 : 0.75), "#f8b860", "#e06a30", "#8a2a20", false);
  // the stalks
  const DW = DAWN * DAWN,
    wheatC = mixc("#211d18", "#9a8450", DW * 0.9),
    badC = mixc("#1f1c18", "#7a7652", DW * 0.9),
    trueC = mixc("#231e18", "#c4a462", DW);
  g.lineCap = "round";
  const N = Math.floor((2 * HS) / SP);
  const ear = (x, y, ang, L, W) => {
    g.save();
    g.translate(x, y);
    g.rotate(ang);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(W, -L * 0.25, W * 0.9, -L * 0.8, 0, -L);
    g.bezierCurveTo(-W * 0.9, -L * 0.8, -W, -L * 0.25, 0, 0);
    g.fill();
    g.restore();
  };
  for (let i = 0; i < N; i++) {
    const a = -HS + (i + e.rnd()) * SP;
    const r1 = e.rnd(),
      r2 = e.rnd(),
      r3 = e.rnd(),
      r4 = e.rnd();
    if (a > -4.05 && a < -2.95) continue;
    const sw = 0.06 * Math.sin(T * 0.7 + a * 0.5 + r3 * 2) + 0.03 * Math.sin(T * 1.7 + a * 1.3);
    if (!OFF(a)) {
      // true wheat: even, upright, full ears nodding the same way
      const h = 0.95 + 0.08 * r1;
      g.strokeStyle = trueC;
      g.fillStyle = trueC;
      g.lineWidth = 0.02 * (RD > 20 ? 1.6 : 1);
      const tx = a + sw * h,
        ty = -h;
      g.beginPath();
      g.moveTo(a, 0.05);
      g.quadraticCurveTo(a + sw * h * 0.3, -h * 0.5, tx, ty);
      g.stroke();
      ear(tx, ty, sw * 1.5 + 0.12, 0.11, 0.022 * (RD > 20 ? 1.5 : 1));
      continue;
    }
    const l = lit(a),
      b = brn(a);
    if (b > 0.8) {
      if (r2 < 0.2 && RD < 12) {
        g.strokeStyle = "#0d0a0a";
        g.lineWidth = 0.025;
        g.beginPath();
        g.moveTo(a, 0.03);
        g.lineTo(a + 0.02, -0.05 - 0.12 * r3);
        g.stroke();
      }
      continue;
    }
    const bad = r1 > 0.45,
      tall = r1 > 0.66,
      fork = r1 > 0.86 && r1 < 0.95,
      crook = r1 >= 0.95;
    let h = bad ? (tall ? 1.45 + r2 * 1.0 : 1.0 + r2 * 0.45) : 0.75 + r2 * 0.3;
    h *= 1 - 0.85 * b;
    const col = mixc(bad ? badC : wheatC, "#0a0707", cl(l * 1.6 + b, 0, 1));
    g.strokeStyle = col;
    g.fillStyle = col;
    const flk = l * (1 - b) * 0.05 * Math.sin(T * 7 + i);
    const curl = l * 1.0;
    g.lineWidth = (bad ? 0.026 + 0.02 * r2 : 0.02) * (RD > 20 ? 1.5 : 1);
    // the stalk: tall ones bow over at the top under their heads
    const bow = (tall ? 0.25 + 0.35 * r3 : bad ? 0.12 : 0.05) + curl * 0.3;
    const tx = a + (sw + flk) * h + bow * h * 0.25,
      ty = -h * (1 - bow * 0.08);
    g.beginPath();
    g.moveTo(a, 0.05);
    g.bezierCurveTo(a + (crook ? 0.12 : 0), -h * 0.45, a + (sw + flk) * h * 0.5, -h * 0.95, tx, ty);
    g.stroke();
    // ears: normal ones nod; bad ones hang heavy, some forked, some crooked to the ground
    if (!bad) ear(tx, ty, 0.35 + sw * 2 + curl, 0.1, 0.02);
    else {
      const L = tall ? 0.24 + r4 * 0.2 : 0.16 + r4 * 0.08,
        W = tall ? 0.05 + r4 * 0.025 : 0.035;
      const hang = 1.9 + r3 * 0.9 + curl * 0.6 + sw * 2;
      g.beginPath();
      g.moveTo(tx, ty);
      g.quadraticCurveTo(tx + 0.1, ty - 0.06, tx + 0.12, ty + 0.02);
      g.stroke();
      ear(tx + 0.12, ty + 0.02, hang, L, W);
      if (fork) ear(tx + 0.06, ty - 0.01, hang - 0.9, L * 0.8, W * 0.85);
      if (RD < 13) {
        g.lineWidth = 0.006;
        g.save();
        g.translate(tx + 0.12, ty + 0.02);
        g.rotate(hang);
        for (let j = 1; j < 6; j++) {
          g.beginPath();
          g.moveTo(0, (-L * j) / 6);
          g.lineTo(0.06 + 0.01 * j, (-L * j) / 6 - 0.05);
          g.moveTo(0, (-L * j) / 6);
          g.lineTo(-0.06 - 0.01 * j, (-L * j) / 6 - 0.05);
          g.stroke();
        }
        g.restore();
      }
    }
  }
  if (RD < 10) {
    // the one stalk the fire left standing at the field's edge, by the track
    const a = -2.72,
      h = 2.0,
      sw = 0.06 * Math.sin(T * 0.7 + 0.4) + 0.03 * Math.sin(T * 1.7 + 1.1);
    const col = mixc("#221d18", "#7a7454", DAWN * 0.85);
    g.strokeStyle = col;
    g.fillStyle = col;
    g.lineWidth = 0.04;
    const tx = a + sw * h + 0.22,
      ty = -h;
    g.beginPath();
    g.moveTo(a, 0.05);
    g.bezierCurveTo(a + 0.05, -h * 0.45, a + sw * h * 0.6, -h * 0.95, tx, ty);
    g.stroke();
    g.beginPath();
    g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + 0.12, ty - 0.07, tx + 0.15, ty + 0.03);
    g.stroke();
    ear(tx + 0.15, ty + 0.03, 2.35 + sw * 2, 0.42, 0.075);
    ear(tx + 0.07, ty, 1.45 + sw * 2, 0.32, 0.06);
    g.lineWidth = 0.008;
    g.save();
    g.translate(tx + 0.15, ty + 0.03);
    g.rotate(2.35 + sw * 2);
    for (let j = 1; j < 8; j++) {
      g.beginPath();
      g.moveTo(0, (-0.42 * j) / 8);
      g.lineTo(0.09, (-0.42 * j) / 8 - 0.06);
      g.moveTo(0, (-0.42 * j) / 8);
      g.lineTo(-0.09, (-0.42 * j) / 8 - 0.06);
      g.stroke();
    }
    g.restore();
  }
  tongues(0.6, 0.55 * FIRE, "#fff0c0", "#f8b060", "#e07040", true);
  if (FIRE > 0.01 && IGN > 0) {
    // low glow of the burning line and its light
    g.globalCompositeOperation = "lighter";
    const gl2 = g.createLinearGradient(0, 0.15, 0, -0.5);
    gl2.addColorStop(0, "rgba(255,170,90," + 0.4 * FIRE + ")");
    gl2.addColorStop(1, "rgba(200,80,40,0)");
    g.fillStyle = gl2;
    g.beginPath();
    g.moveTo(-3, 0.15);
    for (let a = -3; a < Math.min(HS, 30); a += 0.5) {
      g.lineTo(a, 0.15 - 0.65 * Math.min(1, fireH(a, 0)));
    }
    g.lineTo(Math.min(HS, 30), 0.15);
    g.closePath();
    g.fill();
    g.globalCompositeOperation = "source-over";
    if (RD < 15) {
      for (let a = -2; a < Math.min(HS, 30); a += 3) {
        const h = fireH(a, 0);
        if (h > 0.3) e.light(a, -h * 0.4, 4 + h, "#e08040", cl(0.07 * h, 0, 0.3));
      }
    }
  }
}
// the congregation: who each one is and where they stand (member)
const MEMBERS = {
  p0: { who: "man", seed: 3, at: [-5.0, 7.6], face: 140, turn: 0.85 },
  p1: { who: "woman", seed: 11, at: [-4.3, 7.0], face: 145, book: true, turn: 0.4 },
  p2: { who: "old_man", seed: 5, at: [-5.7, 6.4], face: 135, book: true },
  p3: { who: "woman", seed: 17, at: [-3.6, 6.6], face: 150, book: true, turn: 0.05 },
  p4: { who: "farmhand", seed: 23, at: [-4.8, 5.6], face: 140, turn: 0.7 },
  p5: { who: "old_woman", seed: 29, at: [-6.0, 4.8], face: 130, book: true },
  p6: { who: "girl", seed: 31, at: [-2.9, 7.7], face: 155, turn: 0.25 },
  p7: { who: "man", seed: 37, at: [3.4, 7.8], face: 212, book: true },
  p8: { who: "woman", seed: 41, at: [4.3, 7.1], face: 215, book: true, shade: true },
  p9: { who: "boy", seed: 43, at: [2.7, 6.8], face: 205, turn: 0.55 },
  p10: { who: "farmhand", seed: 47, at: [5.2, 6.2], face: 220 },
  p11: { who: "old_woman", seed: 53, at: [3.7, 5.5], face: 212, book: true },
  p12: { who: "man", seed: 59, at: [4.7, 4.8], face: 222, book: true },
};
// one of the congregation (the module's generic people, each different by seed), standing where the state says (<id>_a,
// _d, _f); kneels to pray (the recording), sings (from a hymnal held up — the scene's pose — or hands together),
// looks up, steps back from the heat — each a little late.
// turn: when `turned` (how much the people in front have noticed David not singing) passes it, this one turns its
// head round to him — each late in its own way — and sings less.
function member(e, id) {
  const { who, seed, at, face, book, shade, turn } = MEMBERS[id];
  const s = e.state,
    K = e.kit.chrysalids,
    a = s[id + "_a"] ?? at[0],
    d = s[id + "_d"] ?? at[1],
    f = s[id + "_f"] ?? face;
  const kneel = K.delayed(e, "kneel", id, 1.4) || 0,
    sing = K.delayed(e, "sing", id, 1.2),
    look = K.delayed(e, "look", id, 0.9),
    heat = K.delayed(e, "heat", id, 0.7);
  const tw = turn == null ? 0 : sm((K.delayed(e, "turned", id, 1.1) - turn) / 0.2);
  // turning round: the body comes round part of the way (the feet step), the head the rest
  let to = K.faceToward(a, d, s.dv_a ?? -1.05, s.dv_d ?? 4.55) - f;
  to = ((to + 540) % 360) - 180;
  const body = f + to * 0.65 * tw,
    song = sing * (1 - kneel) * (1 - 0.6 * tw);
  return {
    ...now(e).litP(a, d),
    who,
    id,
    seed,
    at: [a, d],
    face: body,
    inPlace: true,
    poses,
    pose: {
      pray_kneel: kneel,
      sing: book ? song : 0,
      pray: book ? 0 : song * 0.5,
      look_up: (look * 0.35 + (book ? 0 : sing * 0.35)) * (1 - tw),
      bow: 0.12 * (1 - sing) * (1 - look) * (1 - kneel) * (1 - (s.morning || 0)),
      shade: shade ? heat : 0,
    },
    hold: book && sing > 0.05 && kneel < 0.5 ? { r: "open_book" } : null,
    look: tw > 0.01 ? f + to - body : null,
    lookW: tw,
    lookSpeed: 0.45,
  };
}
// the scene's own pose (person({ poses })): singing a hymn from a book held up before the chest, the head lifted
const poses = {
  sing: { lean: -3, head: [-16, 0, 0], arm: { at: ["chest", 0.035, -0.13, 0.23], pole: [0.6, -1, 0] }, hand: "open" },
};
// The people as the state has them now — e: an element's, or beforeFrame's (with the lib, the kit, anim): moved once a frame
// (beforeFrame), painted by their elements from the very same (e.lib.people.<element>(e)). Strorm after the Inspector (his
// hand to the Inspector's); David after his mother (his hand in hers; hers goes where his was a frame before).
const people = {
  p0: (e) => member(e, "p0"),
  p1: (e) => member(e, "p1"),
  p2: (e) => member(e, "p2"),
  p3: (e) => member(e, "p3"),
  p4: (e) => member(e, "p4"),
  p5: (e) => member(e, "p5"),
  p6: (e) => member(e, "p6"),
  p7: (e) => member(e, "p7"),
  p8: (e) => member(e, "p8"),
  p9: (e) => member(e, "p9"),
  p10: (e) => member(e, "p10"),
  p11: (e) => member(e, "p11"),
  p12: (e) => member(e, "p12"),
  // the Inspector (the module's inspector): kneels at the field's edge and breaks off an ear, holds it to his lantern
  // before Strorm, nods twice, flings it back into the wheat; later lifts the lantern for the torch and leaves
  in: (e) => {
    const { litP } = e.lib.now(e);
    const A = e.anim,
      s = e.state;
    const a = s.in_a ?? 1.35,
      d = s.in_d ?? 7.0,
      f = s.in_f ?? 180,
      show = s.in_show || 0,
      lift = s.in_lift || 0,
      toss = s.in_toss || 0,
      gone = s.in_gone || 0;
    if (gone >= 1) return null;
    const fx = Math.sin((f * Math.PI) / 180);
    const hand = {},
      hw = {};
    // shown: the ear held up high, the lantern lifted under it, both before his face
    if (show > 0.01) {
      hand.r = [fx * 0.3, -1.86];
      hand.l = [fx * 0.34, -1.6];
      hw.r = show;
      hw.l = show;
    }
    if (lift > 0.01) {
      hand.l = [fx * 0.4, -1.32];
      hw.l = lift;
    }
    // the throw: the arm drawn back over the shoulder (toward us), then flung out and up over the wheat
    if (toss > 0 && toss < 1) {
      const back = A.ease.out(A.span(toss, 0, 0.42)),
        fling = A.ease.in(A.span(toss, 0.42, 0.62)),
        settle = A.span(toss, 0.7, 1);
      const p0 = [0.22, -1.62, 0],
        p1 = [0.3, -2.02, -0.4],
        p2 = [0.2, -1.95, 0.75];
      hand.r = toss < 0.42 ? p0.map((v, i) => A.mix(v, p1[i], back)) : p1.map((v, i) => A.mix(v, p2[i], fling));
      hw.r = 1 - settle;
    }
    return {
      ...litP(a, d),
      who: "inspector",
      id: "inspector",
      at: [a, d],
      face: f,
      mark: true,
      inPlace: true,
      pose: { kneel_reach: s.in_kneel || 0, nod: s.in_nod || 0, bow: 0.4 * (s.in_bow || 0) },
      cycles: { nod: s.in_nodc || 0 },
      hold: { l: "lantern" },
      glow: 0.9 * (1 - gone),
      hand,
      handW: hw,
    };
  },
  // Joseph Strorm (the module's joseph): the torch, unlit, then lit at the Inspector's lantern; his slow searching look
  jo: (e) => {
    const { litP } = e.lib.now(e);
    const s = e.state,
      K = e.kit.chrysalids,
      a = s.jo_a ?? -0.5,
      d = s.jo_d ?? 6.8,
      tip = s.jo_tip || 0,
      lw = s.jo_lookw || 0;
    return {
      ...litP(a, d),
      who: "joseph",
      id: "joseph",
      at: [a, d],
      face: s.jo_f ?? 180,
      mark: true,
      pose: { raise: s.jo_raise || 0, point_down: s.jo_down || 0, look_up: s.jo_up || 0, bow: s.jo_bow || 0 },
      hold: { r: "torch" },
      glow: s.jo_torch || 0,
      look: lw > 0.01 ? s.jo_look || 0 : null,
      lookW: lw,
      lookSpeed: 0.35,
      hand: tip > 0.01 ? { r: K.point("inspector", "hand_l") } : null,
      handW: { r: tip },
    };
  },
  // Emily, David's mother (the module's emily): kneels to pray (the recording), sings from the hymnal and does not look
  // down; holds David's hand; looks round at him (em_look), tugs (em_pull)
  em: (e) => {
    const { litP } = e.lib.now(e);
    const s = e.state,
      K = e.kit.chrysalids,
      a = s.em_a ?? -1.6,
      d = s.em_d ?? 4.95,
      h = s.hand ?? 1,
      lw = s.em_lookw || 0;
    const sing = K.delayed(e, "sing", "emily", 0.5),
      kneel = K.delayed(e, "kneel", "emily", 0.5) || 0,
      look = K.delayed(e, "look", "emily", 0.6);
    return {
      ...litP(a, d),
      who: "emily",
      id: "emily",
      at: [a, d],
      face: s.em_f ?? 150,
      mark: true,
      inPlace: true,
      poses: e.lib.poses,
      pose: {
        pray_kneel: kneel,
        sing: sing * (1 - kneel),
        look_up: look * 0.3,
        bow: 0.12 * (1 - sing) * (1 - look) * (1 - kneel) * (1 - (s.morning || 0)),
        pull: s.em_pull || 0,
      },
      hold: sing > 0.05 ? { l: "open_book" } : null,
      look: lw > 0.01 ? s.em_look || 0 : null,
      lookW: lw,
      lookSpeed: 0.6,
      hand: h > 0.01 ? { r: K.point("david", "hand_l") } : null,
      handW: { r: h * 0.85 },
    };
  },
  // David (the module's david, about ten): holds his mother's hand; kneels to pray (dv_kneel — when the game says);
  // sings with them (dv_sing: head up, a hand on his chest) — or meets his father's eyes (dv_atfa), goes still
  // (dv_freeze) and hides his face in her skirt (dv_hide); at the end looks at the one stalk left (dv_atst) and reaches
  // for it (dv_reach)
  dv: (e) => {
    const { litP } = e.lib.now(e);
    const s = e.state,
      K = e.kit.chrysalids,
      a = s.dv_a ?? -1.05,
      d = s.dv_d ?? 4.55,
      h = s.hand ?? 1,
      hide = s.dv_hide || 0,
      sing = s.dv_sing || 0;
    const look = K.delayed(e, "look", "david", 0.2);
    // what he looks at: his father, the stalk by the track — points in this element's metres (across, up, depth)
    const fa = s.dv_atfa || 0,
      stalk = s.dv_atst || 0;
    let lk = null,
      lw = 0;
    if (fa > 0.01) {
      lk = [(s.jo_a ?? -1) - a, -1.75, (s.jo_d ?? 7.6) - d];
      lw = fa;
    }
    if (stalk > 0.01) {
      lk = [-2.55 - a, -1.85, 9.5 - d];
      lw = stalk;
    }
    const hand =
      h > 0.01
        ? { l: K.point("emily", "hand_r") }
        : hide > 0.01
          ? { r: K.point("emily", "hip"), l: K.point("emily", "hip") }
          : null;
    return {
      ...litP(a, d),
      who: "david",
      id: "david",
      at: [a, d],
      face: s.dv_f ?? 150,
      mark: true,
      inPlace: true,
      pose: {
        pray_kneel: s.dv_kneel || 0,
        look_up: look * 0.45 + sing * 0.5,
        hand_chest: sing * 0.7,
        reach: s.dv_reach || 0,
        freeze: 0.55 * (s.dv_freeze || 0),
        hug: hide * 0.8,
        bow: hide * 0.15,
      },
      look: lk,
      lookW: lw,
      lookSpeed: 0.8,
      hand,
      handW: h > 0.01 ? { l: h * 0.85 } : { r: hide * 0.9, l: hide * 0.9 },
    };
  },
};
const lib = { cl, sm, mixc, rgba, mixh, X0, now, wheat, poses, people,
  beforeFrame: (f) => kit.chrysalids.move(people, { ...f, lib, kit, anim }) };
return lib;
