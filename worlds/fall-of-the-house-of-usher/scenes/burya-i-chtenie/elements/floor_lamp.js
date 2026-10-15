// Roderick's lamp put down on the floor by his chair (lamp_down): the ushers module's, in its own colours (the scene's light
// lights it); its flame a layer of its own, its light the scene's lamp_floor
if (e.state.lamp_down) e.kit.ushers.prop(g, e, 'lamp', { x: 0, y: 0, light: 1 });
