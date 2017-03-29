import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { FiresPage } from './fires';
import { ChatPage } from '../chat/chat';
import { FireService } from '../../providers/fire-service';
import { GeneralService } from '../../providers/general-service';
import { ChatService } from '../../providers/chat-service';
import {  ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { UserService } from "../../providers/user-service";
declare var google;

@Component({
  selector: 'page-fire',
  templateUrl: 'fire.html'
})
export class FirePage extends BasePage {
  public fire: any;
  public readonly: boolean;
  public position: any;
  public isBrigade: boolean;
  @ViewChild('map') mapElement: ElementRef;
  fireForm: FormGroup;
  fireFormFields: any;

  constructor(public app: App,public navCtrl: NavController, public navParams: NavParams, public fireService: FireService,
    public fb: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService,
    public generalService: GeneralService, public chatService: ChatService, public userService: UserService) {
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
    }else if (this.navParams.get("fireId")) {
      this.fire = {_id: this.navParams.get("fireId")};
      this.loadData();
    } else {
      this.fire = {};
      this.readonly = false;
    }
  }

  ionViewDidLoad() {
    let cb = () => {
      if(this.fire && this.fire.coordinates){
        let pos={latitude: this.fire.coordinates[1], longitude: this.fire.coordinates[0]};
        this.loadMap(pos,{},()=>{this.confMap()});
        if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
        GeneralService.marker = this.addMarker(pos,"Posição do Fogo");
      }else if(this.position){
        this.loadMap(this.position,{},()=>{this.confMap();});
      }else{
        this.loadMap(null,{},()=>{this.confMap();});
      }
    }

    if(!this.position && !(this.fire && this.fire.coordinates)){
      let addPosition= (pos)=>{
        this.position=pos;
        cb();
      }
      this.generalService.getPosition(addPosition);
      setTimeout(function(){ if(!GeneralService.map) this.initMap(); }, 10000);
    }else{
      cb();
    }
  }

  confMap(){
    if(this.isReadonly()) return;
    this.generalService.drawMarker(GeneralService.map,event=>{
      if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
      let latlng=this.generalService.getEventLatLng(event);

      this.fire.coordinates=[latlng.longitude, latlng.latitude];

      this.generalService.addMarker(GeneralService.map,latlng,"Posição do Fogo",m=>{
        GeneralService.marker=m;
      });
    });
    this.getTracks(this.fire);
  }

  getTracks(fire){
    let colors=this.generalService.colors();
    this.fireService.getTracks(fire._id).then((resp)=>{
      let tracks = <any>resp;
      tracks.forEach((track,i)=>{
        if(!track.line) return;

        let cindex=i;
        if(cindex>colors.length) cindex-=colors.length;
        let userColor = colors[cindex];

        this.generalService.addPolyline(GeneralService.map, track.line.coordinates , {
          strokeColor: userColor,
          fillColor: userColor,
          content: track.user.name
        });
      });
    })
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

  openChat(){
    this.chatService.getChatByFire(this.fire).then((chat:any)=>{
      if(!chat) return this.showToast(this.translate("chat.notfound"));
      this.navCtrl.push(ChatPage,{ chat, chatId: chat._id});
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
        this.showToast(this.translate('error.notavailableweb'));
        FiresPage.isTracking = false;
      }
      FiresPage.isTracking = true;
      this.fireService.startTracking(cb,errcb);
    }else {
      FiresPage.isTracking = false;
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
   var service = new google.maps.places.PlacesService(GeneralService.map);
   service.nearbySearch(request, function(results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0; i < results.length; i++) {
         var place = results[i];
         // If the request succeeds, draw the place location on
         // the map as a marker, and register an event to handle a
         // click on the marker.
         new google.maps.Marker({
           map: GeneralService.map,
           position: place.geometry.location
         });
       }
     }
   });
 }

}
