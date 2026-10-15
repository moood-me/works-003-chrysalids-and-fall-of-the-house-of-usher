// the rings spreading as `ring` goes 0 → 1, one after another, fading as they widen (none before it starts or once done)
const p = e.state.ring ?? 0, going = p > 0.001 && p < 0.999;
for (let i = 0; i < 3; i++) {
  const q = p * 1.25 - i * 0.18, L = e.layer(`ring${i}`), on = going && q > 0 && q < 1;
  L.scale = on ? (0.12 + 0.5 * q) / 0.62 : 0.2;
  L.alpha = on ? 0.55 * (1 - q) : 0;
}
