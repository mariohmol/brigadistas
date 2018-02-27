import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { BrigadeViewPageComponent } from './brigadeview.component';
import { BrigadeAreaPageComponent } from './area.component';
import { BrigadePageComponent } from './brigade.component';
import { BrigadesPageComponent } from './brigades.component';
import { ChatService } from './chat.service';

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
        ChatService
    ]
})
export class ChatModule {
}
