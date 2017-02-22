import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BackgroundGeolocation } from 'ionic-native';
import { UserService } from '../../providers/user-service';

/*
  Generated class for the Fire page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fires',
  templateUrl: 'fires.html'
})
export class FiresPage {

  public static isTracking: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirePage');
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
