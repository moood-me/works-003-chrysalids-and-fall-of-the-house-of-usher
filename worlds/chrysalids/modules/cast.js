// The people of «Хризалиды» as people in a scene (the engine's people.js: an element with "person"): who they are —
// figures of shapes in this world's style, plain flat colours softly shaded, as the world paints them — and how they
// move: the motions in cast.data.json (Kimodo's, put there with put_motion). cast.md says who is who and what each
// motion is. (Horses are the chrysalids module's — the engine moves no horses; their riders are people of this cast, on
// the horse's saddle.)
const LINEN = [0.74, 0.69, 0.6, 1], BLOOD = [0.42, 0.13, 0.1, 1], COVER = [0.36, 0.17, 0.1, 1], PAGES = [0.8, 0.75, 0.63, 1];
// a rag round the right hand: wound round the palm; loose — an end hanging and swinging, the blood come through
function rag(F, loose) {
  const { add, mul } = MooodShapes.V, m = F.fit.h, h = F.P('RightHand'), ax = [F.side('RightHand'), F.up('RightHand'), F.fwd('RightHand')];
  const c = add(h, mul(ax[2], 0.045 * m));
  F.ball(c, ax, [0.05 * m, 0.04 * m, 0.058 * m], LINEN, 12);
  if (!loose) return;
  F.ball(add(c, mul(ax[1], 0.022 * m)), ax, [0.026 * m, 0.022 * m, 0.03 * m], BLOOD, 8);
  const end = F.swing('rag', add(c, [0, -0.17 * m, 0]), 110);
  F.tube([c, end], [[0, 0.016 * m], [1, 0.012 * m]], [[0, LINEN]], 6, ax[0], 0.35);
}
// an open book, its middle at `at(V)`, its spine across `along(V)` (else level across the reader), its pages to the reader's eyes
function openBook(F, at, along) {
  const V = MooodShapes.V, m = F.fit.h, c = at(V), head = F.P('Head');
  const n = V.unit(V.sub(head, c));
  const x0 = along ? along(V) : V.unit(V.cross([0, 1, 0], n));
  const x = V.unit(V.sub(x0, V.mul(n, V.dot(x0, n)))), y = V.cross(n, x);
  F.ball(V.add(c, V.mul(n, -0.01 * m)), [x, y, n], [0.19 * m, 0.135 * m, 0.014 * m], COVER, 8, 10);
  for (const s of [-1, 1]) F.ball(V.add(V.add(c, V.mul(x, s * 0.09 * m)), V.mul(n, 0.005 * m)), [x, y, n], [0.088 * m, 0.125 * m, 0.009 * m], PAGES, 8, 10);
}
return {
  ...data,
  // `carry` — holding a child at the chest, standing: the recording of carry_stand under the name the scenes use (`scoop`
  // ends in it)
  motions: { ...data.motions, carry: data.motions.carry_stand },
  characters: {
    // David, ~10: a blue shirt, brown trousers, short dark hair, bare-headed
    david: { kind: 'shapes', style: 'chrysalids', who: 'child', garment: 'none', hair: 'short',
      body: { height: 0.78, head: 1.04, thick: 0.86 },
      colors: { skin: '#b88d6e', hair: '#4a3222', top: '#4f6a8a', bottom: '#4d4337', shoes: '#2b2420' } },
    // Sophie Wender, ~10: a rust-red dress to below the knee, a braid, pale stockings and laced shoes
    sophie: { kind: 'shapes', style: 'chrysalids', who: 'child', garment: 'dress', hair: 'ponytail', socks: true,
      body: { height: 0.76, head: 1.04, shoulders: 0.92, thick: 0.82 },
      colors: { skin: '#c49a7c', hair: '#6a4026', top: '#8c4130', garment: '#8c4130', socks: '#cdbfae', shoes: '#3a2a22' } },
    // Mrs Wender, her mother: a plain brown dress to the ground, her hair in a bun
    wender: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'dress', hair: 'bun',
      body: { height: 0.92, thick: 0.98 },
      colors: { skin: '#b88d6e', hair: '#4a3a2c', top: '#5a4a3a', garment: '#5a4a3a', shoes: '#2a221c' } },
    // Uncle Axel, the smith: an old sailor, broad and heavy, a grey beard, a cap, a leather apron over a grey shirt, the
    // sleeves rolled up; a stiff right leg — he limps (his gait: limp)
    axel: { kind: 'shapes', style: 'chrysalids', who: 'smith', garment: 'smith_apron', hair: 'short', hat: 'cap', parts: ['beard'],
      body: { height: 1.0, shoulders: 1.2, thick: 1.45 },
      colors: { skin: '#b07f62', hair: '#8c8578', top: '#6c665c', bottom: '#3c3832', garment: '#5c4130', hat: '#3a3530', shoes: '#2a2420' } },
    // David at 14–16: nearly grown, a dark blue jacket over the shirt
    david_teen: { kind: 'shapes', style: 'chrysalids', who: 'teen', garment: 'jacket', hair: 'short',
      body: { height: 0.97, thick: 0.88 },
      colors: { skin: '#b88d6e', hair: '#4a3222', top: '#4f6a8a', garment: '#3f5470', bottom: '#463e34', shoes: '#2b2420' } },
    // Joseph Strorm, his father: tall, stern, upright; a long black coat, a full dark beard; bare-headed in the house (out
    // of doors his wide-brimmed hat: wear {hat: 'hat'})
    joseph: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'longcoat', hair: 'short', parts: ['beard'],
      body: { height: 1.08, shoulders: 1.04, thick: 1.0 },
      colors: { skin: '#b88d6e', hair: '#2a2420', top: '#24232a', garment: '#24232a', bottom: '#222026', shoes: '#1c1b1f', hat: '#1c1b1f' } },
    // the inspector: a lean man from the government in a grey frock coat to the knee, a starched collar, spectacles (out of
    // doors his hat: wear {hat: 'hat'})
    inspector: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'longcoat', hair: 'short', face: 'spectacles',
      body: { height: 1.03, shoulders: 0.98, thick: 0.92 },
      colors: { skin: '#c09a7e', hair: '#5a5048', top: '#3c3a3e', garment: '#3c3a3e', bottom: '#2c2a2e', shoes: '#1d1b1e', hat: '#232126', accent: '#d8d2c4' } },
    // Emily Strorm, his mother: a dark dress to the ground, a pale apron, a white bonnet over her bun
    emily: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'apron_dress', hair: 'bun', hat: 'bonnet',
      body: { height: 0.94, thick: 0.95 },
      colors: { skin: '#b88d6e', hair: '#4a3a2c', top: '#3f3a42', garment: '#3f3a42', accent: '#b9b2a2', hat: '#cfc8b8', shoes: '#2a221c' } },
    // Mary, his older sister: a grey-blue dress, an apron, a kerchief
    mary: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'apron_dress', hair: 'bun', hat: 'kerchief',
      body: { height: 0.93, thick: 0.92 },
      colors: { skin: '#b88d6e', hair: '#5a4030', top: '#4d5664', garment: '#4d5664', accent: '#b5ae9e', hat: '#8a8170', shoes: '#2a221c' } },
    // the farmhand: a broad man in a fawn smock, the sleeves rolled; bare-headed in the house (out of doors his brimmed hat:
    // wear {hat: 'hat'})
    farmhand: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'tunic', hair: 'short',
      body: { height: 1.0, thick: 1.05 },
      colors: { skin: '#b88d6e', hair: '#3b2c22', top: '#857c66', bottom: '#433d33', shoes: '#262220' } },
    // a man of Waknuk: a dark jacket, a hat
    villager: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'jacket', hair: 'short', hat: 'hat',
      body: { height: 0.98, thick: 1.0 },
      colors: { skin: '#b08a70', hair: '#3a2a20', top: '#4a463e', bottom: '#3a362f', garment: '#4a463e', hat: '#2c2824', shoes: '#221e1a' } },
    // a rider of the community: a dark riding coat to the knee, a brimmed hat, boots
    rider: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'longcoat', hair: 'short', hat: 'hat',
      body: { height: 1.0, thick: 1.02 },
      colors: { skin: '#a98468', hair: '#2e241c', top: '#2f2b28', bottom: '#2a2622', garment: '#33302c', hat: '#1f1c19', shoes: '#1b1815' } },
    // Rosalind, ~16 (III–VII): tall, slender, long dark-auburn hair, a plain grey-green dress to the ankles; her bow a part
    // (`bow`, in the left hand) where she has it
    rosalind: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'dress', hair: 'long',
      body: { height: 0.97, shoulders: 0.88, hips: 1.0, thick: 0.84 },
      colors: { skin: '#c49a7c', hair: '#5e3424', top: '#5b6152', garment: '#5b6152', shoes: '#2e2620' } },
    // Petra, ~6: small, fair hair, a grey dress, a plum shawl over the shoulders (the accent — `shawl_dress`)
    petra: { kind: 'shapes', style: 'chrysalids', who: 'child', garment: 'shawl_dress', hair: 'bob',
      body: { height: 0.62, head: 1.12, thick: 0.86 },
      colors: { skin: '#cfa889', hair: '#d2b26e', top: '#7b4766', garment: '#6b675e', shoes: '#3a2e26' } },
    // Michael, ~15: a dark jacket, a cap
    michael: { kind: 'shapes', style: 'chrysalids', who: 'teen', garment: 'jacket', hair: 'short', hat: 'cap',
      body: { height: 0.98, thick: 0.9 },
      colors: { skin: '#b88d6e', hair: '#3a2a20', top: '#5e5a4c', garment: '#4e4a3c', bottom: '#3e3a32', hat: '#3a3630', shoes: '#2a2420' } },
    // the woman from Sealand: tall, upright, a close pale suit, short pale hair
    sealand: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'none', hair: 'short',
      body: { height: 0.99, shoulders: 0.92, hips: 0.98, thick: 0.82 },
      colors: { skin: '#d0b098', hair: '#d9c9a0', top: '#e9e8e2', bottom: '#e2e1da', shoes: '#d0cec6' } },
    // Sophie grown (with the Fringes people): a worn dark jacket, trousers, her hair tied back, a rust kerchief at the
    // neck (her accent, as her dress was)
    sophie_adult: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'jacket', hair: 'ponytail', scarf: true,
      body: { height: 0.93, shoulders: 0.9, thick: 0.86 },
      colors: { skin: '#b88d6e', hair: '#6a4026', top: '#5a4d3e', garment: '#4a3d30', bottom: '#3a332a', accent: '#8c4130', shoes: '#2a221c' } },
    // the Spider-man of the Fringes: very tall, the arms far too long, a ragged dark coat, long grey hair, a beard
    spider: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'coat', hair: 'long', parts: ['beard'],
      body: { height: 1.14, arms: 1.32, shoulders: 1.0, thick: 0.78 },
      colors: { skin: '#a68068', hair: '#7a7268', top: '#3e3a32', garment: '#36322c', bottom: '#2e2a24', shoes: '#211d19' } },
    // the Fringes' people: worn, patched, odd — a guard with a spear (`spear`), a hunchback, a man and a woman
    guard: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'tunic', hair: 'short', parts: ['spear'],
      body: { height: 1.02, shoulders: 1.1, thick: 1.05 },
      colors: { skin: '#a07a60', hair: '#2e241c', top: '#5a5040', bottom: '#3a3428', shoes: '#241f1a' } },
    hunchback: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'tunic', hair: 'short', parts: ['hump'],
      body: { height: 0.86, shoulders: 1.06, legs: 0.9, thick: 1.0 },
      colors: { skin: '#a88468', hair: '#4a3a2c', top: '#6a5a44', bottom: '#40382c', shoes: '#28221c' } },
    fringe_man: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'coat', hair: 'short', hat: 'cap',
      body: { height: 0.98, thick: 0.94, arms: 1.08 },
      colors: { skin: '#a98468', hair: '#3a2a20', top: '#4e4636', garment: '#544a38', bottom: '#38322a', hat: '#3a3226', shoes: '#241f1a' } },
    fringe_woman: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'dress', hair: 'straight',
      body: { height: 0.92, thick: 0.9 },
      colors: { skin: '#b08a70', hair: '#3a2c22', top: '#5a5246', garment: '#5a5246', shoes: '#28221c' } },
    // the community of Waknuk: men, women, children, the old — each in their own colours (a crowd of them is never one
    // person ten times)
    man_a: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'jacket', hair: 'short', hat: 'hat',
      body: { height: 1.01, thick: 1.04 },
      colors: { skin: '#b08a70', hair: '#3a2a20', top: '#5a5548', garment: '#4a463e', bottom: '#3a362f', hat: '#2c2824', shoes: '#221e1a' } },
    man_b: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'longcoat', hair: 'short', hat: 'hat', parts: ['beard'],
      body: { height: 0.97, thick: 1.12 },
      colors: { skin: '#a98468', hair: '#4a3a2c', top: '#3e4248', garment: '#3e4248', bottom: '#2e3034', hat: '#3a342c', shoes: '#1f1c19' } },
    man_c: { kind: 'shapes', style: 'chrysalids', who: 'man', garment: 'tunic', hair: 'short', hat: 'cap',
      body: { height: 0.95, thick: 0.92 },
      colors: { skin: '#b88d6e', hair: '#5a4030', top: '#6b6150', bottom: '#45403a', hat: '#4a4234', shoes: '#262220' } },
    woman_a: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'apron_dress', hair: 'bun', hat: 'bonnet',
      body: { height: 0.92, thick: 0.95 },
      colors: { skin: '#b88d6e', hair: '#4a3a2c', top: '#47434a', garment: '#47434a', accent: '#aaa292', hat: '#c6bfae', shoes: '#2a221c' } },
    woman_b: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'dress', hair: 'bun', hat: 'kerchief',
      body: { height: 0.9, thick: 1.0 },
      colors: { skin: '#c09a7e', hair: '#5a4030', top: '#4d5260', garment: '#4d5260', hat: '#8a8170', shoes: '#2a221c' } },
    woman_c: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'apron_dress', hair: 'bun', hat: 'kerchief',
      body: { height: 0.94, thick: 0.9 },
      colors: { skin: '#b08a70', hair: '#3b2c22', top: '#504840', garment: '#504840', accent: '#b0a58e', hat: '#9a9078', shoes: '#28221c' } },
    boy: { kind: 'shapes', style: 'chrysalids', who: 'child', garment: 'none', hair: 'short', hat: 'cap',
      body: { height: 0.77, head: 1.04, thick: 0.86 },
      colors: { skin: '#b88d6e', hair: '#5a4030', top: '#6a6252', bottom: '#433c33', hat: '#4a4234', shoes: '#2b2420' } },
    girl: { kind: 'shapes', style: 'chrysalids', who: 'child', garment: 'dress', hair: 'ponytail', hat: 'kerchief',
      body: { height: 0.74, head: 1.04, thick: 0.84 },
      colors: { skin: '#c49a7c', hair: '#8a6a3c', top: '#5c5a52', garment: '#5c5a52', hat: '#9a9078', shoes: '#3a2a22' } },
    old_man: { kind: 'shapes', style: 'chrysalids', who: 'old', garment: 'longcoat', hair: 'short', hat: 'hat', parts: ['beard'],
      body: { height: 0.95, thick: 0.95 },
      colors: { skin: '#b08a70', hair: '#9a948a', top: '#3e3a34', garment: '#3e3a34', bottom: '#33302a', hat: '#2c2824', shoes: '#211d19' } },
    old_woman: { kind: 'shapes', style: 'chrysalids', who: 'woman', garment: 'dress', hair: 'bun', hat: 'bonnet', scarf: true,
      body: { height: 0.88, thick: 0.96 },
      colors: { skin: '#b89a84', hair: '#a8a296', top: '#3a3638', garment: '#3a3638', hat: '#bdb6a6', accent: '#4a403a', shoes: '#28221c' } },
  },
  shapes: {
    // the world's style: slender figures in flat colours, softly shaded, a fine line (as its painted people were)
    styles: { chrysalids: { from: 'graphic', name: 'Хризалиды', paint: 'toned', line: 1.1, tinted: true, face: 'simple', ground: 'day' } },
    garments: {
      // a smith's leather apron over the shirt, its sleeves rolled up (the forearms bare)
      smith_apron: { name: 'фартук кузнеца', short: true, draw: F => MooodShapes.GARMENTS.apron.draw(F) },
      // a long coat to the shins, buttoned, its sleeves of it
      longcoat: { name: 'длинный сюртук', hang: [{ to: 1.55, from: 'shoulders', flare: 0.22 }], sleeves: 'garment' },
      // a dress to the ground, long sleeves, and an apron over it (the apron in the look's accent colour)
      // Petra's: a dress to the shins and a plum shawl over the shoulders (the shawl in the look's top colour, the sleeves
      // the dress's)
      shawl_dress: { name: 'платье и шаль', hang: [{ to: 1.5, from: 'waist', flare: 0.4, off: 0.94 }, { to: 0.12, from: 'shoulders', flare: 0.3, color: 'top', folds: false }],
        sleeves: 'garment', bare: true, bodice: true },
      // David's nightshirt (the dream): pale linen from the shoulders to the shins
      nightshirt: { name: 'ночная рубашка', hang: [{ to: 1.45, from: 'shoulders', flare: 0.22 }], sleeves: 'garment' },
      apron_dress: { name: 'платье с фартуком', hang: [{ to: 1.9, from: 'waist', flare: 0.4, off: 0.94 }], sleeves: 'garment', bare: true, bodice: true,
        draw: F => MooodShapes.GARMENTS.apron.draw({ ...F, colors: { ...F.colors, garment: F.colors.accent } }) },
    },
    hats: {
      // a white bonnet: over the crown and the back of the head down to the nape, the face open
      bonnet: { name: 'чепец', draw: F => {
        const { at, axes, egg, r, out, sides, square } = F.head;
        F.cap(at, axes, egg.map(e => e * r * out * 1.12), [0, 0.42, -0.9], -0.42, F.colors.hat, sides, square);
      } },
      // a kerchief tied over the hair, its knot at the nape
      kerchief: { name: 'косынка', draw: F => {
        const { add, mul } = MooodShapes.V, { at, axes, egg, r, out, sides, square } = F.head, [hs, hu, hf] = axes;
        F.cap(at, axes, egg.map(e => e * r * out * 1.08), [0, 0.7, -0.72], -0.05, F.colors.hat, sides, square);
        F.ball(add(at, add(mul(hu, -r * 0.45), mul(hf, -r * 1.02))), axes, [r * 0.22, r * 0.16, r * 0.14], F.colors.hat, 10);
      } },
    },
    faces: {
      // the face, and round spectacles over its eyes: two thin rims, a bridge between (in the look's accent colour, as
      // they catch the light)
      spectacles: { name: 'очки', draw: F => {
        MooodShapes.FACES.simple.draw(F);
        const { axes: [, hu], r, on } = F.head, n = 12, rim = [[0, r * 0.022], [n, r * 0.022]], bridge = [[0, r * 0.022], [2, r * 0.022]];
        for (const s of [-1, 1]) F.tube(Array.from({ length: n + 1 }, (_, i) => { const a = i / n * Math.PI * 2; return on([s * 0.34 + 0.17 * Math.cos(a), 0.08 + 0.15 * Math.sin(a), 0.95], 1.0); }), rim, [[0, F.colors.accent]], 5, hu);
        F.tube([on([-0.17, 0.1, 0.99], 1.0), on([0, 0.13, 1], 1.0), on([0.17, 0.1, 0.99], 1.0)], bridge, [[0, F.colors.accent]], 5, hu);
      } },
    },
    parts: {
      // a full beard: over the jaw and the chin, a little down onto the chest (the colour of the hair)
      beard: { name: 'борода', draw: F => {
        const { add, mul } = MooodShapes.V, h = F.head, [, hu, hf] = h.axes, r = h.r * h.out;
        F.cap(h.at, h.axes, h.egg.map(e => e * r * 1.05), [0, -0.55, 0.83], 0.25, F.colors.hair, h.sides, h.square);
        F.ball(add(h.at, add(mul(hu, -r * 0.92), mul(hf, r * 0.5))), h.axes, [r * 0.62, r * 0.48, r * 0.42], F.colors.hair, h.sides);
      } },
      // the smith's hammer in his left hand (he strikes with the left): the handle out of the fist on along the forearm,
      // the wrist cocked back a little (toward the bent elbow's inside), its head's face outwards, the way the arm
      // swings — down onto the iron as the arm comes down
      hammer: { name: 'молот', draw: F => {
        const { add, sub, mul, dot, unit, mix } = MooodShapes.V, m = F.fit.h, wood = [0.36, 0.26, 0.18, 1], iron = [0.2, 0.19, 0.19, 1];
        const wrist = F.P('LeftHand'), elbow = F.P('LeftForeArm'), grip = mix(wrist, F.P('LeftHandMiddle1'), 0.85), fore = unit(sub(wrist, elbow));
        const back = sub(F.P('LeftArm'), elbow), inside0 = sub(back, mul(fore, dot(back, fore)));
        const inside = Math.hypot(...inside0) > 0.02 ? unit(inside0) : F.up('Chest'), cock = 0.2;
        const handle = unit(add(mul(fore, Math.cos(cock)), mul(inside, Math.sin(cock)))), face = unit(sub(mul(inside, -1), mul(handle, dot(mul(inside, -1), handle))));
        const head = add(grip, mul(handle, 0.3 * m));
        F.bar(add(grip, mul(handle, -0.05 * m)), head, 0.014 * m, 0.012 * m, [[0, wood]], 8, face);
        F.bar(add(head, mul(face, -0.06 * m)), add(head, mul(face, 0.07 * m)), 0.03 * m, 0.032 * m, [[0, iron]], 8, handle, 1, 4);
      } },
      // tongs in his right hand, on along the forearm out of the fist (their jaws on the iron he holds on the anvil)
      tongs: { name: 'клещи', draw: F => {
        const { add, sub, mul, unit, mix, cross } = MooodShapes.V, m = F.fit.h, iron = [0.17, 0.16, 0.16, 1];
        const wrist = F.P('RightHand'), knuckles = F.P('RightHandMiddle1'), grip = mix(wrist, knuckles, 0.85);
        const dir = unit(sub(wrist, F.P('RightForeArm'))), across = unit(cross(dir, sub(F.P('RightHandIndex1'), F.P('RightHandPinky1'))));
        const jaws = add(grip, mul(dir, 0.36 * m));
        for (const s of [-1, 1]) F.bar(add(add(grip, mul(dir, -0.14 * m)), mul(across, s * 0.012 * m)), add(jaws, mul(across, s * 0.006 * m)), 0.008 * m, 0.007 * m, [[0, iron]], 6, across);
      } },
      // a lantern hanging from the right hand by its bail, swinging a little as the hand goes (its light is the scene's:
      // a light "at" the hand)
      lantern: { name: 'фонарь', draw: F => {
        const { add, sub, mul, unit, cross } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), iron = [0.14, 0.13, 0.12, 1], glass = [1, 0.82, 0.5, 0];
        const low = F.swing('lantern', add(hand, [0, -0.24 * m, 0]), 60), down = unit(sub(low, hand)), side = unit(cross(down, F.fwd('Hips'))), axes = [side, mul(down, -1), unit(cross(side, mul(down, -1)))];
        const at = d => add(hand, mul(down, d * m));
        F.bar(hand, at(0.05), 0.004 * m, 0.004 * m, [[0, iron]], 5, side);
        F.ball(at(0.07), axes, [0.045 * m, 0.025 * m, 0.045 * m], iron, 10);
        F.ball(at(0.14), axes, [0.042 * m, 0.065 * m, 0.042 * m], glass, 12);
        F.ball(at(0.21), axes, [0.05 * m, 0.016 * m, 0.05 * m], iron, 10);
      } },
      // a tall walking staff in the right hand, from the floor to above the shoulder, the hand round it
      staff: { name: 'посох', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), wood = [0.3, 0.22, 0.15, 1];
        const foot = [hand[0], 0, hand[2]];
        F.bar(foot, add(hand, [0, 0.42 * m, 0]), 0.016 * m, 0.018 * m, [[0, wood]], 6, F.side('Hips'));
      } },
      // Rosalind's bow in the left hand, upright, its grip in the fist; its string from the tips — to the right hand while
      // that hand is near the string and behind the bow (drawing), else straight between them
      bow: { name: 'лук', draw: F => {
        const { add, sub, mul, dot, unit, cross } = MooodShapes.V, m = F.fit.h, wood = [0.33, 0.24, 0.16, 1], gut = [0.78, 0.74, 0.66, 1];
        const grip = F.P('LeftHand'), out = unit(sub(grip, F.P('LeftForeArm'))), up0 = [0, 1, 0];
        const up = unit(sub(up0, mul(out, dot(up0, out)))), back = mul(out, -1), half = 0.62 * m, bend = 0.13 * m;
        const tip = s => add(add(grip, mul(up, s * half)), mul(back, bend));
        const pts = [-1, -0.6, -0.25, 0, 0.25, 0.6, 1].map(u => add(add(grip, mul(up, u * half)), mul(back, bend * u * u)));
        F.tube(pts, [[0, 0.007 * m], [3, 0.013 * m], [6, 0.007 * m]], [[0, wood]], 6, cross(up, out));
        const hand = F.P('RightHand'), mid = add(grip, mul(back, bend)), pull = sub(hand, mid);
        const nock = Math.hypot(...pull) < 0.75 * m && dot(pull, back) > 0 ? hand : mid;
        F.tube([tip(1), nock, tip(-1)], [[0, 0.0025 * m], [2, 0.0025 * m]], [[0, gut]], 4, out);
      } },
      // a hay rake held in both hands: its long handle through the fists, its head of tines on the ground before them
      rake: { name: 'грабли', draw: F => {
        const { add, sub, mul, unit, mix, cross } = MooodShapes.V, m = F.fit.h, wood = [0.48, 0.38, 0.26, 1];
        const hands = mix(F.P('LeftHand'), F.P('RightHand'), 0.5), along = unit(sub(F.P('RightHand'), F.P('LeftHand')));
        const head = add(add(hands, mul(along, 0.9 * m)), [0, -0.5 * m, 0]), dir = unit(sub(head, hands));
        F.bar(add(hands, mul(dir, -0.35 * m)), head, 0.014 * m, 0.013 * m, [[0, wood]], 6, F.side('Hips'));
        const bar = unit(cross(dir, [0, 1, 0]));
        F.bar(add(head, mul(bar, -0.28 * m)), add(head, mul(bar, 0.28 * m)), 0.016 * m, 0.016 * m, [[0, wood]], 6, dir);
      } },
      // a spear in the right hand, upright, its butt by the foot (a guard's)
      spear: { name: 'копьё', draw: F => {
        const { add } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), wood = [0.36, 0.28, 0.2, 1], iron = [0.42, 0.42, 0.44, 1];
        const foot = [hand[0], 0, hand[2]], top = add(hand, [0, 1.0 * m, 0]);
        F.bar(foot, top, 0.014 * m, 0.012 * m, [[0, wood]], 6, F.side('Hips'));
        F.bar(top, add(top, [0, 0.2 * m, 0]), 0.025 * m, 0.002 * m, [[0, iron]], 4, F.side('Hips'), 1, 4);
      } },
      // a hump high on the back (the hunchback's)
      hump: { name: 'горб', draw: F => {
        const { add, mul } = MooodShapes.V, k = F.k, c = add(F.P('Chest'), add(mul(F.fwd('Chest'), -0.12 * k), mul(F.up('Chest'), 0.06 * F.fit.h)));
        F.ball(c, [F.side('Chest'), F.up('Chest'), F.fwd('Chest')], [0.16 * k, 0.15 * k, 0.12 * k], F.colors.top, 14);
      } },
      // a torch in the right hand: a short stave, its head wound with pitch-rag, held up — the fire is the scene's
      // (particles and a light "at" its point `flame`)
      torch: { name: 'факел', draw: F => {
        const { add, sub, mul, unit } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), wood = [0.34, 0.25, 0.17, 1], rag = [0.22, 0.17, 0.12, 1];
        const along = unit(add(unit(sub(hand, F.P('RightForeArm'))), [0, 1.6, 0])), head = add(hand, mul(along, 0.42 * m));
        F.bar(add(hand, mul(along, -0.12 * m)), head, 0.016 * m, 0.02 * m, [[0, wood]], 6, F.side('RightHand'));
        F.ball(head, [F.side('RightHand'), along, F.fwd('RightHand')], [0.035 * m, 0.06 * m, 0.035 * m], rag, 10);
        F.point('flame', add(head, mul(along, 0.06 * m)));
      } },
      // Sophie's shoe in a hand (its <id>_with: ["shoe"]): a small laced shoe held by its heel, the toe out of the hand
      shoe: { name: 'башмак', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), out = F.fwd('RightHand');
        const axes = [F.side('RightHand'), F.up('RightHand'), out], col = [0.23, 0.16, 0.13, 1];
        F.ball(add(hand, mul(out, 0.07 * m)), axes, [0.04 * m, 0.035 * m, 0.1 * m], col, 14);
        F.ball(add(hand, mul(axes[1], 0.035 * m)), axes, [0.038 * m, 0.05 * m, 0.045 * m], col, 12);
      } },
      // a bundle in the right hand (a night's flight): a cloth knotted round what they take, hanging from the fist
      bundle: { name: 'узел', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand');
        const axes = [F.side('Hips'), [0, 1, 0], F.fwd('Hips')], cloth = [0.55, 0.5, 0.42, 1];
        F.ball(add(hand, [0, -0.17 * m, 0]), axes, [0.15 * m, 0.13 * m, 0.11 * m], cloth, 16);
        F.ball(add(hand, [0, -0.03 * m, 0]), axes, [0.04 * m, 0.05 * m, 0.04 * m], cloth, 10);
      } },
      // David's cut hand, bound: a linen rag wound round the palm, tied neat
      rag: { name: 'повязка', draw: F => rag(F, false) },
      // …wound round it anyhow by himself: an end hanging loose, the blood through it
      rag_loose: { name: 'тряпка на руке', draw: F => rag(F, true) },
      // the Book, shut, in the left hand (held by its edge, hanging)
      book: { name: 'Книга', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, h = F.P('LeftHand'), ax = [F.side('LeftHand'), F.up('LeftHand'), F.fwd('LeftHand')];
        F.ball(add(h, mul(ax[2], 0.07 * m)), ax, [0.03 * m, 0.135 * m, 0.095 * m], COVER, 8, 8);
      } },
      // the Book open, held in both hands before the reader, its pages to his eyes
      book_open: { name: 'Книга открыта', draw: F => openBook(F, V => V.mix(F.P('LeftHand'), F.P('RightHand'), 0.5), V => V.unit(V.sub(F.P('RightHand'), F.P('LeftHand')))) },
      // …open on the left hand alone (the right is free: raised, pointing)
      book_open_l: { name: 'Книга открыта в левой', draw: F => openBook(F, V => V.add(F.P('LeftHand'), V.mul(F.up('LeftHand'), 0.03 * F.fit.h)), null) },
      // a long wooden ladle in the right hand, for the pot on the hearth
      ladle: { name: 'половник', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, h = F.P('RightHand'), d = F.fwd('RightHand'), wood = [0.36, 0.27, 0.19, 1];
        const end = add(h, mul(d, 0.42 * m));
        F.bar(add(h, mul(d, -0.06 * m)), end, 0.011 * m, 0.009 * m, [[0, wood]], 6, F.side('RightHand'));
        F.ball(end, [F.side('RightHand'), F.up('RightHand'), d], [0.04 * m, 0.03 * m, 0.035 * m], wood, 10);
      } },
      // a spoon in the right hand (eating from a bowl)
      spoon: { name: 'ложка', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, h = F.P('RightHand'), d = F.fwd('RightHand'), wood = [0.42, 0.33, 0.24, 1];
        F.bar(h, add(h, mul(d, 0.13 * m)), 0.006 * m, 0.006 * m, [[0, wood]], 6, F.side('RightHand'));
        F.ball(add(h, mul(d, 0.15 * m)), [F.side('RightHand'), F.up('RightHand'), d], [0.02 * m, 0.008 * m, 0.028 * m], wood, 8);
      } },
    },
  },
};
