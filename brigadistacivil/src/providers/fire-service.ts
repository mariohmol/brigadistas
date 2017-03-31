import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import Environment from "../environment";

@Injectable()
export class FireService extends BaseService {
  public static data: any= {};
  
  constructor(public http: Http,private backgroundGeolocation: BackgroundGeolocation) {
    super(http);
  }

  getFires(query={}){
    query = Object.keys(query).map(q=>{
      return `${q}=${query[q]}`
    }).join("&");
    return this.doGet('/fire/?${query}');
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
      let config: BackgroundGeolocationConfig;

      if(Environment.env!=="production"){
      // BackgroundGeolocation is highly configurable. See platform specific configuration options
       config = {
              desiredAccuracy: 0,
              stationaryRadius: 0,
              distanceFilter: 0,
              interval: 2000,
              //fastestInterval: 2000,
              debug: true, //  enable this hear sounds for background-geolocation life-cycle.
              stopOnTerminate: false // enable this to clear background location settings when the app terminates
        };
      }else{
        config = {
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          //url: 'http://192.168.81.15:3000/locations',httpHeaders: { 'X-FOO': 'bar' },
          maxLocations: 1000,
          // Android only section
          //locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
          interval: 60000,
          //fastestInterval: 5000,
          //activitiesInterval: 10000,
          notificationTitle: 'Background tracking',
          notificationText: 'enabled',
          notificationIconColor: '#FEDD1E',
          notificationIconLarge: 'mappointer_large',
          notificationIconSmall: 'mappointer_small'
        };
      }


      this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        cb(location);

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        this.backgroundGeolocation.finish(); // FOR IOS ONLY

      }, (error) => {
        errcb(error);
      });

      // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
      this.backgroundGeolocation.start();
    }else errcb("Is not a mobile");
  }

  stopTracking(){
    this.backgroundGeolocation.stop();
  }

  getTracks(id){
    return this.doGet(`/fire/tracks/${id}`);
  }
}
