// the torch while it stands in its holder on the far arch's right pillar (until the narrator takes it: narrator_with
// ["torch"] — then it is his, the cast's part, and this paints nothing): its staff, the pitch-soaked head; its points —
// grip (where a hand takes it) and flame (where it burns: the fire is the scene's particles holder_fire, its light the
// glow here — the scene's light holder)
if (e.lib.held(e.state)) return;
e.at(0.0, -1.52, "grip");
g.strokeStyle = "#5a4232";
g.lineWidth = 0.032;
g.lineCap = "round";
g.beginPath();
g.moveTo(-0.01, -1.38);
g.lineTo(0.02, -1.78);
g.stroke();
g.strokeStyle = "#2a1d15";
g.lineWidth = 0.05;
g.beginPath();
g.moveTo(0.018, -1.74);
g.lineTo(0.021, -1.8);
g.stroke();
e.at(0.02, -1.82, "flame");
e.light(0.02, -1.9, 3.0, "#f0a860", 0.9);
