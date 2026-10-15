// Лагерь Окраин (engine 3): what its elements and its script share — a hut of the Fringes, where the people of the camp
// stand (and from what `people` on each is there), the captives' post.
// a hut: poles leaned together into a cone, bark and branches over them, a dark door-hole (painted once, in its colours)
function hut(g, e, h) {
  g.fillStyle = '#6e604c';
  g.beginPath();
  g.moveTo(-2.0, 0.2);
  g.quadraticCurveTo(-1.0, -h * 0.6, 0, -h);
  g.quadraticCurveTo(1.0, -h * 0.6, 2.0, 0.2);
  g.closePath();
  g.fill();
  g.strokeStyle = '#5a4c3a';
  g.lineWidth = 0.06;
  for (let i = 0; i < 9; i++) {
    const x = -1.8 + i * 0.45;
    g.beginPath(); g.moveTo(x, 0.2); g.lineTo(x * 0.1, -h - 0.35); g.stroke();
  }
  g.fillStyle = '#4a5440';
  for (let i = 0; i < 40; i++) {
    const y = -e.rnd() * h * 0.9, w = (1 - (-y) / h) * 1.8;
    g.beginPath(); g.ellipse((e.rnd() * 2 - 1) * w, y, 0.25, 0.08, e.rnd(), 0, 7); g.fill();
  }
  g.fillStyle = '#2e2a26';
  g.beginPath();
  g.moveTo(-0.45, 0.2);
  g.quadraticCurveTo(0, -1.5, 0.45, 0.2);
  g.closePath();
  g.fill();
}
// the people of the camp: who each is, where they stand (across, distance), turned how, doing what; from what `people` each
// is there (the tall guard always; the long-armed one at 0.2; the hunchback 0.4; the one sitting by the fire 0.6; the
// second guard 0.8); on `alarm` the sitting one gets up, the guards' spears come round, the tall guard blows his horn
const FIRE = [-0.74, 6.2];
const PEOPLE = [
  { id: 'guard', who: 'guard', at: [-2.23, 7.07], turn: 160, does: 'stand', from: 0 },
  { id: 'spider', who: 'spider', at: [0.37, 6.82], turn: 200, does: 'stand', from: 0.2 },
  { id: 'hunch', who: 'hunchback', at: [-1.49, 5.7], turn: 120, does: 'stand', from: 0.4 },
  { id: 'sitter', who: 'fringe_man', at: [-1.8, 6.7], turn: 140, does: 'sit_knees', from: 0.6 },
  { id: 'woman', who: 'fringe_woman', at: [1.12, 7.69], turn: 210, does: 'stand', from: 0.7 },
  { id: 'guard2', who: 'guard', at: [2.36, 6.45], turn: 220, does: 'stand', from: 0.8 },
];
const POST = [-3.66, 6.94];
const SOPHIE = { at: [2.5, 5.2], hut: [5.0, 9.6] };
return { hut, FIRE, PEOPLE, POST, SOPHIE };
