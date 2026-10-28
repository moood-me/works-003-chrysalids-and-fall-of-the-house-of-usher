// The hall behind the door, a few metres in (seen only through the open door, cut out of the facade): its dark, and
// the dim warm lamplight down to its floor — a lit room seen from outside (it glows: the light the scene does not
// darken; the lamp itself is the scene's light `hall`, on whoever stands in the door). Whoever comes out of the house
// stands in here first.
const L = e.lib,
  [x, top, w, h] = L.DOOR;
g.fillStyle = "#080b0e";
g.fillRect(-4, top - 1.5, 8, h + 1.9);
L.hallLight(g, x, top - 1.5, 8, h + 1.9);
