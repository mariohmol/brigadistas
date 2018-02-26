import { BrigadesPageComponent } from './brigades.component';
import { BrigadeViewPageComponent } from './brigadeview.component';
import { BrigadeAreaPageComponent } from './area.component';
import { BrigadePageComponent } from './brigade.component';

export const BrigadeRoutes = [
  { component: BrigadeAreaPageComponent, name: 'BrigadeAreaPage', segment: 'brigadearea/:id' },
  { component: BrigadesPageComponent, name: 'Brigades', segment: 'brigades' },
  { component: BrigadePageComponent, name: 'Brigade', segment: 'brigade/new' },
  { component: BrigadeViewPageComponent, name: 'BrigadeView', segment: 'brigade/:id' }
];
