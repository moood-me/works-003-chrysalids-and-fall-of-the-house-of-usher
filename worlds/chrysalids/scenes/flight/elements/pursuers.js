// The pursuit's lanterns on the far ridge (1.2 km off): fourteen glows along its rise, each its own e.light (its animate
// brings in as many as `pursuers` says and makes each one tremble and bob)
const R = x => {
  let r = 12 + 70 * Math.exp(-Math.pow((x + 820) / 380, 2)) + 30 * Math.exp(-Math.pow((x + 1500) / 300, 2)) + 6 * Math.sin(x * 0.0045) + 4 * Math.sin(x * 0.013);
  if (x > -200) r *= Math.max(0.25, 1 - (x + 200) / 1200);
  return r;
};
for (let j = 0; j < 14; j++) {
  const x = -1100 + (j / 13) * 900 + (e.rnd() - 0.5) * 40, y = -R(x) - 3.5;
  e.layer(`l${j}`, { box: [x - 4, y - 4, x + 4, y + 4] }, q => {
    q.fillStyle = '#f0d098';
    q.beginPath();
    q.arc(x, y, 2.2, 0, 7);
    q.fill();
  });
  e.light(x, y, 14, '#e0b070', 1, `l${j}`);
}
