// The guardians of the way (on the left, 14…30 m): five tall, wrong trees at their own depths (parts), their crowns broad
// and low on twisted trunks. The moon behind them on the left throws their shadows across the last field and the path —
// the dark pools the fugitives go by (lib.TREES: where each stands and how its crown is; whether a point is in their
// shadow is worked out from them, lib.shaded)
const { TREES, CROWN } = e.lib;
for (const t of TREES) {
  e.part(t.a - e.spot.across, t.d - e.spot.distance, q => {
    const col = '#3e4a3c';
    q.fillStyle = '#4a4438';
    q.beginPath();
    q.moveTo(-0.35, 0.1);
    q.quadraticCurveTo(-0.2 + t.lean, -t.h * 0.4, -0.12 + t.lean * 1.4, -t.h + 0.6);
    q.lineTo(0.14 + t.lean * 1.4, -t.h + 0.6);
    q.quadraticCurveTo(0.2 + t.lean, -t.h * 0.4, 0.35, 0.1);
    q.closePath();
    q.fill();
    q.fillStyle = col;
    for (let i = 0; i < 26; i++) {
      const a = e.rnd() * 6.28, rr = Math.pow(e.rnd(), 0.6);
      q.beginPath();
      q.ellipse(t.lean * 1.4 + Math.cos(a) * rr * CROWN.r, -t.h + Math.sin(a) * rr * CROWN.r * 0.6, 0.9 + e.rnd() * 0.8, 0.6 + e.rnd() * 0.5, e.rnd(), 0, 7);
      q.fill();
    }
  }, [-CROWN.r - 1.5, -t.h - CROWN.r, CROWN.r + 2.5, 0.3]);
}
