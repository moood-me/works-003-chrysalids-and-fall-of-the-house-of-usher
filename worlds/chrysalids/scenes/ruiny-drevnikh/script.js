scene.on("change", "bell", function (v, o) {
  if (v > 0.6 && !(o > 0.6))
    scene.tell("Издалека, из-за холмов, донёсся колокол — дети обернулись в сторону дома.", "david");
});
scene.on("change", "glint", function (v, o) {
  if (v > 0.7 && !(o > 0.7)) scene.tell("В траве что-то ярко блеснуло на солнце.", "glint");
});
