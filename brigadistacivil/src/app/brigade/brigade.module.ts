import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { BrigadeService } from './brigade.service';
import { BrigadeViewPageComponent } from './brigadeview.component';
import { BrigadeAreaPageComponent } from './area.component';
import { BrigadePageComponent } from './brigade.component';
import { BrigadesPageComponent } from './brigades.component';

@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        BrigadeAreaPageComponent, BrigadePageComponent,
        BrigadesPageComponent, BrigadeViewPageComponent
    ],
    exports: [
        BrigadeAreaPageComponent, BrigadePageComponent,
        BrigadesPageComponent, BrigadeViewPageComponent
    ],
    entryComponents: [
        BrigadeAreaPageComponent, BrigadePageComponent,
        BrigadesPageComponent, BrigadeViewPageComponent
    ],
    providers: [
        BrigadeService
    ]
})
export class BrigadeModule {
}
