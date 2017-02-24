import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import BasePage from '../basepage';
import { FirePage } from './fire';
import { BackgroundGeolocation } from 'ionic-native';
import { UserService } from '../../providers/user-service';
import { FireService } from '../../providers/fire-service'

/*
  Generated class for the Fire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fires',
  templateUrl: 'fires.html'
})
export class FiresPage extends BasePage{
  public fires: Array<any>;
  public static isTracking: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public fireService: FireService) {
    super();
    this.fires = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadesPage');
    this.fireService.getFires().then(d => {
      this.fires = <Array<any>>d;
    });
  }

  addFire() {
    this.navCtrl.push(FirePage);
  }

  showFire(fire) {
    this.navCtrl.push(FirePage,{ fire});
  }

  tracking(){
    if (!FiresPage.isTracking) {
      // BackgroundGeolocation is highly configurable. See platform specific configuration options
      let config = {
              desiredAccuracy: 10,
              stationaryRadius: 20,
              distanceFilter: 30,
              debug: true, //  enable this hear sounds for background-geolocation life-cycle.
              stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      BackgroundGeolocation.configure((location) => {
        console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

        this.userService.saveLocation(location.latitude, location.longitude, "58add2eabb0a92800936a211");

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        BackgroundGeolocation.finish(); // FOR IOS ONLY

       }, (error) => {
         console.log('BackgroundGeolocation error');
       }, config);

      // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
      BackgroundGeolocation.start();

      FiresPage.isTracking = true;
    }else {
      // If you wish to turn OFF background-tracking, call the #stop method.
      BackgroundGeolocation.stop();
      FiresPage.isTracking = false;
    }
  }

}
