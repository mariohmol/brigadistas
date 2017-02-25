import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
import { BackgroundGeolocation } from 'ionic-native';

@Injectable()
export class FireService extends BaseService {
  public static dados: any= {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello FireService Provider');
  }

  getFires(){
    return this.doGet("/fire/");
  }

  addFire(fire){
    return this.doPost("/fire/",fire);
  }


  startTracking(cb,errcb){
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

      cb(location, "58add2eabb0a92800936a211");

      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      BackgroundGeolocation.finish(); // FOR IOS ONLY

     }, (error) => {
       console.log('BackgroundGeolocation error');
       errcb();
     }, config);

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start();
  }

  stopTracking(){
    BackgroundGeolocation.stop();
  }




}
