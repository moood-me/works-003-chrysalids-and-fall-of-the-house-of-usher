// Petra's window in the Strorms' house: the lit pane a layer, its light — brighter, wider as `petra` grows
g.fillStyle = '#4a3828';
g.fillRect(-0.4, -1, 0.8, 1);
e.layer('lit', {}, q => { q.fillStyle = '#f0c07a'; q.fillRect(-0.4, -1, 0.8, 1); });
e.light(0, -0.5, 10, '#f0c080', 1.2, 'win');
e.at(0, -0.5, 'window');
e.at(0, -0.5);
