// Сон о городе (engine 3): what its sky elements, its script and the game share — the city's middle on the sky, the
// horizon, the three shining fish (where each hangs, how big, from what strength of `craft` it shows), and the leading
// fish's way over the city (PATH: u 0…1 along it; the game moves it there by `lead` over 40 s; David's eyes — `gaze`
// −1…1 — are at u = (gaze + 1) / 2 of the same way). Stage heights (the sky's units).
const H = 0.6;
const cityX = A => A * 0.665;
// each fish: [x from the city's middle, y, size, from what craft it shows]
const FISH = [[-0.07, 0.37, 1.0, 0.0], [0.14, 0.3, 0.72, 0.25], [-0.24, 0.43, 0.58, 0.55]];
const fishLen = (c, k) => (0.03 + 0.05 * c) * FISH[k][2];
// the leading fish's way: from over the left of the city across above its towers and down toward the right
const PATH = (A, u, c) => [cityX(A) - 0.36 + 0.6 * u, 0.33 - 0.07 * c - 0.05 * Math.sin(Math.PI * u) + 0.03 * u];
// the world point a place on the sky is seen at (for David's look): far off, the same way from the eye
const toWorld = (A, [x, y]) => { const D = 300; return [(x - A / 2) * D, D, 1.7 + (H - y) * D]; };
return { H, cityX, FISH, fishLen, PATH, toWorld };
