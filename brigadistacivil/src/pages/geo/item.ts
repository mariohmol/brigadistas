import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, Platform, NavController, NavParams, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { GeoService,GeneralService } from '../../providers';
import {  ViewChild, ElementRef } from '@angular/core';
import {TranslateService} from 'ng2-translate';
import { MapPage } from './map';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
declare var google;

@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage extends BasePage {
  public item: any;
  public readonly: boolean;
  public position: any;
  public isBrigade: boolean;
  @ViewChild('map') mapElement: ElementRef;
  itemForm: FormGroup;
  itemFormFields: any;
  public image: any;

  constructor(public app: App, public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams,
    public fb: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService,
    public generalService: GeneralService, public geoService: GeoService,
    public camera: Camera, public imagePicker: ImagePicker) {
    super();

    this.itemFormFields = {
      title: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['', [<any>Validators.required]],
      category: ['', [<any>Validators.required]]
    };

    this.itemForm = this.fb.group(this.itemFormFields);

    if (this.navParams.get("item")) {
      this.item = this.navParams.get("item");
      this.loadData();
    }else if (this.navParams.get("itemId")) {
      this.item = {_id: this.navParams.get("itemId")};
      this.loadData();
    } else {
      this.item = {};
      this.readonly = false;
    }
  }

  ionViewDidLoad() {
    if(!this.position && !(this.item && this.item.loc && this.item.loc.coordinates)){
      this.generalService.getPosition((pos)=>{
        this.position=pos;
        this.initMap();
      });
      setTimeout(function(){ if(!GeneralService.map) this.initMap(); }, 10000);
    }else{
      this.initMap();
    }
  }

  initMap(){
    if(this.item && this.item.loc){
      let pos={latitude: this.item.loc.coordinates[1], longitude: this.item.loc.coordinates[0]};
      this.loadMap(pos,{},this.confMap);
      if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
      GeneralService.marker = this.addMarker(pos,"Posição do Ítem");
    }else if(this.position){
      this.loadMap(this.position,{},this.confMap);
    }else{
      this.loadMap(null,{},this.confMap);
    }
  }

  confMap(){
    if(this.isReadonly()) return;
    this.generalService.drawMarker(GeneralService.map,event=>{
      if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
      let latlng=this.generalService.getEventLatLng(event);

      this.item.loc={type: "Point", coordinates: [latlng.longitude, latlng.latitude]};

      this.generalService.addMarker(GeneralService.map,latlng,"Posição do Item",m=>{
        GeneralService.marker=m;
      });
    });
  }

  loadData(){
    if(!this.item) return;
    this.geoService.getItem(this.item._id).then(d=>{
      this.item=d;
      this.setDataForm(this.itemForm,this.itemFormFields,this.item);
      this.readonly=false;
      if(this.item && this.item.users){
        let userId=this.currentUser()._id;
        let findUser= this.item.users.find(b=>{ return b==userId });
        if(findUser) this.readonly=false;
      }
    });
  }


  save() {
    if(!this.item.loc){
      return this.showToast(this.translate("item.chooseLocation"));
    }
    if(this.item._id){
      this.item = Object.assign(this.item, this.itemForm.value);
      this.geoService.updateItem(this.item).then(d => {
        this.item=d;
        this.uploadPic(); 
        this.showToast(this.translate("item.status.updated"));
        this.openPage(MapPage);
      });
    }else{
      this.item = Object.assign(this.item, this.itemForm.value);
      this.geoService.addItem(this.item).then(d => {
        this.item=d;
        this.uploadPic(); 
        this.showToast(this.translate("item.status.new"));
        this.openPage(MapPage);
      });
    }
  }

  changeStatus(status){
    this.geoService.changeItemStatus(this.item._id,status).then(d=>{
      this.showToast(this.translate("item.status.updated"));
      this.loadData();
    });
  }

  getPic(){
    this.getPicture(d=>{ this.image=d; });
  }

  takePic(){
    this.takePicture(d=>{ this.image=d; });
  }

  getWebPic(){
    return (data)=>{
      this.image=data; 
    }
  }

  uploadPic(){
     if(!this.item._id || !this.image) return;
     this.generalService.postFile("item",this.item._id, this.image).then(d=>{
      this.item=d;
     });
  }

}
