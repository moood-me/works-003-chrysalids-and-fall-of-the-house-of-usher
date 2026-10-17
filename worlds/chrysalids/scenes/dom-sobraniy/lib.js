// Дом собраний (engine 3): what its elements and its script share — where things stand (keep in step with scene.json),
// the dais the people stand on (relief.js), the windows and the door in the back wall.
const N = v => (v === true ? 1 : v === false ? 0 : Math.max(0, Math.min(1, +v || 0)));
const AT = { lamp: [-0.75, 5.3, 0.78], spill: [-0.6, 4.7, 0.05], door: 2.5 };
// the dais (its top 0.35 m up, from 5.0 to 7.4 m away, −2.4…1.6 across)
const DAIS = { h: 0.35, a0: -2.4, a1: 1.6, d0: 5.0, d1: 7.4 };
// the back wall (7.5 m): its windows [middle across, width] between WY0 and WY1 (y up the wall, negative), its door
const WIN = [[-5.9, 0.6], [-2.8, 0.7], [1.1, 0.7], [4.9, 0.6]], WY0 = -2.9, WY1 = -1.5;
const DOOR = { x0: 2.0, x1: 3.0, y: -2.1 };
return { N, AT, DAIS, WIN, WY0, WY1, DOOR };
