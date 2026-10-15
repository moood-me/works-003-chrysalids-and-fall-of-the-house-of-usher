// Учимся слышать (engine 3): what its elements and its script share. The children of the valley, in their order (the
// game's `children`: how many of them hear — 0 David, 1 Rosalind, 2 the girl at the washing line, 3 the shepherd boy,
// 4 the boy on the hay cart, 5 the girl with the bucket): where each is (across, distance; the valley's floor is 15 m
// below us), where each one's head is (HD: across, distance, its height — absolute, the eye 1.7 m above our ground),
// and whether each is listening now (LIS: slow pauses of their own, all quiet while the grown-ups look — `adults_near`).
const KIDS = ['david', 'rosalind', 'washer', 'shepherd', 'cart', 'far_girl'];
const HD = [[-7.4, 22, -2.71], [31.4, 58.8, -13.0], [32.2, 90.6, -13.7], [-49.6, 93, -7.6], [4.4, 125, -12.1], [-54.8, 220, -13.7]];
function LIS(k, t, s) {
  const n = Math.round(s.children == null ? 5 : +s.children), an = +(s.adults_near || 0), th = s.threads == null ? 0.7 : +s.threads, ro = +(s.rosalind || 0);
  let con, p;
  if (k === 0) { con = n > 1 || ro > 0.05 ? 1 : 0; p = 0.8 + 0.2 * Math.sin(t * 0.07); }
  else {
    con = k < n ? 1 : 0;
    if (k === 1) con = Math.max(con, Math.min(1, ro * 2));
    p = Math.max(0, Math.min(1, 0.65 + 1.4 * Math.sin(t * 0.083 + k * 2.3) + 0.3 * Math.sin(t * 0.031 + k * 1.7)));
  }
  return con * (1 - an) * Math.min(1, th * 1.6) * p;
}
// the threads (between whom), and a head as seen on the threads' card (at D m, at the eye's line: x right, y down) from
// the eye — EYE m ahead of the scene's start (the camera dollied in: camera_z, its state, so the valley's children are
// nearer and larger)
const LINKS = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [2, 4], [3, 5], [1, 2]];
const D = 20, EYE = 12;
const P = i => { const p = HD[i], k = (D - EYE) / (p[1] - EYE); return [p[0] * k, -(1.7 + (p[2] - 1.7) * k)]; };
return { KIDS, HD, LIS, LINKS, D, EYE, P };
