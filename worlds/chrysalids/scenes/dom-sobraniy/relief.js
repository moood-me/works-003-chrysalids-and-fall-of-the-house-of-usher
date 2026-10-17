// the hall's floor, and the elders' dais on it (lib's DAIS: 0.35 m up) — where the people stand, sit and step down
const D = lib.DAIS;
return across >= D.a0 && across <= D.a1 && distance >= D.d0 && distance <= D.d1 ? D.h : 0;
