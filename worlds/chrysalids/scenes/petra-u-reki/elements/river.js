// The river (a plane seen from above: x across, y toward us; its middle 10.5 m off, 19 m from bank to bank): its water
// grey-green, paler toward the far bank, darker in the near pool; a little see-through, so what is under it shows dark.
// Its flow and the rain's dimples are its shader's (river.wgsl); it mirrors the banks, roughly, broken by the rain.
const gr = g.createLinearGradient(0, -9.5, 0, 9.5);
gr.addColorStop(0, '#a4aaa2');
gr.addColorStop(0.4, '#8c948c');
gr.addColorStop(0.8, '#727c76');
gr.addColorStop(1, '#5e6864');
g.fillStyle = gr;
g.globalAlpha = 0.86;
g.fillRect(-45, -9.5, 90, 19);
g.globalAlpha = 1;
