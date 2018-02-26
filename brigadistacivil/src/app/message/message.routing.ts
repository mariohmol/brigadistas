import { NewLocationMessageComponent } from './location-message.component';
import { MessagesAttachmentsComponent } from './messages-attachments.component';
import { MessagesOptionsComponent } from './messages-options.component';
import { MessagesPageComponent } from './messages.component.component';

export const MessageRoutes = [
  { component: NewLocationMessageComponent, name: 'BrigadeAreaPage', segment: 'brigadearea/:id' },
  { component: MessagesAttachmentsComponent, name: 'Brigades', segment: 'brigades' },
  { component: MessagesOptionsComponent, name: 'Brigade', segment: 'brigade/new' },
  { component: MessagesPageComponent, name: 'BrigadeView', segment: 'brigade/:id' }
];
