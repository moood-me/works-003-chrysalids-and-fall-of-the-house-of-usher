# The games' own sounds wait with the play as its music does (2026-10-29)

**Why.** Pavel: «пауза ставит на паузу музыку с фейдом, а звуки без фейда … пока сцена только открывается … звуки
начинаются еще пока она готовится, а музыка начинается только когда сцена готова. сделай звуки как музыку.»

**What.** moood now runs a game's sound context through its "sounds" output (`MooodVolume.output`, moood
`docs/history/2026-10-29-sounds-like-music.md`): it fades the sounds out and back in on the play's pause, holds them
while the scene stands or is being made ready (the play's start, between scenes), and resumes the context as soon as
the browser lets sound begin. The games here stopped fighting it: their `sound.js` no longer suspends or resumes its
AudioContext — no `pause(on)` (and no `b.onPause(pause)` in game.js); The Fall of the House of Usher no
longer has `wake()` (its context made at the first touch: the page resumes it at a touch now); the checks
(`check/run.mjs`) no longer list `pause` among the sounds. Each game's sounds themselves are unchanged.
