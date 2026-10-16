// The inspector at the farm (engine 3): what its elements and its script share — the inspector's horse (the world's module
// chrysalids, tied to the last post), where the calf goes with the farmhand who holds it, and the order the inspector's
// eyes go over the yard to the calf in (the game's “Find it before he does” sets his look — `inspector_look`, the person's
// own key — to these one after another; the showcase does the same).
const HORSE = { kind: 'horse', across: 'horse_a', distance: 'horse_d', face: 'horse_face' };
// the calf stands this far to the farmhand's right as he holds its halter
const CALF_OFF = 1.15, CALF_GONE = -4.6; // (and where it is led to, behind the barn's corner)
// his look, in order: his ledger, the barn's corner, the pen's fence, his horse, the calf's head, its back, its tail, its legs
const LOOK = ['inspector#hand_l', 'barn#corner', 'fence#pen', 'horse', 'calf#head', 'calf#back', 'calf#tail', 'calf#legs'];
// where the farmhand leads the calf at the verdict (to the barn), and where David goes when he is not at the corner
const TO_BARN = [-4.2, 8.6], DAVID = { peek: [-3.2, 15.5], gone: [-3.95, 15.6] };
return { HORSE, CALF_OFF, CALF_GONE, LOOK, TO_BARN, DAVID };
