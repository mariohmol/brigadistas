import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {CalendarPipe} from 'angular2-moment';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Chat, Message,Brigade, FireAlert} from 'api/models';
import {Chats, Messages,Brigades, FireAlerts} from 'api/collections';
import {MessagesPage} from '../messages/messages';
import {ChatsOptionsPage} from '../chats-options/chats-options';
import {NewChatPage} from '../new-chat/new-chat';


@Component({
  templateUrl: 'build/pages/brigades/brigades.html',
  pipes: [CalendarPipe]
})
export class BrigadesPage extends MeteorComponent {
  chats: Mongo.Cursor<Chat>;
  private senderId: string;

  constructor(private navCtrl: NavController, public modCtrl: ModalController, public popCtrl: PopoverController) {
    super();

    this.senderId = Meteor.userId();

    this.subscribe('brigades', () => {
      this.autorun(() => {
        this.brigades = this.findBrigades();
      });
    });
  }

  addBrigada(): void {
    const modal = this.modCtrl.create(NewChatPage);
    modal.present();
  }

  removeBrigada(chat): void {
    this.call('removeChat', chat._id);
  }

  showMembers(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }

  showOptions(): void {
    const popover = this.popCtrl.create(ChatsOptionsPage, {}, {
      cssClass: 'options-popover'
    });

    popover.present();
  }

  private findBrigades(): Mongo.Cursor<Brigade>{
    const chats = Brigades.find({}, {
      transform: this.transformChat.bind(this)
    });

    chats.observe({
      changed: (newChat, oldChat) => this.disposeChat(oldChat),
      removed: (chat) => this.disposeChat(chat)
    });

    return chats;
  }

  private transformChat(chat): Chat {
    chat.receiverComp = this.autorun(() => {
      const receiverId = chat.memberIds.find(memberId => memberId != this.senderId);
      const receiver = Meteor.users.findOne(receiverId);
      if (!receiver) return;

      chat.title = receiver.profile.name;
      chat.picture = receiver.profile.picture;
    });

    chat.lastMessageComp = this.autorun(() => {
      chat.lastMessage = this.findLastMessage(chat);
    });

    return chat;
  }

  private findLastMessage(chat): Message {
    return Messages.findOne({
      chatId: chat._id
    }, {
      sort: {createdAt: -1}
    });
  }

  private disposeChat(chat: Chat): void {
    if (chat.receiverComp) chat.receiverComp.stop();
    if (chat.lastMessageComp) chat.lastMessageComp.stop();
  }
}
