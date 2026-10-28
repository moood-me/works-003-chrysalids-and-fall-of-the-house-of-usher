// how deep the crack is (`crack`), how far it has been traced from the roof (`crack_trace`): each stretch shown as far
// as the trace has gone through it, the light carried down to where it is
const L = e.lib, clamp = L.clamp, cr = clamp(e.state.crack ?? 0.5), trace = clamp(e.state.crack_trace ?? 0), CK = L.CK;
e.layer("thin").alpha = clamp((1 - cr) / 0.88);
e.layer("deep").alpha = clamp((cr - 0.12) / 0.88);
const lit = -L.CRACK_TOP + trace * (L.CRACK_TOP + 0.3);
for (let i = 0; i < CK.length - 1; i++) e.layer(`trace${i}`).alpha = clamp((lit - CK[i][1]) / (CK[i + 1][1] - CK[i][1]));
const tip = e.layer("tip");
tip.x = L.crackX(lit) - CK[0][0];
tip.y = lit - CK[0][1];
e.glow("tip", trace > 0.005 && trace < 0.995 ? 1 : 0);
