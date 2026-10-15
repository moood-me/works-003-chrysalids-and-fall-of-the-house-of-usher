// What only those like them hear (near bank's metres): Petra's cry (cry 0..1) — pale rings spreading from her head
// over the water and the fields; bond 0..1 — David and Rosalind hearing each other: warm rings from his head.
const L = e.lib,
  s = e.state,
  C = s.cry ?? 0,
  B = s.bond ?? 0;
if (C < 0.01 && B < 0.01) return;
const t = e.t;
if (C >= 0.01) {
  const h = L.where.petra;
  L.cry(g, t, h[0], h[1], C, 24);
}
if (B >= 0.01) {
  const h = L.where.david;
  L.cry(g, t, h[0], h[1], B * 0.8, 6, "255,214,160", 0.16, 3);
}
