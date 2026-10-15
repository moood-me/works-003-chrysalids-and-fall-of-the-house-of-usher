// The pale figure in the upper window UW[2] — seen only in the water ("seen": "reflection": looking up, the window is
// empty); `reflection_figure` 0…1 how much (its animate). A cold dim light in the room behind her (it lights only what
// the tarn shows).
e.layer("her", {}, (g) => {
  e.lib.figure(g);
  e.light(e.lib.UW[2][0], -11.6, 2, "#c9d2d6", 0.3, "room");
});
