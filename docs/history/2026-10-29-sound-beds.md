# The Fall of the House of Usher: the background declared, changed with the scene's music (2026-10-29)

**Why.** Pavel heard a game's sounds fade in, out and in again at a scene change: the games set their beds themselves
around a show, and the day's earlier change in moood (`2026-10-29-sounds-like-music.md` here and in moood) held all
their sounds while a scene was being made ready. Agreed with Pavel: sounds are the game's, music the scene's; a game
*declares* its background (its beds and levels), and moood changes it at the moment the picture changes — with the
scene's music, its crossfade's moment and seconds — or at once when no scene change is under way; the pause, the
phone upright, the page hidden, a scene standing hold the music and every sound together (moood
`docs/history/2026-10-29-sound-beds.md`, `bespoke.background`, `bespoke.onBackground`).

**What.** Usher (Chrysalids has no beds: untouched). `sound.js`: `house`, `rain`, `hush` are no longer called by the
game; `BEDS` (house, rain) and `background(levels, seconds)` — the beds named to their levels, every other silent —,
given to the page once (`b.onBackground(background)`, game.js). The steps declare: `g.scene(folder, state, {beds})`
(the prologue's rain, the house at dusk, the rain of the nights, the storm) and `g.beds(levels)` within a scene (the
rain dying under the letter, the house going silent look by look, the house breathing while he listens — the
mini-game «Listen» —, then quieter). The map's silence is its show's `background: {}`. A jump keeps what its step
declares (`j.background`) for the show that ends it; `unheard()` keeps no levels and wakes nothing. The levels are as
they were; the seconds are the page's now (the music's crossfade). The check checks the beds named and that no
seconds are given.

**How.** story.js (`g.beds`, `g.scene`'s beds, `seen()`), jump.js, sound.js, game.js, minigames/listening.js,
chapters (prologue, 1, 3, 4), check/run.mjs, docs/usher/game.md. Checked: `node bespoke/check/run.mjs
../../worlds/fall-of-the-house-of-usher` — «Discrepancies: 0».
