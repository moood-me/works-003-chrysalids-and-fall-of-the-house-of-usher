// «Нити» — the sky comes to the chapter shown: camera_x at shown·SPACING — at once as it opens (or is restored), over a
// second when the game names another chapter
const s = scene, L = s.lib;
s.set('camera_x', (s.get('shown') ?? 0) * L.SPACING);
s.on('change', 'shown', v => s.move('camera_x', (v ?? 0) * L.SPACING, { over: 1, ease: 'inOut' }));
