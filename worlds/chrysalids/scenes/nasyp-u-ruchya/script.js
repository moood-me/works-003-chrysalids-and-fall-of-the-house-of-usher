// The film in beats, for the game: `beat` names the beat to play (the world's module beats; the beats themselves —
// lib.js FILM, notes.md says what each shows). Outside games the scene plays them as its showcase (showcase.js).
scene.kit.beats.play(scene, scene.lib.FILM);
// The rider's feet in the stirrups, his hands on the reins, as his horse turns: they are points in the horse's frame
// (the module chrysalids: tack), other ones each way it is turned
const tack = () => scene.set('rider_reach', scene.lib.tack(scene.get('r_face')));
scene.on('change', 'r_face', tack);
scene.on('move', 'r_face', tack);
tack();
