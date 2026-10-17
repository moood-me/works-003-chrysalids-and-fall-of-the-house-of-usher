const b = e.anim.clamp(e.state.bell ?? 0, 0, 1);
for (let i = 0; i < 5; i++) {
  const per = 17 + i * 3.7, p = (e.t / per + i * 0.31) % 1, B = e.layer('b' + i);
  B.x = -16 + 32 * p;
  B.y = 0.7 * Math.sin(p * Math.PI * 2 + i) + 0.25 * Math.sin(e.t * 0.7 + i * 2) - i * 0.25 - b * 1.5 * Math.sin(p * Math.PI);
  B.alpha = 0.85 * Math.min(1, (1 - Math.abs(2 * p - 1)) * 5);
  B.scaleY = Math.sin(e.t * 0.4 + i) > 0.3 ? 0.15 : Math.sin(e.t * (5.5 + i * 0.6) + i * 2);
}
