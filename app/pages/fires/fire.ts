import {Component,ViewChild} from '@angular/core';
import {NavController, ViewController, AlertController,NavParams} from 'ionic-angular';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Chat, Message, Brigade, FireAlert} from 'api/models';
import BasicComponent from '../basic.ts'
import {Brigades} from 'api/collections';
import { GoogleMap, GoogleMapsEvent,GoogleMapsMarker,GoogleMapsLatLng,CameraPosition,GoogleMapsMarkerOptions } from 'ionic-native';

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
