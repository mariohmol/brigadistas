import {Component} from '@angular/core';
import {NavController, ViewController, AlertController,NavParams} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
//import {Chat, Message, Brigade, FireAlert} from 'api/models';
import BasicComponent from '../basic.ts'
//import {Brigades} from 'api/collections';
class Brigade{}

@Component({
    templateUrl: 'build/pages/brigades/brigade.html'
})
export class BrigadePage  { //extends BasicComponent
    users: any; //Mongo.Cursor<Meteor.User>;
    private brigade: Brigade;
    readOnly: boolean;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController, public navParams: NavParams) {
        //super(navCtrl,alertCtrl);

        this.brigade = <Brigade>navParams.get('brigade');
        if(!this.brigade) this.brigade =  {};
        this.readOnly = <boolean>navParams.get('readOnly');
        if(!this.readOnly) this.readOnly=false;
    }

    defaultAction(): void {
      console.log(this.brigade);
      /*this.call('brigadesInsert', this.brigade, (e: Error) => {
        console.log(e)
        this.viewCtrl.dismiss().then(() => {
            //if (e) return this.handleError(e);
        });
      });*/
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

    isReadonly(){
        return this.readOnly;
    }

    removeBrigada(chat): void {
      //this.call('removeChat', chat._id);
    }
}
