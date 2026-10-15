// The calf (painted once in its own colours — a muted red-brown, the scene's one colour accent): a round belly and rump,
// a bony withers, a big low head — and legs a little too long, knobbly (the Offence the eye can find). Its legs, head and
// tail are layers (calf.animate.js walks the legs as it is led, nods the head, swishes the tail). It faces left (toward the
// barn). Its points: head, back, tail, legs (the game's «Найди раньше него»), ring (its halter's ring: the rope's end)
const coat = '#8a4e34', dark = '#5e3424', pale = '#c08a66', hoof = '#2a211b';
const leg = (name, x, y0, hind) => e.layer(name, { pivot: [x, y0], box: [x - 0.25, y0 - 0.1, x + 0.25, 0.1] }, q => {
  q.fillStyle = dark;
  q.lineCap = 'round';
  const k = hind ? 0.08 : -0.01;
  q.strokeStyle = coat;
  q.lineWidth = hind ? 0.11 : 0.09;
  q.beginPath(); q.moveTo(x, y0); q.lineTo(x + k, y0 + 0.36); q.stroke();
  q.lineWidth = 0.045;
  q.beginPath(); q.moveTo(x + k, y0 + 0.36); q.lineTo(x + k * 0.5, -0.05); q.stroke();
  q.fillStyle = pale;
  q.beginPath(); q.ellipse(x + k, y0 + 0.36, 0.04, 0.05, 0, 0, 7); q.fill();
  q.fillStyle = hoof;
  q.fillRect(x + k * 0.5 - 0.04, -0.06, 0.08, 0.06);
});
leg('leg_fn', -0.3, -0.7, false);
leg('leg_hn', 0.36, -0.74, true);
leg('leg_ff', -0.22, -0.7, false);
leg('leg_hf', 0.44, -0.74, true);
e.layer('body', { box: [-0.6, -1.2, 0.65, -0.5] }, q => {
q.fillStyle = coat;
q.beginPath();
q.moveTo(-0.36, -0.7);
q.bezierCurveTo(-0.46, -0.76, -0.5, -0.92, -0.43, -1.01);
q.bezierCurveTo(-0.37, -1.07, -0.31, -1.11, -0.23, -1.1);
q.bezierCurveTo(-0.05, -1.06, 0.18, -1.06, 0.32, -1.06);
q.bezierCurveTo(0.38, -1.09, 0.44, -1.08, 0.48, -1.02);
q.bezierCurveTo(0.56, -0.95, 0.57, -0.8, 0.51, -0.73);
q.bezierCurveTo(0.45, -0.66, 0.3, -0.66, 0.19, -0.65);
q.bezierCurveTo(0.05, -0.58, -0.2, -0.59, -0.3, -0.66);
q.closePath();
q.fill();
q.fillStyle = pale;
q.beginPath(); q.ellipse(-0.05, -0.67, 0.22, 0.05, 0, 0, 7); q.fill();
});
e.layer('tail', { pivot: [0.5, -1.0], box: [0.3, -1.1, 0.8, -0.4] }, q => {
  q.strokeStyle = dark;
  q.lineWidth = 0.022;
  q.lineCap = 'round';
  q.beginPath(); q.moveTo(0.5, -1.0); q.quadraticCurveTo(0.57, -0.85, 0.55, -0.6); q.stroke();
  q.fillStyle = dark;
  q.beginPath(); q.ellipse(0.55, -0.57, 0.03, 0.06, 0, 0, 7); q.fill();
});
e.layer('head', { pivot: [-0.4, -0.98], box: [-0.85, -1.3, -0.3, -0.6] }, q => {
  q.fillStyle = coat;
  q.beginPath();
  q.moveTo(-0.4, -1.04); q.quadraticCurveTo(-0.6, -1.12, -0.7, -0.95); q.quadraticCurveTo(-0.76, -0.8, -0.7, -0.74);
  q.quadraticCurveTo(-0.62, -0.7, -0.55, -0.78); q.quadraticCurveTo(-0.46, -0.84, -0.38, -0.86); q.closePath(); q.fill();
  q.fillStyle = dark;
  q.beginPath(); q.ellipse(-0.6, -1.08, 0.08, 0.03, -0.6, 0, 7); q.fill();
  q.fillStyle = pale;
  q.beginPath(); q.ellipse(-0.71, -0.78, 0.05, 0.04, 0, 0, 7); q.fill();
  q.strokeStyle = '#3a3028';
  q.lineWidth = 0.015;
  q.beginPath(); q.moveTo(-0.45, -1.02); q.lineTo(-0.52, -0.78); q.moveTo(-0.66, -0.9); q.lineTo(-0.48, -0.92); q.stroke();
});
e.at(-0.66, -0.95, 'head');
e.at(0.05, -1.08, 'back');
e.at(0.52, -0.8, 'tail');
e.at(0.0, -0.32, 'legs');
