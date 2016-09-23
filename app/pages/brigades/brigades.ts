import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController,AlertController} from 'ionic-angular';
import {CalendarPipe} from 'angular2-moment';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Chat, Message, Brigade, FireAlert} from 'api/models';
import {Chats, Messages,Brigades, FireAlerts} from 'api/collections';
import {MessagesPage} from '../messages/messages';
import {ChatsOptionsPage} from '../chats-options/chats-options';
import {NewBrigade} from '../brigades/new-brigade';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import BasicComponent from '../basic.ts'

@Component({
  templateUrl: 'build/pages/brigades/brigades.html',
  pipes: [CalendarPipe,TranslatePipe]
})
export class BrigadesPage extends BasicComponent {
  chats: Mongo.Cursor<Chat>;
  public brigades: Mongo.Cursor<Brigade>;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public modCtrl: ModalController, public popCtrl: PopoverController) {
    super(navCtrl,alertCtrl);

    this.subscribe('brigades', () => {
      this.autorun(() => {
        this.brigades = this.findBrigades();
      });
    });
  }

  addBrigada(): void {
    const modal = this.modCtrl.create(NewBrigade);
    modal.present();
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
    const brigades = Brigades.find({}, {});

    /*brigades.observe({
      changed: (newChat, oldChat) => this.disposeChat(oldChat)
    });*/

    return brigades;
  }

}
