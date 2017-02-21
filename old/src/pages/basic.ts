import {Component,ChangeDetectionStrategy} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {TabsPage} from './tabs/tabs';
import {TranslateService} from 'ng2-translate';

@Component({
    //pipes: [TranslatePipe]
})
export default class BasicComponent {
  protected senderId: string;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {
    //super();
    //this.senderId = Meteor.userId();
    this.navCtrl=navCtrl;
    this.alertCtrl=alertCtrl;
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.defaultAction();
    }
  }

  defaultAction(){}

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}
