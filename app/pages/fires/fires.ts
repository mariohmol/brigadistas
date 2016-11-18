import {Component} from '@angular/core';
import {NavController, ModalController, PopoverController,AlertController,MenuController,NavParams} from 'ionic-angular';
import {CalendarPipe} from 'angular2-moment';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Chat, Message, Brigade, FireAlert} from 'api/models';
import {Chats, Messages,Brigades, FireAlerts} from 'api/collections';
import {BrigadePage} from '../brigades/brigade';
import {FirePage} from './fire';
import { GoogleMap, GoogleMapsEvent } from 'ionic-native';

import {TranslatePipe} from "ng2-translate/ng2-translate";
import BasicComponent from '../basic.ts'

@Component({
  templateUrl: 'build/pages/fires/fires.html',
  pipes: [CalendarPipe,TranslatePipe]
})
export class FiresPage extends BasicComponent {
  chats: Mongo.Cursor<Chat>;
  public brigades: Mongo.Cursor<Brigade>;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public modCtrl: ModalController,
    public popCtrl: PopoverController, public menuCtrl: MenuController) {
    super(navCtrl,alertCtrl);

    menuCtrl.enable(true, 'menuBrigadista');
    menuCtrl.swipeEnable(true);
    this.subscribe('brigades', () => {
      this.autorun(() => {
        //this.brigades = this.findFires();
        console.log(this.brigades)
      });
    });
  }

  addFire(): void {
    const modal = this.modCtrl.create(FirePage);
    modal.present();
  }
  showFire(brigade): void {
    this.navCtrl.push(BrigadePage, {brigade: brigade, readOnly: true});
  }

  private findFires(): Mongo.Cursor<Brigade>{
    const brigades = Brigades.find({}, {});

    /*brigades.observe({
      changed: (newChat, oldChat) => this.disposeChat(oldChat)
    });*/

    return brigades;
  }

}
