import { AreaPageComponent } from "./area.component";
import { ItemPageComponent } from "./item.component";
import { MapPageComponent } from "./map.component";
import { MapOptionsComponent } from "./mapoptions.component";

export const GeoRoutes = [
  { component: AreaPageComponent, name: 'Area', segment: 'area/:id' },
  { component: ItemPageComponent, name: 'Item', segment: 'item/:id' },
  { component: MapPageComponent, name: 'Map', segment: 'map' },
  { component: MapOptionsComponent, name: 'MapOptions', segment: 'map/options' }
];
