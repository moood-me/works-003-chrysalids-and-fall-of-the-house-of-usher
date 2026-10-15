// The stairs behind the stair door, going straight up away from it (lib.STEP; the land there: relief.js): each step a
// block at its own depth — its riser and its tread's lip — and the stairwell's far wall above the top
const S = e.lib.STEP, D = e.lib.DOOR, w = D.a1 - D.a0 + 0.1, x0 = D.a0 - 0.05 - e.spot.across;
for (let i = 0; i < S.n; i++) {
  const top = S.rise * (i + 1);
  e.part(0, S.d - e.spot.distance + S.run * i, g2 => {
    g2.fillStyle = '#6a4e38';
    g2.fillRect(x0, -top, w, top);
    g2.fillStyle = '#8a6a4c';
    g2.fillRect(x0, -top, w, 0.016);
    g2.fillStyle = 'rgba(30,20,14,0.35)';
    g2.fillRect(x0, -top + 0.016, w, 0.05);
  }, [x0, -top, x0 + w, 0]);
}
e.part(0, S.d - e.spot.distance + S.run * S.n, g2 => {
  g2.fillStyle = '#8e8270';
  g2.fillRect(x0 - 0.3, -4.2, w + 0.6, 4.2);
}, [x0 - 0.3, -4.2, x0 + w + 0.3, 0]);
