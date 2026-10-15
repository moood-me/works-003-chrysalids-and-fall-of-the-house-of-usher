// the lamp dims as the gloom deepens
if (e.layer("lamp").scaleX) {
  const lit = 1 - 0.75 * Math.min(1, Math.max(0, e.state.gloom ?? 0));
  e.layer("lamp").alpha = lit;
  e.glow("lamp", lit);
}
