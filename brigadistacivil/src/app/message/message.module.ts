import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { NewLocationMessageComponent } from './location-message.component';
import { MessagesOptionsComponent } from './messages-options.component';
import { MessagesAttachmentsComponent } from './messages-attachments.component';
import { MessagesPageComponent } from './messages.component.component';

@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        NewLocationMessageComponent, MessagesAttachmentsComponent,
        MessagesOptionsComponent, MessagesPageComponent
    ],
    exports: [
        NewLocationMessageComponent, MessagesAttachmentsComponent,
        MessagesOptionsComponent, MessagesPageComponent
    ],
    entryComponents: [
        NewLocationMessageComponent, MessagesAttachmentsComponent,
        MessagesOptionsComponent, MessagesPageComponent
    ]
})
export class MessageModule {
}
