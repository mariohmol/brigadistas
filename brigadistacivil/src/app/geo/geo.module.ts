import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { AreaPageComponent } from './area.component';
import { GeoService } from './geo.service';
import { MapPageComponent } from './map.component';
import { ItemPageComponent } from './item.component';
import { MapOptionsComponent } from './mapoptions.component';

@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        AreaPageComponent, ItemPageComponent,
        MapPageComponent, MapOptionsComponent
    ],
    exports: [
        AreaPageComponent, ItemPageComponent,
        MapPageComponent, MapOptionsComponent
    ],
    entryComponents: [
        AreaPageComponent, ItemPageComponent,
        MapPageComponent, MapOptionsComponent
    ],
    providers: [
        GeoService
    ]
})
export class GeoModule {
}
