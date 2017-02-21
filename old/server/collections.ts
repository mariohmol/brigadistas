import {Mongo} from 'meteor/mongo';
import {Chat, Message, Brigade, FireAlert} from 'api/models';


export const Chats = new Mongo.Collection<Chat>('chats');
export const Messages = new Mongo.Collection<Message>('messages');
export const Brigades = new Mongo.Collection<Brigade>('brigades');
export const FireAlerts = new Mongo.Collection<FireAlert>('firealerts');
