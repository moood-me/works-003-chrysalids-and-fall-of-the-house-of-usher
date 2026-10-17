// the even ears of Waknuk's last field in the near foreground (3 m): upright, all alike — layers stirring a little
for (let k = 0; k < 4; k++) {
  e.layer(`r${k}`, { pivot: [-8 + k * 4 + 2, 0.4], wind: { strength: 0.25, gust: 0.4 }, box: [-8.3 + k * 4, -1.2, -3.7 + k * 4, 0.4] }, q => {
    q.strokeStyle = '#a49460';
    q.fillStyle = '#a49460';
    q.lineWidth = 0.012;
    for (let i = 0; i < 60; i++) {
      const x = -8 + k * 4 + e.rnd() * 4, h = 0.85 + 0.08 * e.rnd();
      q.beginPath(); q.moveTo(x, 0.4); q.lineTo(x + 0.02, 0.4 - h); q.stroke();
      q.beginPath(); q.ellipse(x + 0.02, 0.4 - h - 0.05, 0.015, 0.05, 0.1, 0, 7); q.fill();
    }
  });
}
