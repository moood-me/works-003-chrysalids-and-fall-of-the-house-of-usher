var s = e.state || {},
  dk = s.dusk == null ? 0.2 : +s.dusk;
if (dk < 0.01) return;
g.save();
g.globalCompositeOperation = "multiply";
g.fillStyle = "rgba(120,105,150," + dk * 0.55 + ")";
g.fillRect(-8, -6, 16, 12);
g.restore();
