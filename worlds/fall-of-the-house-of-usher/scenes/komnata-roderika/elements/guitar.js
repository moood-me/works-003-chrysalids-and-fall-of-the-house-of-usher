// His guitar, leaning on the chair's side when it is not in his hands (roderick_with ["guitar"]: the cast's guitar on
// him instead). Its point — where a game offers it.
const held = e.state.roderick_with;
if (Array.isArray(held) && held.includes("guitar")) return;
e.kit.ushers.prop(g, e, "guitar", { angle: -14, light: 1 });
e.at(0, -0.5, "body");
