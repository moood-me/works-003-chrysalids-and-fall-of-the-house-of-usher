// The inspector on the farm (notes.md). The game sets the yard's keys — verdict, calf_present, david_present — and this
// script turns them into what its people do. The people are the engine's (elements with "person", the world's cast):
// what each does is <id>_do, where each faces <id>_turn (degrees: 0 away from us, 90 to the right, 180 toward us), looks
// <id>_look, reaches <id>_reach — and where each stands their place (<id>_a, <id>_d). The calf is painted (calf.js): it
// goes where the farmhand leads it, its halter's ring a point of it (calf#ring), the rope from it to his hand.
const P = (id) => scene.person(id);
const N = (v) => +v || 0;

// where things are: the farmhand holding the calf, and by the barn where he leads it (4 m to the left); David behind
// the barn's far corner, and back behind it out of sight; the barn's corner the inspector points at; the calf's legs
const LED = [-5.25, 7.95],
  DAVID = [-3.2, 15.5],
  HIDDEN = [-3.95, 15.6],
  BARN = [-4.4, 13, 2.2],
  LEGS = [-0.1, 8.05, 0.35];

// The verdict (verdict 0…1): the inspector raises his hand and points to the barn (from 0.3); the farmhand leads the calf
// away to it (from 0.55), turns there to it and holds it; the inspector's hand comes down once it is done
let pointed = false,
  led = false,
  lowered = false;
function point() {
  pointed = true;
  P("inspector").look(BARN);
  P("inspector").reach({ r: BARN });
}
function lead() {
  led = true;
  P("farmhand").look(null);
  const s = P("farmhand").walk([LED], { speed: 1.2 });
  scene.after(s, () => {
    P("farmhand").turn(90, 0.6);
    P("farmhand").do("rope_hold", { loop: true });
    P("farmhand").look("calf#ring");
  });
}
function lower() {
  lowered = true;
  scene.after(1.5, () => {
    P("inspector").reach(null);
    P("inspector").look("farmhand");
  });
}
// (the scene opened with the verdict given: the calf by the barn already, the hand down)
if (N(scene.get("verdict")) >= 1) {
  led = pointed = lowered = true;
  scene.set("farmhand_a", LED[0]);
  P("inspector").look("farmhand");
}

// The inspector reads his ledger, then looks long at the calf's legs
scene.after(8, () => !pointed && P("inspector").look(LEGS));

// The calf led off behind the barn by David while they talk (calf_present → 0): the farmhand lets go the rope and watches
// where it goes; the inspector turns the pages of his ledger
let hidden = false;
function hide() {
  hidden = true;
  P("farmhand").reach(null);
  P("farmhand").do("stand", { loop: true });
  P("farmhand").look("david");
  P("inspector").look("inspector#hand_l");
}

// David peeks round the barn's corner (david_present 1), or draws back behind it (0)
let back = false;
function davidBack(b) {
  back = b;
  P("david").walk([b ? HIDDEN : DAVID], { speed: 0.8 });
}

// what the game sets, as it goes (its values move over seconds: looked at as they move) — and the sky's light on the
// people as much as the rain leaves of it
scene.every(0.1, () => {
  scene.set("sky_light", 1 - N(scene.get("rain")));
  const v = N(scene.get("verdict"));
  if (v > 0.3 && !pointed) point();
  if (v > 0.55 && !led) lead();
  if (v >= 1 && !lowered) lower();
  if (N(scene.get("calf_present") ?? 1) < 0.5 && !hidden) hide();
  const there = N(scene.get("david_present") ?? 1) > 0.5;
  if (there === back) davidBack(!there);
});

scene.on("change", "verdict", function (v, o) {
  if (v >= 0.9 && (o === undefined || o < 0.9))
    scene.tell("Инспектор поднял руку и указал на сарай: телёнка уводят.", "inspector");
});
scene.on("change", "david_present", function (v, o) {
  if (v > 0.5 && o <= 0.5) scene.tell("Из-за угла сарая выглянул Дэвид.", "david");
});
