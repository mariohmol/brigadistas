import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
/*
  Generated class for the Brigade page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
  }

  isReadonly(){
    return true;
  }

}
