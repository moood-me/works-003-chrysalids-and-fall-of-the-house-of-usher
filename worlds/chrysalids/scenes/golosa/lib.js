// Голоса (engine 3): what its elements share — where the farms' windows are on the stage (x, a share of the 16:9
// stage's width; their order is the order the game calls them: farm1 … farm8; home — Petra's window), where David
// sits (his aura and the threads' start on the sky, stage heights), the horizon; a farm's buildings (their kinds), and
// a farm window's life (its animate: lit as `count` says).
const HZ = 0.66;
const W = { farm1: 0.52, farm2: 0.74, farm3: 0.8, farm4: 0.59, farm5: 0.45, farm6: 0.665, farm7: 0.22, farm8: 0.36, home: 0.7 };
const ORDER = ['farm1', 'farm2', 'farm3', 'farm4', 'farm5', 'farm6', 'farm7', 'farm8'];
const DAVID = [-1.89, 4.6];
const AURA = A => [0.27 * A, 0.53];
// a farm's buildings, in daylight colours (the night is the scene's): kind — 'barn', 'mill' (its sails a layer:
// `sails`, turning), 'poplars' (layers in the wind), 'silo', 'elms', 'poplar', 'farmill' (far mill), 'tall'
function farm(g, e, kind) {
  const C = '#5a5650', R = '#4a4448';
  const house = (w, h, r) => { g.fillStyle = C; g.beginPath(); g.moveTo(-w, 0.05); g.lineTo(-w, -h); g.lineTo(0, -r); g.lineTo(w, -h); g.lineTo(w, 0.05); g.closePath(); g.fill(); g.fillStyle = R; g.beginPath(); g.moveTo(-w - 0.2, -h); g.lineTo(0, -r - 0.1); g.lineTo(w + 0.2, -h); g.lineTo(w, -h + 0.25); g.lineTo(0, -r + 0.2); g.lineTo(-w, -h + 0.25); g.closePath(); g.fill(); };
  const poplar = (x, h, name) => e.layer(name, { pivot: [x, 0], wind: { strength: 0.2, gust: 0.3 }, box: [x - h * 0.2, -h - 0.5, x + h * 0.2, 0.1] }, q => {
    q.fillStyle = '#3e4a34'; q.beginPath(); q.moveTo(x - 0.3, 0); q.quadraticCurveTo(x - h * 0.13, -h * 0.5, x, -h); q.quadraticCurveTo(x + h * 0.13, -h * 0.5, x + 0.3, 0); q.fill();
  });
  const mill = (x, h, r, name) => {
    g.fillStyle = C; g.beginPath(); g.moveTo(x - 1.2, 0.05); g.lineTo(x + 1.2, 0.05); g.lineTo(x + 0.15, -h); g.lineTo(x - 0.15, -h); g.closePath(); g.fill();
    e.layer(name, { pivot: [x, -h - 0.4], box: [x - r - 0.3, -h - 0.4 - r - 0.3, x + r + 0.3, -h - 0.4 + r + 0.3] }, q => {
      q.strokeStyle = '#6a6460'; q.lineWidth = 0.22; q.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; q.beginPath(); q.moveTo(x, -h - 0.4); q.lineTo(x + Math.cos(a) * r, -h - 0.4 + Math.sin(a) * r); q.stroke(); }
    });
  };
  if (kind === 'barn') { house(2.5, 3, 4.6); g.fillStyle = '#6a4a3e'; g.beginPath(); g.moveTo(-14, 0.05); g.lineTo(-14, -4); g.lineTo(-12.6, -6.4); g.lineTo(-9.5, -7.6); g.lineTo(-6.4, -6.4); g.lineTo(-5, -4); g.lineTo(-5, 0.05); g.closePath(); g.fill(); }
  if (kind === 'mill') { house(2.4, 2.8, 4.3); mill(6, 8.6, 1.9, 'sails'); }
  if (kind === 'poplars') { house(2.2, 2.8, 4.2); poplar(-4.2, 11, 'p0'); poplar(-6.2, 13.5, 'p1'); poplar(-8.3, 10, 'p2'); }
  if (kind === 'silo') { house(2.6, 2.6, 4); g.fillStyle = '#6a6660'; g.fillRect(3.6, -6.5, 2.4, 6.55); g.beginPath(); g.arc(4.8, -6.5, 1.2, Math.PI, 0); g.fill(); }
  if (kind === 'elms') {
    g.fillStyle = '#3e4a34';
    for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(-7 + Math.sin(i * 2.1) * 2, -6.5 - Math.cos(i * 1.7) * 1.8, 2.8, 2.3, 0, 0, 7); g.fill(); }
    g.fillStyle = '#4a3e34'; g.fillRect(-7.3, -4, 0.6, 4);
    g.fillStyle = C; g.beginPath(); g.moveTo(-4, 0.05); g.lineTo(-4, -2.3); g.lineTo(-2.6, -3.4); g.lineTo(3.2, -3.4); g.lineTo(4, -2.3); g.lineTo(4, 0.05); g.closePath(); g.fill();
  }
  if (kind === 'poplar') { house(2.3, 2.6, 3.9); poplar(5, 11, 'p0'); }
  if (kind === 'farmill') { house(2.3, 2.6, 4); mill(-5.3, 8, 1.8, 'sails'); }
  if (kind === 'tall') { house(2.2, 2.4, 3.7); poplar(-3.9, 10, 'p0'); }
  if (kind === 'home') {
    g.fillStyle = '#3e4a34';
    for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-8 + Math.sin(i * 2.1) * 2, -7.5 - Math.cos(i * 1.7) * 2.2, 2.6, 2.2, 0, 0, 7); g.fill(); }
    g.fillStyle = '#4a3e34'; g.fillRect(-8.3, -4.5, 0.6, 4.5);
    poplar(5.6, 10, 'p0'); poplar(7.2, 8.5, 'p1');
    g.fillStyle = C; g.beginPath(); g.moveTo(-3.2, 0.05); g.lineTo(-3.2, -3.4); g.lineTo(-3.6, -3.4); g.lineTo(0, -6); g.lineTo(3.6, -3.4); g.lineTo(3.2, -3.4); g.lineTo(3.2, 0.05); g.closePath(); g.fill();
    g.fillRect(1.4, -6.3, 0.55, 1.8);
  }
}
// a farm window: the dull pane, the lit pane a layer (`lit`) and its light (`win`: its glow as wide on the screen near
// or far — a warm star on the dark valley) — its point `window`
function pane(g, e, w, h) {
  g.fillStyle = '#4a3828';
  g.fillRect(-w / 2, -h, w, h);
  e.layer('lit', {}, q => { q.fillStyle = '#eeba70'; q.fillRect(-w / 2, -h, w, h); });
  e.light(0, -h / 2, 0.035 * e.spot.distance, '#e8b06a', 3, 'win');
  e.at(0, -h / 2, 'window');
  e.at(0, -h / 2);
}
// its life: lit while it is among the first `count` called (else a dim glow left), breathing a little; the buildings'
// sails turning and poplars swaying are their own element's
function paneAnim(e, k) {
  const n = Math.round(e.state.count ?? 4), on = k < n;
  const b = on ? 0.85 + 0.15 * Math.sin(e.t * 0.5 + k * 1.3) : 0.3;
  e.layer('lit').alpha = b;
  e.glow('win', on ? b : 0.3);
}
return { HZ, W, ORDER, DAVID, AURA, farm, pane, paneAnim };
