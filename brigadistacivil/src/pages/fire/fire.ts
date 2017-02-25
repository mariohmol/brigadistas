import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import BasePage from '../basepage';
import { Geolocation } from 'ionic-native';
import { FiresPage } from './fires';
import { FireService } from '../../providers/fire-service';
import {  ViewChild, ElementRef } from '@angular/core';
declare var google;

@Component({
  selector: 'page-fire',
  templateUrl: 'fire.html'
})
export class FirePage extends BasePage {
  public fire: any;
  public readonly: boolean;
  public marker: any;
  public position: any;
  @ViewChild('map') mapElement: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireService: FireService) {
    super();
    if (this.navParams.get("fire")) {
      this.fire = this.navParams.get("fire");
      this.readonly = true;
    } else {
      this.fire = {};
      this.readonly = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
    let cb = ()=>{
      this.loadMap(this.position);
      this.confMap();
    }
    if(!this.position){
      Geolocation.getCurrentPosition().then((pos) => {
        this.position=pos.coords;
        cb();
      });
    }else  cb();
  }

  confMap(){
    google.maps.event.addListener(this.map, 'click', event => {
      if(this.marker) this.marker.setMap(null);
      console.log(event.latLng);
      this.fire.coordinates=[event.latLng.lat(), event.latLng.lng()];
      this.marker = this.addMarker(event.latLng,"Posição do Fogo");
    });
  }


  save() {
    this.fireService.addFire(this.fire).then(d => {
      this.openPage(FiresPage);
    });
  }

  isReadonly() {
    return this.readonly;
  }


  addInfoWindow(marker, content){
   let infoWindow = new google.maps.InfoWindow({
     content: content
   });
   google.maps.event.addListener(marker, 'click', () => {
     infoWindow.open(this.map, marker);
   });
 }

 findTransit(){
   var request = {
     location: this.currentLocation,
     radius: '5000',
     types: ['train_station']
   };

   // Create the PlaceService and send the request.
   // Handle the callback with an anonymous function.
   var service = new google.maps.places.PlacesService(this.map);
   service.nearbySearch(request, function(results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0; i < results.length; i++) {
         var place = results[i];
         // If the request succeeds, draw the place location on
         // the map as a marker, and register an event to handle a
         // click on the marker.
         console.log(place.geometry.location);
         new google.maps.Marker({
           map: this.map,
           position: place.geometry.location
         });
       }
     }
   });
 }

}
