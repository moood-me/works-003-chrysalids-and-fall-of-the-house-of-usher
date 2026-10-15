// Инспектор на ферме (engine 3): what its elements and its script share — the inspector's horse (the world's module
// chrysalids, tied to the last post), where the calf goes with the farmhand who holds it, and the order the inspector's
// eyes go over the yard to the calf in (the game's «Найди раньше него» sets his look — `inspector_look`, the person's
// own key — to these one after another; the showcase does the same).
const HORSE = { kind: 'horse', across: 'horse_a', distance: 'horse_d', face: 'horse_face' };
// the calf stands this far to the farmhand's right as he holds its halter
const CALF_OFF = 1.15;
// his look, in order: his ledger, the barn's corner, the pen's fence, his horse, the calf's head, its back, its tail, its legs
const LOOK = ['inspector#hand_l', 'barn#corner', [3.5, 10, 1.0], 'horse', 'calf#head', 'calf#back', 'calf#tail', 'calf#legs'];
// where the farmhand leads the calf at the verdict (to the barn), and where David goes when he is not at the corner
const TO_BARN = [-5.25, 7.95], DAVID = { peek: [-3.2, 15.5], gone: [-3.95, 15.6] };
return { HORSE, CALF_OFF, LOOK, TO_BARN, DAVID };
