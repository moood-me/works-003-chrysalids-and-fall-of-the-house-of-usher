// David and Rosalind (engine 3): what its elements and its script share — where David and Rosalind are (their heads:
// across, distance, height), the thread's card between them (DT m ahead) and where their heads are on it; the old
// woman at the well and the two men she talks to; the townsfolk who leave as the crowd goes (and where to); the
// horses at the rail (the world's module chrysalids).
const DAVID = [-2.6, 7, 1.45], ROS = [4.2, 12, 1.6];
const DT = 6.5;
const pt = ([a, d, h]) => [(a * DT) / d, -(1.7 + ((h - 1.7) * DT) / d)];
const OLD = { at: [-0.4, 14.3], men: 'man_a' };
const FOLK = [['woman_c1', [-6.2, 30], [-22, 32]], ['old_man1', [-4.6, 31], [-24, 34]], ['boy1', [-8.6, 32.5], [-26, 35]], ['girl1', [-3.0, 29], [-20, 31]]];
const HORSES = [
  { kind: 'horse', across: 'h1_a', distance: 'h1_d', face: 'h1_face' },
  { kind: 'horse', across: 'h2_a', distance: 'h2_d', face: 'h2_face' },
];
return { DAVID, ROS, DT, pt, OLD, FOLK, HORSES };
