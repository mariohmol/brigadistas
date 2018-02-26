import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { FirePageComponent } from './fire.component';
import { FiresPageComponent } from './fires.component';
import { FireViewPageComponent } from './fireview.component';
import { FireService } from './fire.service';

@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        FirePageComponent, FiresPageComponent, 
        FireViewPageComponent
    ],
    exports: [
        FirePageComponent, FiresPageComponent, 
        FireViewPageComponent
    ],
    entryComponents: [
        FirePageComponent, FiresPageComponent, 
        FireViewPageComponent
    ],
    providers: [
        FireService
    ]
})
export class FireModule {
}
