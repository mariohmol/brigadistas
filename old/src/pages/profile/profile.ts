import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
//import {MeteorComponent} from 'angular2-meteor';
//import {Meteor} from 'meteor/meteor';
//import {Profile} from 'api/models';
import {TabsPage} from '../tabs/tabs';
class Profile{}

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {
  profile: Profile;

  constructor(private navCtrl: NavController, public alertCtrl: AlertController) {
    let prof;
    //if(Meteor.user()) prof=Meteor.user().profile
    this.profile = prof || {
      name: '',
      picture: '/ionicons/svg/ios-contact.svg'
    };
  }

  done(): void {
    /*this.call('updateProfile', this.profile, (e: Error) => {
      if (e) return this.handleError(e);
      this.navCtrl.push(TabsPage);
    });*/
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
