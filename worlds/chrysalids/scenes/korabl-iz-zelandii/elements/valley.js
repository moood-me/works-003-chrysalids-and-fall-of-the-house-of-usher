// the clearing and the valley under the wood (a plane seen from above): trodden grass, earth, paler where the fight was
g.fillStyle = '#6e6a58';
g.fillRect(-150, -39.5, 300, 79);
for (let i = 0; i < 160; i++) {
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(86,90,70,0.4)' : 'rgba(130,124,104,0.3)';
  g.beginPath();
  g.ellipse(-150 + e.rnd() * 300, -39 + e.rnd() * 78, 1 + e.rnd() * 4, 0.4 + e.rnd() * 1.4, e.rnd() * 3, 0, 7);
  g.fill();
}
