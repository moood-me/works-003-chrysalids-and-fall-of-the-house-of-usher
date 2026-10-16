// The Strorm farm — its mechanics: David here or not (`boy_present`), and years later (`older`: V–VII) the cast's
// david_teen over him.
const s = scene, P = () => s.person('david');
const here = () => P().here(s.get('boy_present') !== false);
const older = () => P().wear(s.get('older') ? s.kit.cast.characters.david_teen : null);
s.on('change', 'boy_present', here);
s.on('change', 'older', older);
here();
older();
