import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { FiresPage } from './fires';
import { FireService } from '../../providers/fire-service';
import { GeneralService } from '../../providers/general-service';
import {  ViewChild, ElementRef } from '@angular/core';
import {TranslateService} from 'ng2-translate';
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
  public isBrigade: boolean;
  @ViewChild('map') mapElement: ElementRef;
  fireForm: FormGroup;
  fireFormFields: any;

  constructor(public app: App,public navCtrl: NavController, public navParams: NavParams, public fireService: FireService,
    public fb: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService,
    public generalService: GeneralService) {
    super();

    this.fireFormFields = {
      title: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['', [<any>Validators.required]],
      intensity: ['', [<any>Validators.required]]
    };

    this.fireForm = this.fb.group(this.fireFormFields);

    if (this.navParams.get("fire")) {
      this.fire = this.navParams.get("fire");
      this.loadData();
    } else {
      this.fire = {};
      this.readonly = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
    let cb = ()=>{
      if(this.fire && this.fire.coordinates){
        let pos={latitude: this.fire.coordinates[0], longitude: this.fire.coordinates[1]};
        this.loadMap(pos);
        this.marker = this.addMarker(pos,"Posição do Fogo");
      }else if(this.position){
        this.loadMap(this.position);
      }
      this.confMap();
    }

    if(!this.position && !(this.fire && this.fire.coordinates)){
      let addPosition= (pos)=>{
        this.position=pos;
        cb();
      }
      this.generalService.getPosition(addPosition);

    }else{
      cb();
    }
  }

  confMap(){
    if(this.isReadonly()) return;
    this.generalService.drawMarker(this.map,event=>{
      if(this.marker)  this.generalService.removeElement(this.marker) ;
      let latlng=this.generalService.getEventLatLng(event);

      this.fire.coordinates=[latlng.latitude, latlng.longitude];

      this.generalService.addMarker(this.map,latlng,"Posição do Fogo",m=>{
        this.marker=m;
      });
    });

  }

  loadData(){
    if(!this.fire) return;
    this.fireService.getFire(this.fire._id).then(d=>{
      this.fire=d;
      this.setDataForm(this.fireForm,this.fireFormFields,this.fire);

      if(this.fire.brigades){
        let userId=this.currentUser()._id;
        let findUser= this.fire.brigades.find(b=>{
          if(!b.brigades) return;
          let findUser = b.brigades.find(bu=>{
            return  userId==bu;
          })
          if(findUser) return true;
          return false;
        });
        if(findUser)  this.isBrigade = true;
        else   this.isBrigade = false;
      }
      else this.isBrigade = false;

      if(this.fire && this.isBrigade)
        this.readonly=false;
      else this.readonly=true;
    });
  }


  save() {
    if(!this.fire.coordinates){
      return this.showToast(this.translate("fire.chooseLocation"));
    }
    if(this.fire._id){
      this.fire = Object.assign(this.fire, this.fireForm.value);
      this.fireService.updateFire(this.fire).then(d => {
        this.openPage(FiresPage);
      });
    }else{
      this.fire = Object.assign(this.fire, this.fireForm.value);
      this.fireService.addFire(this.fire).then(d => {
        this.openPage(FiresPage);
      });
    }
  }

  changeStatus(status){
    this.fireService.doPut(`/fire/status/${this.fire._id}/${status}`).then(d=>{
      this.showToast(this.translate("fire.status.updated"));
      this.loadData();
    });
  }

  isInBrigade(){
    return this.isBrigade && this.fire._id!=null;
  }

  isReadonly() {
    return this.readonly;
  }

  isTracking(){
    return FiresPage.isTracking;
  }

  tracking(){
    if (!FiresPage.isTracking) {
      let cb = (location)=>{
        this.userService.saveLocation(location.latitude, location.longitude, this.fire._id);
        FiresPage.isTracking = true;
      };
      let errcb = ()=>{
        alert('Error ao conectar comseu GPS');
        FiresPage.isTracking = false;
      }
      this.fireService.startTracking(cb,errcb);
    }else {
      this.fireService.stopTracking();
    }
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
