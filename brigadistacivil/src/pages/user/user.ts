import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service'
/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  login(){
    this.userService.login("m","123456");
  }

}
