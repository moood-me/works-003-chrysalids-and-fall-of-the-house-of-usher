// where the close-up's frame is on the stage (lib.CU): its painting's local units for the shader's cells
const { CU } = e.lib;
e.uniform('cx', CU.x - CU.k * CU.ox);
e.uniform('cy', CU.y - CU.k * CU.oy);
e.uniform('k', CU.k);
