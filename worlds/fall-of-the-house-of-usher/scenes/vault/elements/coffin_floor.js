// the coffin's floor (seen from above, the head to the left): the satin it is lined with, a pillow under her head. Its
// point bed — where she lies (her floor, her hips over it)
g.fillStyle = "#b3a794";
g.fillRect(-0.98, -0.28, 1.96, 0.56);
var sg = g.createLinearGradient(0, -0.28, 0, 0.28);
sg.addColorStop(0, "rgba(40,32,26,0.35)");
sg.addColorStop(0.5, "rgba(40,32,26,0)");
sg.addColorStop(1, "rgba(40,32,26,0.35)");
g.fillStyle = sg;
g.fillRect(-0.98, -0.28, 1.96, 0.56);
g.fillStyle = "#d6ccba";
g.beginPath();
g.ellipse(-0.82, 0, 0.13, 0.19, 0, 0, 7);
g.fill();
e.at(-0.1, 0, "bed");
