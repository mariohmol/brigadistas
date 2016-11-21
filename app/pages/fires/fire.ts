import {Component,ViewChild} from '@angular/core';
import {NavController, ViewController, AlertController,NavParams} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Chat, Message, Brigade, FireAlert} from 'api/models';
import BasicComponent from '../basic.ts'
import {Brigades} from 'api/collections';
import { GoogleMap, GoogleMapsEvent,GoogleMapsMarker,GoogleMapsLatLng,CameraPosition,GoogleMapsMarkerOptions } from 'ionic-native';
import { Camera } from 'ionic-native';
import { CameraPreview } from 'ionic-native';
import { Geolocation } from 'ionic-native';

@Component({
    templateUrl: 'build/pages/fires/fire.html',
    pipes: [TranslatePipe]
})
export class FirePage extends BasicComponent {
    users: Mongo.Cursor<Meteor.User>;
    private brigade: Brigade;
    readOnly: boolean;
    // In Angular 2 or Ionic 2, if we have this element in html: <div #map></div>
    // then we can use @ViewChild to find the element and pass it to GoogleMaps
    @ViewChild('map') mapElement;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController, public navParams: NavParams) {
        super(navCtrl,alertCtrl);

        this.brigade = <Brigade>navParams.get('brigade');
        if(!this.brigade) this.brigade =  {};
        this.readOnly = <boolean>navParams.get('readOnly');
        if(!this.readOnly) this.readOnly=false;

        this.getMap();
    }

    getMap(): void{
      // create a new map using element ID
      //let map = new GoogleMap('firemap');
      // or create a new map by passing HTMLElement
      //let element: HTMLElement = document.getElementById('elementID');

      let map = new GoogleMap(this.mapElement);

      // listen to MAP_READY event
      map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));

      // create LatLng object
      let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);

      // create CameraPosition
      let position: CameraPosition = {
        target: ionic,
        zoom: 18,
        tilt: 30
      };

      // move the map's camera to position
      map.moveCamera(position);

      // create new marker
      let markerOptions: GoogleMapsMarkerOptions = {
        position: ionic,
        title: 'Ionic'
      };

      map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
          marker.showInfoWindow();
        });
    }

    getLocation(): void{
      Geolocation.getCurrentPosition().then((resp) => {
       // resp.coords.latitude
       // resp.coords.longitude
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      let watch = Geolocation.watchPosition();
      watch.subscribe((data) => {
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
      });
    }


    /**
     * PICTURES
     */
    previewPicture(): void{
      /* camera options (Size and location)
      let cameraRect: CameraPreviewRect = {
        x: 100,
        y: 100,
        width: 200,
        height: 200
      };

      // start camera
      CameraPreview.startCamera(
        cameraRect, // position and size of preview
        'front', // default camera
        true, // tape to take picture
        false, // disable drag
        true // send the preview to the back of the screen so we can add overlaying elements
      );

      // Set the handler to run every time we take a picture
      CameraPreview.setOnPictureTakenHandler().subscribe((result) => {
        console.log(result);
        // do something with the result
      });

      // take a picture
      CameraPreview.takePicture({
        maxWidth: 640,
        maxHeight: 640
      });

      // Switch camera
      CameraPreview.switchCamera();

      // set color effect to negative
      CameraPreview.setColorEffect('negative');

      // Stop the camera preview
      CameraPreview.stopCamera(); */
    }

    takePicture(): void{
      let options = {};
      Camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:
       let base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
       // Handle error
      });
    }
    defaultAction(): void {
      console.log(this.brigade);
      this.call('brigadesInsert', this.brigade, (e: Error) => {
        console.log(e)
        this.viewCtrl.dismiss().then(() => {
            if (e) return this.handleError(e);
        });
      });
      /*Brigades.insert(this.senderId,this.brigade, (e: Error) => {
        console.log(e)
        this.viewCtrl.dismiss().then(() => {
            if (e) return this.handleError(e);
        });
      })*/
        /*this.call('addBrigade', this.brigade, (e: Error) => {
            this.viewCtrl.dismiss().then(() => {
                if (e) return this.handleError(e);
            });
        });/**/
    }

    isReadonly(){
        return this.readOnly;
    }

    removeBrigada(chat): void {
      this.call('removeChat', chat._id);
    }
}
