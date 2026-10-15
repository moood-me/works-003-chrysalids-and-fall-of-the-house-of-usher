// the end of the crack: a hole in the stone with an ember deep in it, glowing red on the stone round it — the player
// picks it to go on. Painted once a map, where the crack ends (lib.js layout); its breath and its coming as the crack
// reaches it are its shader's (knot.wgsl): the glow's heart (layer 1) and rim (2), the ember (3), shining.
var st = e.state;
var lib = e.lib;
var L = lib.layout(e.aspect, { map: st.map, chapter_number: st.chapter_number, chapter_title: st.chapter_title }, function (s, size, italic) {
  g.font = lib.font(size, italic);
  return g.measureText(s).width / 1000;
});
var x = L.knot[0];
var y = L.knot[1];
// the glow on the stone round it (also where a finger finds it): its heart, which breathes, and its rim, which stays
e.layer("heart", {}, function (c) {
  var heart = c.createRadialGradient(x, y, 0, x, y, 0.033);
  heart.addColorStop(0, "rgba(150, 36, 22, 0.32)");
  heart.addColorStop(1, "rgba(150, 36, 22, 0)");
  c.fillStyle = heart;
  c.fillRect(x - 0.033, y - 0.033, 0.066, 0.066);
});
e.layer("rim", {}, function (c) {
  var rim = c.createRadialGradient(x, y, 0, x, y, 0.06);
  rim.addColorStop(0, "rgba(90, 20, 14, 0.3)");
  rim.addColorStop(0.55, "rgba(70, 14, 10, 0.3)");
  rim.addColorStop(1, "rgba(30, 8, 6, 0)");
  c.fillStyle = rim;
  c.beginPath();
  c.arc(x, y, 0.06, 0, 6.283);
  c.fill();
});
// the ember deep in the hole
e.layer("ember", {}, function (c) {
  var ember = c.createRadialGradient(x, y, 0, x, y, 0.009);
  ember.addColorStop(0, "rgba(255, 120, 70, 0.85)");
  ember.addColorStop(0.5, "rgba(190, 40, 20, 0.55)");
  ember.addColorStop(1, "rgba(90, 10, 6, 0)");
  c.fillStyle = ember;
  c.beginPath();
  c.ellipse(x, y, 0.009, 0.007, -0.5, 0, 6.283);
  c.fill();
});
// the hole the crack ends in (the base)
g.beginPath();
g.ellipse(x, y, 0.013, 0.01, -0.5, 0, 6.283);
g.fillStyle = "#030102";
g.fill();
e.at(x, y, "end");
