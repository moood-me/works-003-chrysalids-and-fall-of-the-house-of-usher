// The wish — a third hand, pale as a thought, out of the boy's side to the knot on his hand (slip): an arm in two pieces
// and a hand, each a layer painted once, unit-long, hanging from its pivot; its animate lays them each frame between his
// chest and his right hand (e.point) as far as `wish` has grown, and fades them
const pale = 'rgba(250,244,226,0.75)', soft = 'rgba(236,224,196,0.32)';
for (const [name, w] of [['upper', 0.07], ['fore', 0.06]]) {
  e.layer(name, { pivot: [0, 0], blend: 'add', box: [-1.4, -1.4, 1.4, 1.4] }, q => {
    q.lineCap = 'round';
    q.strokeStyle = soft;
    q.lineWidth = w;
    q.beginPath();
    q.moveTo(0, 0);
    q.lineTo(0, 1);
    q.stroke();
    q.strokeStyle = pale;
    q.lineWidth = w * 0.35;
    q.beginPath();
    q.moveTo(0, 0);
    q.lineTo(0, 1);
    q.stroke();
  });
}
e.layer('hand', { pivot: [0, 0], blend: 'add', box: [-1.4, -1.4, 1.4, 1.4] }, q => {
  q.fillStyle = soft;
  q.beginPath();
  q.ellipse(0, 0.03, 0.05, 0.04, 0, 0, 7);
  q.fill();
  q.strokeStyle = pale;
  q.lineCap = 'round';
  q.lineWidth = 0.016;
  for (let i = 0; i < 5; i++) {
    const a = Math.PI / 2 - 0.9 + i * 0.45, l = i === 0 ? 0.045 : 0.07;
    q.beginPath();
    q.moveTo(Math.cos(a) * 0.04, 0.03 + Math.sin(a) * 0.04);
    q.lineTo(Math.cos(a) * (0.04 + l), 0.03 + Math.sin(a) * (0.04 + l));
    q.stroke();
  }
});
