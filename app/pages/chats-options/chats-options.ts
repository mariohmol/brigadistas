import {Component} from '@angular/core';
import {NavController, ViewController, AlertController} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {ProfilePage} from '../profile/profile';
import {LoginPage} from '../login/login';
import {BrigadesPage} from '../brigades/brigades'


@Component({
  templateUrl: 'build/pages/chats-options/chats-options.html'
})
export class ChatsOptionsPage {
  constructor(private navCtrl: NavController, private viewCtrl: ViewController,public alertCtrl: AlertController) {}

  editProfile(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(ProfilePage);
    });
  }

  showBrigadas(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(BrigadesPage);
    });
  }

  logout(): void {
    const alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogout(alert);
            return false;
          }
        }
      ]
    });

    this.viewCtrl.dismiss().then(() => {
      alert.present();
    });
  }

  private handleLogout(alert): void {
    Meteor.logout((e: Error) => {
      alert.dismiss().then(() => {
        if (e) return this.handleError(e);
        this.navCtrl.push(LoginPage);
        /*this.navCtrl.rootNav.setRoot(LoginPage, {}, {
          animate: true
        });*/
      });
    });
  }

  private handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}
