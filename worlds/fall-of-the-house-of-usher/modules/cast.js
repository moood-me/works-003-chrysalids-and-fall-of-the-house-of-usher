// The people of «The Fall of the House of Usher» as people in a scene (the engine's people.js: an element with "person"): who
// they are — figures of shapes in this world's style, soft dark silhouettes, tapered limbs, long gowns and coats,
// rimmed by the light round them — and how they move: the motions in cast.data.json (Kimodo's, put there with
// put_motion). cast.md says who is who and what each motion is. A part's lengths are a man's metres times F.fit.h
// (the person's height as a share of a man's 1.76 m).
return {
  ...data,
  characters: {
    // Roderick Usher: tall, wasted, a cadaverous pallor, hair of silver silk worn long; a dressing gown to the floor
    roderick: { kind: 'shapes', style: 'usher', who: 'man', garment: 'robe', hair: 'straight',
      body: { height: 1.06, thick: 0.74, shoulders: 0.92, head: 1.02, neck: 1.08 },
      colors: { skin: '#d9d2ca', hair: '#c9ccce', garment: '#1d161a', bottom: '#141114', shoes: '#0f0d0e' } },
    // the narrator: his friend from boyhood, come on horseback through the autumn; a long riding coat
    narrator: { kind: 'shapes', style: 'usher', who: 'man', garment: 'coat', hair: 'short',
      body: { height: 1.0, thick: 0.86 }, colors: { garment: '#17191c', hair: '#2a2420', bottom: '#121315', shoes: '#0d0d0e' } },
    // the lady Madeline: his twin — the same pallor, the same ash-silver hair, long and loose; thin; a long white-grey
    // night gown with sleeves, barefoot; not a shadow as the living are: seen in her pale colours, as the light lies on her
    madeline: { kind: 'shapes', style: 'usher', who: 'woman', garment: 'gown', hair: 'long', paint: 'lit',
      body: { height: 0.95, thick: 0.76, shoulders: 0.86, neck: 1.08 },
      colors: { skin: '#e4dfd6', hair: '#a8a399', garment: '#c4c2bb', top: '#c4c2bb', shoes: '#e4dfd6' } },
    // the doctor: about fifty-five, stout, grey side-whiskers; a black frock coat; his bag in the right hand
    doctor: { kind: 'shapes', style: 'usher', who: 'man', garment: 'coat', hair: 'short', parts: ['bag'],
      body: { height: 0.97, thick: 1.22, shoulders: 1.02 },
      colors: { skin: '#c49a82', hair: '#8e8a84', garment: '#1b1a1e', bottom: '#232226', shoes: '#121113' } },
    // the valet: of stealthy step, in a dark livery jacket
    valet: { kind: 'shapes', style: 'usher', who: 'man', garment: 'jacket', hair: 'short',
      body: { height: 0.97, thick: 0.9, shoulders: 0.96 }, colors: { garment: '#1b1815', hair: '#3a332c', bottom: '#151311' } },
  },
  shapes: {
    // the world's style: the engine's shadow figures (slender, small-headed, tapering, a silhouette rimmed by the light)
    styles: { usher: { from: 'shadow', name: 'the Ushers', face: 'simple', ground: 'night' } },
    garments: {
      // Madeline's night gown: from the shoulders to the floor, long-sleeved, falling loose
      gown: { name: 'night gown', hang: [{ to: 2.25, from: 'shoulders', flare: 0.4 }], sleeves: 'garment' },
      // …the same, risen from the vault: torn at the hem, blood on its breast and on her hands
      shroud: { name: 'shroud in blood', hang: [{ to: 2.25, from: 'shoulders', flare: 0.4, ragged: true }], sleeves: 'garment', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, [, , chest] = F.trunk(1.08), blood = [0.36, 0.06, 0.05, 1];
        const [c, side, fwd, w, d] = chest, up = F.up('Chest'), axes = [side, up, fwd];
        F.ball(add(add(c, mul(fwd, d)), mul(side, 0.3 * w)), axes, [0.055 * m, 0.08 * m, 0.012 * m], blood, 12);
        F.ball(add(add(c, mul(fwd, d * 0.96)), add(mul(side, -0.2 * w), mul(up, -0.09 * m))), axes, [0.04 * m, 0.05 * m, 0.012 * m], blood, 12);
        for (const h of ['RightHand', 'LeftHand']) F.ball(F.P(h), [F.side(h), F.up(h), F.fwd(h)], [0.032 * m, 0.03 * m, 0.045 * m], blood, 10);
      } },
    },
    // the narrator's top hat, out of doors (a look's hat: 'top'): a narrow brim at the brow, a tall crown a little wider
    // at the top
    hats: { top: { name: 'top hat', draw: F => {
      const { add, mul, cross, unit } = MooodShapes.V, { at: head, axes: [hs, hu, hf], r: rh } = F.head;
      const tilt = unit(add(hu, mul(hf, 0.06))), axes = [hs, tilt, cross(hs, tilt)], brim = add(head, mul(tilt, rh * 0.42));
      F.ball(brim, axes, [rh * 1.25, rh * 0.04, rh * 1.15], F.colors.hat, F.sides * 2);
      // (the crown: rings round the tilt from the brim up, flat on top)
      const n = F.sides, ring = (h, r) => Array.from({ length: n }, (_, q) => {
        const a = (q / n) * Math.PI * 2;
        return add(add(brim, mul(tilt, h)), add(mul(axes[0], r * Math.cos(a)), mul(axes[2], r * Math.sin(a))));
      });
      const rings = [ring(0, rh * 0.66), ring(rh * 1.5, rh * 0.72)];
      F.rings(rings, [...rings.map(() => Array(n).fill(F.colors.hat)), [F.colors.hat], [F.colors.hat]], brim, add(brim, mul(tilt, rh * 1.5)));
    } } },
    parts: {
      // Roderick's oil lamp (his <id>_with: ["lamp"]), held up by its foot in the right hand: a brass font, its glass
      // chimney glowing round the flame (a colour of tone 2 glows: its own, in the dark), a brass cap — upright, as it
      // hangs, whatever the hand does; its point flame ("roderick#flame": the scene's light "at" it)
      lamp: { name: 'lamp', draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand'), axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const brass = [0.3, 0.22, 0.12, 1], glass = [1, 0.8, 0.52, 2], at = h => add(hand, [0, h * m, 0]);
        F.ball(at(0.03), axes, [0.045 * m, 0.02 * m, 0.045 * m], brass, 12);
        F.ball(at(0.075), axes, [0.06 * m, 0.04 * m, 0.06 * m], brass, 14);
        F.ball(at(0.165), axes, [0.034 * m, 0.065 * m, 0.034 * m], glass, 12);
        F.ball(at(0.235), axes, [0.022 * m, 0.012 * m, 0.022 * m], brass, 8);
        F.point('flame', at(0.165));
      } },
      // the open book read in both hands («The Mad Trist»): between them, its spine across, its pages turned up between
      // the reader's eyes and the ceiling (as a book is read by a candle on the table), opened a little — a dark cover, and over it the two blocks of pages in their own colour in the light (tone 3: in
      // colours on a silhouette), thick enough for their edges to show from aside; its point book (the pages' middle)
      book_open: { name: 'book open', draw: F => {
        const V = MooodShapes.V, m = F.fit.h, r = F.P('RightHand'), l = F.P('LeftHand'), c = V.add(V.mix(l, r, 0.5), V.mul(F.up('Chest'), 0.03 * m));
        const n = V.unit(V.add(V.unit(V.sub(F.P('Head'), c)), [0, 0.7, 0])), x0 = V.unit(V.sub(r, l)), x = V.unit(V.sub(x0, V.mul(n, V.dot(x0, n)))), y = V.cross(n, x);
        F.ball(V.add(c, V.mul(n, -0.014 * m)), [x, y, n], [0.17 * m, 0.12 * m, 0.008 * m], [0.16, 0.1, 0.08, 1], 8, 10);
        F.point('book', c);
        for (const s of [-1, 1]) {
          const px = V.unit(V.add(V.mul(x, 0.97), V.mul(n, 0.24 * s))), pn = V.cross(px, y).map(v => v * s);
          F.ball(V.add(c, V.mul(px, s * 0.082 * m)), [px, y, pn], [0.08 * m, 0.11 * m, 0.016 * m], [0.82, 0.76, 0.62, 3], 8, 10);
        }
      } },
      // the doctor's bag (38 × 24 × 18 cm), hanging from his right hand by its handle, swinging a little late as he goes: a
      // body long the way he faces, a darker frame round its mouth
      bag: { name: 'bag', draw: F => {
        const { add, sub, mul, dot, cross, unit } = MooodShapes.V, m = F.fit.h, hand = F.P('RightHand');
        const mid = F.swing('bag', add(hand, [0, -0.2 * m, 0]), 70), up = unit(sub(hand, mid));
        const fwd = unit(sub(F.fwd('Hips'), mul(up, dot(F.fwd('Hips'), up)))), side = cross(up, fwd), axes = [side, up, fwd];
        const leather = [0.12, 0.08, 0.06, 1], frame = [0.07, 0.05, 0.04, 1];
        // a long box, its bottom flat, its sides falling in a little to the hinged frame along its top
        F.ball(mid, axes, [0.09 * m, 0.11 * m, 0.19 * m], leather, 16, 7);
        const top = add(mid, mul(up, 0.11 * m));
        F.bar(add(top, mul(fwd, -0.18 * m)), add(top, mul(fwd, 0.18 * m)), 0.03 * m, 0.03 * m, [[0, frame]], 8, up, 0.45, 4);
        // the handle: an arch from the frame up to the hand
        F.bar(add(top, mul(fwd, -0.05 * m)), hand, 0.01 * m, 0.01 * m, [[0, frame]], 6, side, 0.6);
        F.bar(add(top, mul(fwd, 0.05 * m)), hand, 0.01 * m, 0.01 * m, [[0, frame]], 6, side, 0.6);
      } },
      // a torch in the left hand (the vault), held upright: a staff of wood through the fist, its head of pitch-soaked rag
      // above it; its point flame — where it burns (the scene paints the fire there and lights from it)
      torch: { name: 'torch', points: { flame: { joint: 'LeftHand', off: [0.08, 0, 0], rise: 0.33 } }, draw: F => {
        const { add, mul } = MooodShapes.V, m = F.fit.h, up = [0, 1, 0], side = F.side('LeftHand');
        const grip = add(F.P('LeftHand'), mul(side, 0.08 * m)), fwd = F.fwd('LeftHand');
        F.bar(add(grip, mul(up, -0.16 * m)), add(grip, mul(up, 0.26 * m)), 0.016 * m, 0.02 * m, [[0, [0.16, 0.1, 0.06, 1]]], 8, fwd, 0.4);
        F.ball(add(grip, mul(up, 0.29 * m)), [side, up, fwd], [0.034 * m, 0.05 * m, 0.034 * m], [0.07, 0.05, 0.04, 1], 10);
      } },
      // Roderick's guitar, in his hands (a person's <id>_with: ["guitar"]): its sound hole under the hand that strums,
      // the neck out to the hand on it, its face turned out from his chest — a body of two bouts, a neck, a head
      guitar: { name: 'guitar', draw: F => {
        const { add, sub, mul, dot, cross, unit, mix } = MooodShapes.V, m = F.fit.h;
        const hole = add(F.P('RightHand'), mul(F.fwd('Chest'), -0.03 * m)), toNeck = unit(sub(F.P('LeftHand'), hole));
        const out = unit(sub(F.fwd('Chest'), mul(toNeck, dot(F.fwd('Chest'), toNeck)))), across = cross(toNeck, out);
        const axes = [across, toNeck, out], wood = [0.23, 0.15, 0.09, 1], dark = [0.11, 0.07, 0.05, 1];
        F.ball(add(hole, mul(toNeck, -0.13 * m)), axes, [0.19 * m, 0.17 * m, 0.05 * m], wood, 18);
        F.ball(add(hole, mul(toNeck, 0.06 * m)), axes, [0.14 * m, 0.12 * m, 0.045 * m], wood, 16);
        const nut = add(F.P('LeftHand'), mul(toNeck, 0.05 * m));
        F.bar(add(hole, mul(toNeck, 0.15 * m)), nut, 0.022 * m, 0.02 * m, [[0, dark]], 8, out, 0.6);
        F.bar(nut, add(nut, mul(toNeck, 0.16 * m)), 0.03 * m, 0.028 * m, [[0, dark]], 8, out, 0.4);
      } },
    },
  },
};
