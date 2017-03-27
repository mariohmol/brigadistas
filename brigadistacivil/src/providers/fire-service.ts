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
  }

  getFires(){
    return this.doGet('/fire/');
  }
  getFire(id){
    return this.doGet(`/fire/${id}`);
  }

  addFire(fire){
    return this.doPost('/fire/',fire);
  }

  updateFire(fire){
    return this.doPut(`/fire/${fire._id}`,fire);
  }

  changeStatus(fire,status){
    return this.doPut(`/fire/status/${fire._id}/${status}`);
  }


  startTracking(cb,errcb){

    if (BaseService.device == 'mobile') {
      // BackgroundGeolocation is highly configurable. See platform specific configuration options
      let config = {
              desiredAccuracy: 10,
              stationaryRadius: 20,
              distanceFilter: 30,
              debug: true, //  enable this hear sounds for background-geolocation life-cycle.
              stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      BackgroundGeolocation.configure((location) => {
        cb(location);

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        BackgroundGeolocation.finish(); // FOR IOS ONLY

      }, (error) => {
        errcb(error);
      }, config);

      // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
      BackgroundGeolocation.start();
    }else errcb("Is not a mobile");
  }

  stopTracking(){
    BackgroundGeolocation.stop();
  }
}
