import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { ChatService } from './chat.service';
import { ChatPageComponent } from './chat.component';
import { ChatsOptionsComponent } from './chats-options.component';
import { ChatsPageComponent } from './chats.component';



@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        ChatPageComponent, ChatsOptionsComponent,
        ChatsPageComponent
    ],
    exports: [
        ChatPageComponent, ChatsOptionsComponent,
        ChatsPageComponent
    ],
    entryComponents: [
        ChatPageComponent, ChatsOptionsComponent,
        ChatsPageComponent
    ],
    providers: [
        ChatService
    ]
})
export class ChatModule {
}
