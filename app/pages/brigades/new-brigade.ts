import {Component} from '@angular/core';
import {NavController, ViewController, AlertController} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Chat, Message, Brigade, FireAlert} from 'api/models';
import BasicComponent from '../basic.ts'
import {Brigades} from 'api/collections';

@Component({
    templateUrl: 'build/pages/brigades/new-brigade.html',
    pipes: [TranslatePipe]
})
export class NewBrigade extends BasicComponent {
    users: Mongo.Cursor<Meteor.User>;
    private brigade: Brigade;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController) {
        super(navCtrl,alertCtrl);
        this.brigade =  {};
    }

    defaultAction(): void {
      console.log(this.brigade);
      this.call('brigades.insert', this.brigade, (e: Error) => {
        console.log(e)
        this.viewCtrl.dismiss().then(() => {
            if (e) return this.handleError(e);
        });
      });
      /*Brigades.insert(this.senderId,this.brigade, (e: Error) => {
        console.log(e)
        this.viewCtrl.dismiss().then(() => {
            if (e) return this.handleError(e);
        });
      })*/
        /*this.call('addBrigade', this.brigade, (e: Error) => {
            this.viewCtrl.dismiss().then(() => {
                if (e) return this.handleError(e);
            });
        });/**/
    }

    removeBrigada(chat): void {
      this.call('removeChat', chat._id);
    }
}
