import { ChatPageComponent } from './chat.component';
import { ChatsOptionsComponent } from './chats-options.component';
import { ChatsPageComponent } from './chats.component';


export const ChatRoutes = [
  { component: ChatPageComponent, name: 'Chat', segment: 'chat/:id' },
  { component: ChatsOptionsComponent, name: 'ChatOptions', segment: 'chatoptions/:id' },
  { component: ChatsPageComponent, name: 'Chats', segment: 'chats' }
];
