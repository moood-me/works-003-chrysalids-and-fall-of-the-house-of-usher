// Where everything stands on the wall for a state: the inscription, the rows of the map, the crack
// through them (its trunk through the chosen options, a branch to each other one) and the knot at its
// end. In stage heights, as the sky elements paint. measure(text, size, italic) → its width.
//   Sizes are shares of the frame's height, the same on every screen (a painting is drawn sharp at any size): the
// smallest words 0.05 of it — 18 px on a phone held sideways.
var hash = anim.hash;
var clamp = anim.clamp;
var smooth = anim.ease.smooth;
var FONT = 'Georgia, "Times New Roman", serif';

function font(size, italic) {
  return (italic ? "italic " : "") + Math.round(size * 1000) + "px " + FONT;
}

// a crack from a to b: a line that wanders, broken finer as it goes, its ends where they are
function jag(a, b, seed, amp) {
  var dx = b[0] - a[0];
  var dy = b[1] - a[1];
  var len = Math.hypot(dx, dy) || 1e-6;
  var n = Math.max(2, Math.ceil(len / 0.009));
  var nx = -dy / len;
  var ny = dx / len;
  var pts = [a];
  for (var i = 1; i < n; i++) {
    var u = i / n;
    var s = u * len;
    var off = amp * (anim.noise(s / 0.07, seed) + 0.4 * anim.noise(s / 0.018, seed + 5) + 0.25 * (hash(i, seed + 9) - 0.5));
    pts.push([a[0] + dx * u + nx * off * Math.sqrt(Math.sin(Math.PI * u)), a[1] + dy * u + ny * off * Math.sqrt(Math.sin(Math.PI * u))]);
  }
  pts.push(b);
  return pts;
}

// words into lines no wider than w, at most `most` of them — smaller if they must be (down to
// `least` of the size) → {lines, size, fits: whether they did}; at the least, cut short with «…»
function wrap(text, w, size, italic, measure, most, least) {
  var words = String(text).split(/\s+/).filter(Boolean);
  for (var k = 1; ; k -= 0.05) {
    var s = size * k;
    var lines = [];
    var line = "";
    var wide = 0;
    for (var i = 0; i < words.length; i++) {
      var next = line ? line + " " + words[i] : words[i];
      if (line && measure(next, s, italic) > w) {
        lines.push(line);
        line = words[i];
      } else line = next;
    }
    if (line) lines.push(line);
    for (var l = 0; l < lines.length; l++) wide = Math.max(wide, measure(lines[l], s, italic));
    if (lines.length <= most && wide <= w) return { lines: lines, size: s, fits: true };
    if (k <= (least || 0.8) + 1e-6) {
      if (lines.length > most) {
        lines = lines.slice(0, most);
        lines[most - 1] += "…";
      }
      return { lines: lines, size: s, fits: false };
    }
  }
}
// how tall lines of words are
var tall = function (t) {
  return t.lines.length ? t.size * (1 + 1.25 * (t.lines.length - 1)) : 0;
};

function layout(A, st, measure) {
  var map = Array.isArray(st.map) && st.map.length ? st.map : null;
  var cx = A / 2;
  var L = {
    number: String(st.chapter_number || ""),
    title: String(st.chapter_title || ""),
    numberSize: map ? 0.06 : 0.07,
    titleSize: map ? 0.075 : 0.085,
    rows: [],
    branches: [],
  };
  // the chapter's number over its title — or, over a map, beside it on one line (below the site's header)
  var nw = measure(L.number, L.numberSize, false);
  var tw = measure(L.title, L.titleSize, true);
  var side;
  if (map) {
    L.numberY = L.titleY = 0.19;
    side = (nw + (nw ? 0.03 : 0) + tw) / 2;
    L.numberX = cx - side;
    L.titleX = cx + side - tw;
  } else {
    L.numberY = 0.33;
    L.titleY = L.numberY + 0.11;
    side = Math.max(nw, tw) / 2;
    L.numberX = cx - nw / 2;
    L.titleX = cx - tw / 2;
  }
  // the crack comes down past the inscription, not through it
  var start = [cx + side + 0.2, -0.35];
  var under = [cx + side + 0.03, L.titleY + (map ? 0.07 : 0.12)];
  var anchors = [start, under];
  if (!map) {
    L.knot = [cx + 0.02, L.titleY + 0.27];
  } else {
    var n = map.length;
    // the stage is 16:9; the narrowest screen (4:3, a phone held upright) sees only its middle
    var M = (A - 4 / 3) / 2 + 0.03;
    var X0 = M + 0.4;
    var X1 = A - M;
    var head = L.titleY + L.titleSize * 0.75; // the rows begin below the inscription
    var floor = 0.9; // and end above this (the knot under them)
    var PAD = 0.025; // between the rows
    // the rows at a size (fit: of the full one), each its words measured: where they stand around
    // its line (up, down), the trunk's way through them left to right
    var lay = function (fit) {
      var labelSize = 0.05 * fit;
      var rowSize = 0.05 * fit;
      var out = [];
      var x = under[0];
      for (var k = 0; k < n; k++) {
        var row = map[k] || {};
        var opts = Array.isArray(row.options) ? row.options : [];
        var m = Math.max(1, opts.length);
        var cell = (X1 - X0) / m;
        var R = {
          x: X0 - 0.03,
          title: wrap(row.title || "", X0 - 0.03 - M, rowSize, true, measure, 2),
          weight: row.weight,
          seen: opts.some(function (o) {
            return o.state !== "unseen";
          }),
          options: [],
          chosen: null,
          stagger: false,
        };
        for (var j = 0; j < opts.length; j++) {
          var o = opts[j] || {};
          var state = o.state === "chosen" || o.state === "open" ? o.state : "unseen";
          var O = {
            // a little off the grid, as a crack would go
            x: X0 + (j + 0.5) * cell + (hash(j, 31 + k) - 0.5) * cell * 0.18,
            dy: (hash(j, 47 + k) - 0.5) * 0.012,
            state: state,
            label: state === "chosen" ? wrap(o.label || "", 0.5, labelSize * 1.12, false, measure, 2) : wrap(state === "open" ? o.label || "" : "", cell - 0.025, labelSize, true, measure, 2),
          };
          R.options.push(O);
          if (state === "chosen" && !R.chosen) R.chosen = O;
        }
        // open words too wide for their place: every other one a line lower, each twice as wide
        R.stagger = R.options.some(function (O) {
          return O.state === "open" && !O.label.fits;
        });
        if (R.stagger)
          for (var q = 0; q < R.options.length; q++) {
            var Q = R.options[q];
            if (Q.state === "open") Q.label = wrap(opts[q].label || "", 2 * cell - 0.03, labelSize, true, measure, 1, 0.7);
          }
        var widest = function (t, italic) {
          var v = 0;
          for (var w = 0; w < t.lines.length; w++) v = Math.max(v, measure(t.lines[w], t.size, italic));
          return v;
        };
        // where each open option's words stand across the wall
        for (var b = 0; b < R.options.length; b++) {
          var B = R.options[b];
          var bw = B.state === "open" ? widest(B.label, true) / 2 + 0.01 : 0;
          B.span = [B.x - bw, B.x + bw];
        }
        var C = R.chosen;
        var ch = C ? tall(C.label) / 2 : 0;
        if (C) {
          // its words beside it: on the side where they cover fewest of the others' words, else away
          // from where the crack comes from (it leaves straight down); within the wall
          var wide = widest(C.label, false);
          var span = function (side) {
            return side > 0 ? [C.x + 0.03, C.x + 0.03 + wide] : [C.x - 0.03 - wide, C.x - 0.03];
          };
          var cover = function (side) {
            var c = span(side);
            if (c[0] < X0 || c[1] > X1) return Infinity;
            var v = 0;
            for (var b2 = 0; b2 < R.options.length; b2++) {
              var S = R.options[b2].span;
              v += Math.max(0, Math.min(c[1], S[1]) - Math.max(c[0], S[0]));
            }
            return v;
          };
          var away = x > C.x + 0.02 ? -1 : 1;
          C.side = cover(-away) < cover(away) ? -away : away;
          C.span = span(C.side);
          x = C.x;
        }
        // the open words under their points — lower, below the chosen words, where those are over them
        var below = 0;
        for (var b3 = 0; b3 < R.options.length; b3++) {
          var B3 = R.options[b3];
          if (B3.state !== "open") continue;
          var covered = C && Math.min(C.span[1], B3.span[1]) > Math.max(C.span[0], B3.span[0]);
          B3.ly = (covered ? ch + 0.008 : 0.014) + B3.dy + B3.label.size * 0.6 + (R.stagger && b3 % 2 ? B3.label.size * 1.2 : 0);
          below = Math.max(below, B3.ly + tall(B3.label) - B3.label.size * 0.5);
        }
        var th = tall(R.title) / 2;
        R.up = Math.max(ch, th, 0.012) + 0.006;
        R.down = Math.max(ch, th, below, 0.012);
        out.push(R);
      }
      return out;
    };
    var rows;
    var need;
    for (var fit = 1; ; fit -= 0.05) {
      rows = lay(fit);
      need = PAD * (n - 1);
      for (var r = 0; r < n; r++) need += rows[r].up + rows[r].down;
      if (need <= floor - head || fit <= 0.55) break;
    }
    // room to spare: the rows further apart (not too far), the whole a little high of the middle
    var spare = Math.max(0, floor - head - need);
    var pad = PAD + Math.min(0.05, spare / (n + 1));
    var y = head + Math.max(0, spare - (pad - PAD) * (n - 1)) * 0.35;
    for (var k = 0; k < n; k++) {
      var R = rows[k];
      y += R.up;
      R.y = y;
      R.ty = y - (tall(R.title) - R.title.size) / 2;
      for (var o2 = 0; o2 < R.options.length; o2++) {
        var O = R.options[o2];
        O.y = y + O.dy;
        if (O === R.chosen) O.ly = O.y - (tall(O.label) - O.label.size) / 2;
        else O.ly = y + (O.ly || 0);
      }
      // the trunk goes through the chosen option; a row with none chosen it passes by
      var prev = anchors[anchors.length - 1];
      var through = R.chosen ? [R.chosen.x, R.chosen.y] : [prev[0], y];
      for (var q2 = 0; q2 < R.options.length; q2++) {
        var B2 = R.options[q2];
        if (B2 === R.chosen) continue;
        var u = 0.5 + hash(q2, 59 + k) * 0.2;
        var root = [prev[0] + (through[0] - prev[0]) * u, prev[1] + (through[1] - prev[1]) * u];
        L.branches.push({ state: B2.state, pts: jag(root, [B2.x, B2.y], 101 + k * 13 + q2, B2.state === "open" ? 0.012 : 0.008) });
      }
      anchors.push(through);
      if (R.chosen) anchors.push([through[0] + (hash(k, 67) - 0.5) * 0.02, through[1] + Math.min(0.05, R.down + pad * 0.5)]);
      L.rows.push(R);
      y += R.down + pad;
    }
    var last = anchors[anchors.length - 1];
    L.knot = [last[0] + (hash(n, 71) - 0.5) * 0.06, Math.min(0.95, last[1] + 0.07)];
  }
  anchors.push(L.knot);
  var trunk = [];
  for (var a = 0; a + 1 < anchors.length; a++) {
    var piece = jag(anchors[a], anchors[a + 1], 7 + a * 11, a === 0 ? 0.03 : 0.018);
    trunk = trunk.concat(a ? piece.slice(1) : piece);
  }
  L.trunk = trunk;
  // short cracks off the trunk, as stone breaks
  L.spurs = [];
  for (var sp = 6; sp < trunk.length - 4; sp += 5 + Math.floor(hash(sp, 83) * 9)) {
    var from = trunk[sp];
    var side = hash(sp, 89) < 0.5 ? -1 : 1;
    var ang = Math.PI / 2 + side * (0.5 + hash(sp, 97) * 0.8);
    var sl = 0.008 + hash(sp, 101) * 0.026;
    L.spurs.push(jag(from, [from[0] + Math.cos(ang) * sl, from[1] + Math.sin(ang) * sl], 300 + sp, 0.004));
  }
  return L;
}


// how far down the wall the crack has come for `reveal` 0…1 (stage heights) — the shaders' (crack.glsl, knot.glsl) the
// same: from above the frame to the frame's foot, easing in and out; the knot lies above it
var REVEAL = [-0.04, 0.98];
// the finest line drawn: a hair of the stone (about a pixel of a 1080-px frame)
var HAIR = 0.001;
return { layout: layout, font: font, REVEAL: REVEAL, HAIR: HAIR };
