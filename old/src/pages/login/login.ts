import {Component,ChangeDetectionStrategy} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {Accounts} from 'meteor/accounts-base';
import {ProfilePage} from '../profile/profile';
import {TabsPage} from '../tabs/tabs';
import {ChatsPage} from '../chats/chats';

@Component({
  templateUrl: 'build/pages/login/login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private navCtrl: NavController,public alertCtrl: AlertController) {
    //if (Meteor.userId()) navCtrl.push(TabsPage);
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.login();
    }
  }

  login(): void {
    let classe = this;
    /*Meteor.loginWithPassword(this.username, this.password, function (error) {
      if(!error){
        classe.navCtrl.push(TabsPage);
      }else{

        const alert = classe.alertCtrl.create({
          title: 'Confirmar',
          message: `Gostaria de criar uma conta utilizando o email ${classe.username}?`,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Sim',
              handler: () => {
                classe.handleLogin(alert);
                return false;
              }
            }
          ]
        });
        alert.present();
      }
    })*/
  }

  private handleLogin(alert): void {
    let classe=this;

    /*Meteor.call("signin",classe.username, classe.password,{},(e: Error)=>{
      alert.dismiss().then(() => {
        if (e) return classe.handleError(e);

        Meteor.loginWithPassword(classe.username, classe.password, function (error) {
          if (error) {
            alert(error)
            //sAlert.error('Account login failed for unknown reasons :(');
          } else {
            classe.navCtrl.push(ProfilePage, {
              username: classe.username
            });
          }
        });
      });
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
