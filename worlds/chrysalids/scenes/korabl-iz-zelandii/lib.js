// lib of scene 68: body of function(anim, kit) — what the elements share
const { clamp, mix, span, hash, noise, drift } = anim;
const sm = anim.ease.smooth;
const V = (S, k, d) => (typeof S[k] === 'number' ? S[k] : d);
const hx = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const hexmix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(t, 0, 1)).toString(16).padStart(2, '0')).join(''); };
const DARK = '#18151d', SILK = '#cbc5d0', RIM = '#e9b9a6';
// how far the web has someone (0 free … 1 still): each person has their own moment (th)
const caught = (S, th) => clamp((V(S, 'web', 0) - th) / 0.3, 0, 1);
// the light on people: dawn grows
const lightOf = S => 0.1 + 0.3 * V(S, 'dawn', 0.5);

// threads wrapped round a figure: r — what kit.chrysalids.person returned
function cocoon(g, e, r, c, seed) {
  if (c < 0.01 || !r) return;
  const pts = [r.head, r.chest, r.hip, r.hand && r.hand.r, r.hand && r.hand.l, r.foot && r.foot.r, r.foot && r.foot.l].filter(Boolean);
  const H = r.height || 1.7;
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < 16; i++) {
    const a = pts[Math.floor(hash(i, seed) * pts.length)], b = pts[Math.floor(hash(i + 50, seed) * pts.length)];
    const k = clamp((c - hash(i, seed + 7) * 0.5) / 0.5, 0, 1); if (k <= 0) continue;
    const bow = (hash(i, seed + 3) - 0.5) * 0.5 * H;
    g.strokeStyle = 'rgba(246,240,244,' + (0.5 * k) + ')'; g.lineWidth = 0.008 * H;
    g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2 + bow, (a[1] + b[1]) / 2 + bow * 0.4, b[0], b[1]); g.stroke();
  }
  // threads down to the ground, glints
  for (let i = 0; i < 7; i++) {
    const a = pts[Math.floor(hash(i, seed + 11) * pts.length)], k = clamp((c - 0.3) / 0.7, 0, 1); if (k <= 0) break;
    const gx = a[0] + (hash(i, seed + 13) - 0.5) * 1.6;
    g.strokeStyle = 'rgba(240,234,240,' + (0.35 * k) + ')'; g.lineWidth = 0.006 * H;
    g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + gx) / 2, a[1] * 0.3, gx, 0.02); g.stroke();
    const tw = Math.max(0, Math.sin(e.t * (0.7 + hash(i, seed) * 0.8) + i * 2));
    g.fillStyle = 'rgba(255,248,240,' + (0.8 * k * tw) + ')'; g.beginPath(); g.arc(a[0], a[1], 0.012 * H, 0, 7); g.fill();
  }
  g.restore();
}

// one of the film's people (recordings in place: the script says where they are). Reads the state by the person's id:
//   <id>_a, <id>_d (where, m), <id>_f (facing, deg), <id>_p ('pose' or 'a,b'), <id>_w_<pose> (pose weights),
//   <id>_look (deg or another person's id), <id>_hr / <id>_hl ('who:point' — a hand to someone), <id>_hide (0…1 gone),
//   <id>_th (their own moment of the web, −1 none: overrides o.th and o.coatKey — raised past 1, the web lets them go),
//   <id>_still (1: lies still under the web, keeping the pose — no struggle), <id>_fire (a shot: 0→1, flash then smoke)
// CAST[id]: { who, th (moment the web takes them, or none), end (pose when still), coatKey (another key that wraps them),
//      gun ('r' | 'l': a long gun in that hand), hold, build… } → { o: its options for person, coat: how wrapped }, or null (gone)
function figure(e, id) {
  const S = e.state || {}, o = CAST[id];
  const a = V(S, id + '_a', 0), d = V(S, id + '_d', 10);
  let pose = {};
  const p = S[id + '_p'];
  if (typeof p === 'string' && p) for (const n of p.split(',')) pose[n] = 1;
  for (const k in S) if (k.startsWith(id + '_w_') && typeof S[k] === 'number') pose[k.slice(id.length + 3)] = S[k];
  // the web: struggle, then still
  let coat = 0, still = !!o.still;
  const own = V(S, id + '_th', -1) >= 0, th = own ? S[id + '_th'] : o.th;
  const quiet = V(S, id + '_dead', 0) > 0.5 || V(S, id + '_still', 0) > 0.5;
  if (quiet && th != null) { coat = sm(caught(S, th)); still = coat > 0.5; }
  else if (th != null) {
    const fr = caught(S, th);
    if (fr > 0) {
      const fl = sm(fr / 0.35) * (1 - sm((fr - 0.45) / 0.4));
      const n = noise(e.t * 1.7, o.seed || 3);
      pose = { ...pose };
      for (const k in pose) pose[k] *= 1 - sm(fr / 0.3);
      pose.scream = (pose.scream || 0) + fl * clamp(0.6 + n, 0, 1);
      pose.head_hands = (pose.head_hands || 0) + fl * clamp(0.5 - n, 0, 1);
      const endP = o.end || 'slump';
      for (const n2 of endP.split(',')) pose[n2] = (pose[n2] || 0) + sm((fr - 0.45) / 0.5);
      coat = sm((fr - 0.1) / 0.8);
      if (fr > 0.97) still = true;
    }
  }
  if (o.coatKey && !own) coat = Math.max(coat, sm(V(S, o.coatKey, 0)));
  const look = S[id + '_look'];
  let lk;
  if (typeof look === 'number') lk = look;
  else if (typeof look === 'string' && look) { const [w, pt] = look.split(':'); lk = kit.chrysalids.point(w, pt || 'head') || undefined; }
  const hand = {};
  for (const side of ['r', 'l']) { const h = S[id + '_h' + side]; if (typeof h === 'string' && h) { const [w, pt] = h.split(':'); const q = kit.chrysalids.point(w, pt || 'hand_l'); if (q) hand[side] = q; } }
  if (V(S, id + '_hide', 0) >= 0.999) return null;
  const light = mix(o.light ?? (lightOf(S) + (o.near ? 0.14 : 0)), 0.05, coat * 0.9);
  const shot = V(S, id + '_fire', 0);
  return { o: {
      who: o.who, id, t: e.t, at: [a, d], face: V(S, id + '_f', 90), pose, poses: POSES, look: lk, hand: Object.keys(hand).length ? hand : undefined,
      hold: o.gun ? { [o.gun]: 'gun' } : o.hold, fire: shot > 0 && shot < 0.12 ? 1 - shot / 0.12 : 0, smoke: shot > 0 && shot < 1 ? shot : 0, build: o.build, seed: o.seed, light, dark: hexmix(DARK, '#aaa4b2', coat * 0.8), rim: RIM, rimDir: 180, rimWidth: 1.4,
      idle: coat > 0.8 ? 0 : 1, inPlace: true, still, mark: !!o.mark, wind: 0.6, shadow: 0.35, gait: o.gait,
    }, coat };
}
// … painted, cocooned as the web has them (r: as person() returns it)
function actor(g, e, id) {
  const f = figure(e, id);
  if (!f) return null;
  const hide = V(e.state || {}, id + '_hide', 0);
  g.save();
  if (hide > 0) g.globalAlpha = 1 - hide;
  const r = kit.chrysalids.person(g, e, f.o);
  cocoon(g, e, r, f.coat, CAST[id].seed || 5);
  g.restore();
  return r;
}

// this film's own poses (given to the module's person as `poses`)
const POSES = {
  // spraying: the right arm forward and down, the can in the fist
  spray: { lean: 4, head: [12, 0, 0], armR: [62, 6, 6, 0], handR: 'fist' },
};

// the people, by their elements: who each is, what the web does to them (actor)
const CAST = {
  joseph: { gun: "l", who: "joseph", mark: true, th: 0.22 },
  sealand: { who: "sealand", mark: true, light: 0.85 },
  petra: { who: "petra", mark: true, coatKey: "cave_web", near: 1 },
  david: { who: "david_teen", mark: true, coatKey: "cave_web", near: 1 },
  rosalind: { who: "rosalind", mark: true, coatKey: "cave_web", near: 1 },
  michael: { who: "michael", mark: true, coatKey: "cave_web", near: 1 },
  w1: { gun: "r", who: "man", seed: 21, th: 0.3, end: "kneel,cower" },
  w2: { gun: "r", who: "farmhand", seed: 7, th: 0.12, end: "kneel,slump" },
  w3: { gun: "r", who: "man", seed: 33, th: 0.4, end: "lie_face" },
  spider: {
    who: "man",
    mark: true,
    th: 0.1,
    seed: 61,
    hold: { l: "bow" },
    build: {
      H: 2.06,
      heads: 7.9,
      legs: 0.585,
      girth: 0.72,
      posture: 9,
      wear: { top: "shirt", coat: 0, hat: 0, beard: "full", hair: "long", sleeves: "rolled" },
      col: { top: "#4b4136", bottom: "#352e28", hair: "#2a2420", skin: "#9c7a60" },
      gait: { energy: 0.9, swing: 1.3, stride: 1.25 },
    },
  },
  sophie: {
    who: "woman",
    mark: true,
    th: 0.08,
    seed: 44,
    build: {
      H: 1.58,
      wear: { hat: 0, apron: 0, shawl: 0, hair: "braid" },
      col: { top: "#7a4a38", skirt: "#7a4a38", hair: "#5a3824" },
    },
  },
  f2: {
    who: "farmhand",
    seed: 52,
    th: 0.34,
    end: "lie",
    hold: { l: "bow" },
    build: {
      posture: 22,
      wear: { hat: 0, coat: 0, beard: "full", hair: "long" },
      col: { top: "#5a4a3a", bottom: "#3a3028" },
    },
  },
  f3: {
    who: "man",
    seed: 77,
    th: 0.05,
    end: "kneel,slump",
    hold: { l: "bow" },
    build: { wear: { hat: 0, coat: 0, hair: "long" }, col: { top: "#4e4438" } },
  },
};
// The people as the state has them now — e: an element's, or beforeFrame's (with the lib, the kit, anim): moved once a frame
// (beforeFrame), painted by their elements from the very same (actor). Each after those whose points its hands and eyes
// go to as the film has it (Petra after the Sealand woman, David after Joseph and Petra, Rosalind and Michael after both,
// Sophie after the Spider).
const people = {
  horse: (e) => {
    const S = e.state || {},
      L = e.lib;
    return {
      horse: true,
      kind: "horse",
      id: "horse",
      t: e.t,
      at: [S.horse_a ?? -2.9, S.horse_d ?? 15.6],
      face: S.horse_f ?? 90,
      pose: { rear: S.horse_w_rear ?? 0, toss: 0.35 },
      light: L.lightOf(S),
      rim: L.RIM,
      rimDir: 180,
    };
  },
  joseph: (e) => figure(e, "joseph")?.o ?? null,
  sealand: (e) => figure(e, "sealand")?.o ?? null,
  petra: (e) => figure(e, "petra")?.o ?? null,
  david: (e) => figure(e, "david")?.o ?? null,
  rosalind: (e) => figure(e, "rosalind")?.o ?? null,
  michael: (e) => figure(e, "michael")?.o ?? null,
  w1: (e) => figure(e, "w1")?.o ?? null,
  w2: (e) => figure(e, "w2")?.o ?? null,
  w3: (e) => figure(e, "w3")?.o ?? null,
  spider: (e) => figure(e, "spider")?.o ?? null,
  sophie: (e) => figure(e, "sophie")?.o ?? null,
  f2: (e) => figure(e, "f2")?.o ?? null,
  f3: (e) => figure(e, "f3")?.o ?? null,
};
const lib = {
  V, sm, hexmix, caught, lightOf, cocoon, actor, DARK, SILK, RIM, CAST, people,
  beforeFrame: (f) => kit.chrysalids.move(people, { ...f, lib, kit, anim }),
};
return lib;
