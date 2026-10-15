// the chapter written on the wall and the crack of its choices: the trunk through what was chosen — a deep fissure,
// red deep inside; a hairline to what could have been; barely a line to what was never reached. Painted whole, once a
// map: the base — the red glow deep in it (its shader's emission); layer 1 — the inscription; 2 — the rows' words;
// 3 — the crack. How far down the wall it has come (`reveal`) is its shader's (crack.glsl): nothing is painted again as
// it comes down.
var A = e.aspect;
var st = e.state;
var lib = e.lib;
var HAIR = lib.HAIR;
var measure = function (s, size, italic) {
  g.font = lib.font(size, italic);
  return g.measureText(s).width / 1000;
};
var L = lib.layout(A, { map: st.map, chapter_number: st.chapter_number, chapter_title: st.chapter_title }, measure);

// words chalked on the stone: a dark halo under them so they read on it, then the chalk, faintly grainy
function carve(c, lines, x, y, size, color, alpha, italic, align) {
  if (alpha <= 0.01 || !lines.length) return;
  c.save();
  c.translate(x, y);
  c.scale(0.001, 0.001);
  c.font = lib.font(size, italic);
  c.textAlign = align || "center";
  c.textBaseline = "middle";
  var lh = size * 1250;
  for (var i = 0; i < lines.length; i++) {
    var ly = i * lh;
    c.shadowColor = "rgba(0, 0, 0, 0.95)";
    c.shadowBlur = Math.max(0.002, size * 0.25); // (a painting's units: stage heights)
    c.globalAlpha = alpha * 0.8;
    c.fillStyle = "#0a0708";
    c.fillText(lines[i], 0, ly);
    c.shadowBlur = 0;
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.fillText(lines[i], 0, ly);
  }
  c.restore();
}
function line(c, pts) {
  c.beginPath();
  for (var i = 0; i < pts.length; i++) {
    if (i) c.lineTo(pts[i][0], pts[i][1]);
    else c.moveTo(pts[i][0], pts[i][1]);
  }
}
// a red glow deep in the stone (the base: what the shader makes shine)
function ember(x, y, r, rgb, a) {
  var gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, "rgba(" + rgb + "," + a + ")");
  gr.addColorStop(1, "rgba(" + rgb + ",0)");
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, 2 * r, 2 * r);
}

// 1 — the inscription
e.layer("title", {}, function (c) {
  if (L.number) carve(c, [L.number], L.numberX, L.numberY, L.numberSize, "#d9ccb2", 0.9, false, "left");
  if (L.title) carve(c, [L.title], L.titleX, L.titleY, L.titleSize, "#f1e7d2", 1, true, "left");
});

// 2 — the rows: what was asked, on the left; under each point, what it was
e.layer("words", {}, function (c) {
  for (var ri = 0; ri < L.rows.length; ri++) {
    var R = L.rows[ri];
    var big = R.weight === "⚑";
    carve(c, R.title.lines, R.x, R.ty, R.title.size, big ? "#e8dcc3" : "#cfc3ac", R.seen ? 1 : 0.45, true, "right");
    for (var oi = 0; oi < R.options.length; oi++) {
      var O = R.options[oi];
      var words = O.label;
      if (O.state === "chosen") carve(c, words.lines, O.x + O.side * 0.03, O.ly, words.size, "#fff6e4", 1, false, O.side > 0 ? "left" : "right");
      else carve(c, words.lines, O.x, O.ly, words.size, "#b5aa96", 0.8, true);
    }
  }
});

// 3 — the crack
e.layer("crack", {}, function (c) {
  c.lineCap = "round";
  c.lineJoin = "round";
  // what could have been: hairlines; what was never reached: barely there
  for (var b = 0; b < L.branches.length; b++) {
    var br = L.branches[b];
    var open = br.state === "open";
    line(c, br.pts);
    c.strokeStyle = open ? "rgba(4, 3, 4, 0.95)" : "rgba(6, 5, 6, 0.4)";
    c.lineWidth = open ? 1.6 * HAIR : HAIR;
    c.stroke();
    if (open) {
      c.save();
      c.translate(0.7 * HAIR, 0.9 * HAIR);
      line(c, br.pts);
      c.strokeStyle = "rgba(196, 184, 160, 0.13)";
      c.lineWidth = HAIR;
      c.stroke();
      c.restore();
    }
  }
  // the trunk: a fissure, wider and narrower as it goes
  var T = L.trunk;
  var left = [];
  var right = [];
  for (var i = 0; i < T.length; i++) {
    var p = T[i];
    var a = T[Math.max(0, i - 1)];
    var q = T[Math.min(T.length - 1, i + 1)];
    var dx = q[0] - a[0];
    var dy = q[1] - a[1];
    var d = Math.hypot(dx, dy) || 1;
    var u = i / (T.length - 1);
    var w = (0.0075 + 0.005 * e.anim.noise(i * 0.12, 5) + 0.002 * e.anim.hash(i, 6)) * Math.min(1, 0.3 + u * 5) * Math.min(1, (1 - u) * 8 + 0.2);
    w = Math.max(w, 2.2 * HAIR);
    var k = 0.5 + 0.3 * e.anim.hash(i, 9);
    left.push([p[0] - (dy / d) * w * 0.5, p[1] + (dx / d) * w * 0.5]);
    right.push([p[0] + (dy / d) * w * k, p[1] - (dx / d) * w * k]);
  }
  // the stone broken off around it
  for (var sp = 0; sp < L.spurs.length; sp++) {
    line(c, L.spurs[sp]);
    c.strokeStyle = "rgba(4, 3, 4, 0.85)";
    c.lineWidth = 1.2 * HAIR;
    c.stroke();
  }
  // the shadow of its depth around it
  line(c, T);
  c.strokeStyle = "rgba(0, 0, 0, 0.35)";
  c.lineWidth = 0.014;
  c.stroke();
  // the fissure
  c.beginPath();
  c.moveTo(left[0][0], left[0][1]);
  for (var l = 1; l < left.length; l++) c.lineTo(left[l][0], left[l][1]);
  for (var r = right.length - 1; r >= 0; r--) c.lineTo(right[r][0], right[r][1]);
  c.closePath();
  c.fillStyle = "#040203";
  c.fill();
  // red, deep inside
  line(c, T);
  c.save();
  c.shadowColor = "rgba(170, 30, 20, 0.8)";
  c.shadowBlur = 0.004;
  c.strokeStyle = "rgba(110, 20, 14, 0.5)";
  c.lineWidth = 1.2 * HAIR;
  c.stroke();
  c.restore();
  // its lit lip
  line(c, right);
  c.strokeStyle = "rgba(200, 186, 160, 0.16)";
  c.lineWidth = HAIR;
  c.stroke();
  // the points of the options: the chosen a hole, the open a pit
  for (var ri = 0; ri < L.rows.length; ri++) {
    var R = L.rows[ri];
    for (var oi = 0; oi < R.options.length; oi++) {
      var O = R.options[oi];
      if (O.state === "chosen") {
        c.beginPath();
        c.ellipse(O.x, O.y, 0.009, 0.007, 0.4, 0, 6.283);
        c.fillStyle = "#030202";
        c.fill();
      } else if (O.state === "open") {
        c.beginPath();
        c.arc(O.x, O.y, 0.0035, 0, 6.283);
        c.fillStyle = "rgba(4, 3, 4, 0.9)";
        c.fill();
      }
    }
  }
});

// the base: the red deep in the trunk, and round each chosen point
for (var k2 = 4; k2 < L.trunk.length; k2 += 7) ember(L.trunk[k2][0], L.trunk[k2][1], 0.035, "154, 32, 20", 0.12);
for (var ri2 = 0; ri2 < L.rows.length; ri2++) {
  var C = L.rows[ri2].chosen;
  if (C) ember(C.x, C.y, 0.03, "176, 38, 26", 0.3);
}
