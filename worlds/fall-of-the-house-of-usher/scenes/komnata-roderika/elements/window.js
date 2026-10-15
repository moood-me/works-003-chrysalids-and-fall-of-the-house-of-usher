// The glass of the three lancet windows in the back wall — what comes through it, grey-blue by day, crimson-grey in the
// evening (`evening`: painted again as it turns) — and the diamond lattice over it. It glows: it is the light outside.
// Layers: "glass" — the side windows; "air" — the misty air beyond the middle one; "leaf_l", "leaf_r" — its two leaves,
// hinged at the jambs: `window_open` swings them in (animate), the air showing as they go. How bright the glass is
// (`window_light`, the open window, the evening) is its layers' brightness and its glows' strength (animate). The
// embrasures and sills are the wall's; the curtain is curtain.js.
const { mix } = e.anim;
const ev = e.lib.num(e.state.evening);
const rgb = (c) => "rgb(" + c.map(Math.round).join(",") + ")";
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const blend = (a, b, u) => a.map((v, i) => mix(v, b[i], u));
// the glass at its brightest (animate dims it as less comes through)
const glassTop = blend([150, 166, 176], [122, 76, 72], ev);
const glassLow = blend([104, 120, 132], [84, 50, 50], ev);
const air = blend([176, 188, 196], [150, 96, 90], ev);
const W = e.lib.WINDOWS;
const lancet = e.lib.lancet;
const lattice = (c, x, b) => {
  c.strokeStyle = "rgba(14,20,26,0.6)";
  c.lineWidth = 0.022;
  c.beginPath();
  for (let k = -22; k <= 22; k++) {
    const o = k * 0.17;
    c.moveTo(x + o - 3, b + 3);
    c.lineTo(x + o + 3, b - 3);
    c.moveTo(x + o + 3, b + 3);
    c.lineTo(x + o - 3, b - 3);
  }
  c.stroke();
};
// a pane of glass in outline G (its lattice, the mullion, the jambs' shade), tinted toward the frame's dark by `dim`
const pane = (c, G, x, b, tp, w, dim) => {
  const wg = c.createLinearGradient(0, tp, 0, b);
  wg.addColorStop(0, rgb(blend(glassTop, [20, 26, 30], dim)));
  wg.addColorStop(1, rgb(blend(glassLow, [20, 26, 30], dim)));
  c.fillStyle = wg;
  c.fill(G);
  c.save();
  c.clip(G);
  lattice(c, x, b);
  c.fillStyle = "rgba(14,20,26,0.75)";
  c.fillRect(x - 0.022, tp, 0.044, b - tp);
  const ins = c.createLinearGradient(x - w, 0, x + w, 0);
  ins.addColorStop(0, "rgba(10,15,19,0.45)");
  ins.addColorStop(0.3, "rgba(10,15,19,0)");
  ins.addColorStop(0.7, "rgba(10,15,19,0)");
  ins.addColorStop(1, "rgba(10,15,19,0.45)");
  c.fillStyle = ins;
  c.fillRect(x - w, tp, 2 * w, b - tp);
  c.restore();
};
e.layer("glass", {}, (c) => {
  for (const [x, b, tp, w] of [W[0], W[2]]) {
    const G = new Path2D();
    lancet(G, x, b, tp, w);
    pane(c, G, x, b, tp, w, 0);
  }
});
const [mx, mb, mt, mw] = W[1];
const M = new Path2D();
lancet(M, mx, mb, mt, mw);
e.layer("air", {}, (c) => {
  const ag = c.createLinearGradient(0, mt, 0, mb);
  ag.addColorStop(0, rgb(air));
  ag.addColorStop(1, rgb(blend(air, glassLow, 0.4)));
  c.fillStyle = ag;
  c.fill(M);
});
// the leaves: each half of the middle window, from its hinge at the jamb
for (const s of [-1, 1]) {
  e.layer(s < 0 ? "leaf_l" : "leaf_r", { pivot: [mx + s * mw, mb] }, (c) => {
    c.save();
    c.clip(M);
    const half = new Path2D();
    half.rect(Math.min(mx, mx + s * mw), mt, mw, mb - mt);
    c.clip(half);
    pane(c, M, mx, mb, mt, mw, 0.15);
    // the leaf's frame along its free edge
    c.fillStyle = "rgba(14,20,26,0.85)";
    c.fillRect(mx - 0.03 * (s < 0 ? 1 : 0), mt, 0.03, mb - mt);
    c.restore();
  });
}
// what spills from each window onto the stone round it (a glow, and a little light near): animate dims them
W.forEach(([x, b, tp], i) => e.light(x, (b + tp) / 2, 1.1, hex(blend(glassTop, [255, 255, 255], 0.15)), 0.35, "w" + i));
e.at(mx, (mb + mt) / 2, "glass");
