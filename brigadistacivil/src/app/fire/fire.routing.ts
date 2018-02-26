import { FirePageComponent } from "./fire.component";
import { FiresPageComponent } from "./fires.component";
import { FireViewPageComponent } from "./fireview.component";

export const FireRoutes = [
  { component: FirePageComponent, name: 'Fire', segment: 'fire/new' },
  { component: FiresPageComponent, name: 'Fires', segment: 'fires' },
  { component: FireViewPageComponent, name: 'FireView', segment: 'fire/:id' }
];
