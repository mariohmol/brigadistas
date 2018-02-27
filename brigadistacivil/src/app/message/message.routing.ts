import { NewLocationMessageComponent } from './location-message.component';
import { MessagesAttachmentsComponent } from './messages-attachments.component';
import { MessagesOptionsComponent } from './messages-options.component';
import { MessagesPageComponent } from './messages.component';

export const MessageRoutes = [
  { component: NewLocationMessageComponent, name: 'NewLocationMessage', segment: 'newlocationmessage' },
  { component: MessagesAttachmentsComponent, name: 'MessagesAttachments', segment: 'messagesattch/:id' },
  { component: MessagesOptionsComponent, name: 'MessagesOptions', segment: 'messagesoptions/:id' },
  { component: MessagesPageComponent, name: 'Messages', segment: 'messages' }
];
