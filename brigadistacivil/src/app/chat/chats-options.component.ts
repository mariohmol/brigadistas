import { Component, Injectable } from '@angular/core';
import { Alert, AlertController, NavController, ViewController } from 'ionic-angular';
import { UserProfilePageComponent } from '../user/profile.component';

@Component({
  selector: 'app-chats-options',
  templateUrl: 'chats-options.component.html'
})
@Injectable()
export class ChatsOptionsComponent {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private viewCtrl: ViewController
  ) { }

  editProfile(): void {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.push(UserProfilePageComponent);
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

  handleLogout(alert: Alert): void {
    // alert.dismiss().then(() => {
    //   return this.phoneService.logout();
    // })
    // .then(() => {
    //   this.navCtrl.setRoot(LoginPage, {}, {
    //     animate: true
    //   });
    // })
    // .catch((e) => {
    //   this.handleError(e);
    // });
  }

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
