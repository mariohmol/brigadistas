import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { GeoService } from '../../providers/geo-service';
import { GeneralService } from '../../providers/general-service';
import {  ViewChild, ElementRef } from '@angular/core';
import {TranslateService} from 'ng2-translate';
import { MapPage } from '.map';
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

  constructor(public app: App,public navCtrl: NavController, public navParams: NavParams,
    public fb: FormBuilder, public toastCtrl: ToastController, public translateService: TranslateService,
    public generalService: GeneralService, public geoService: GeoService) {
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
    if(!this.position && !(this.item && this.item.coordinates)){
      this.generalService.getPosition((pos)=>{
        this.position=pos;
        this.initMap();
      });
      this.initMap();
    }else{
      this.initMap();
    }
  }

  initMap(){
    if(this.item && this.item.coordinates){
      let pos={latitude: this.item.coordinates[1], longitude: this.item.coordinates[0]};
      this.loadMap(pos);
      if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
      GeneralService.marker = this.addMarker(pos,"Posição do Fogo");
    }else if(this.position){
      this.loadMap(this.position);
    }else{
      this.loadMap(null);
    }
    this.confMap();
  }

  confMap(){
    if(this.isReadonly()) return;
    this.generalService.drawMarker(GeneralService.map,event=>{
      if(GeneralService.marker)  this.generalService.removeElement(GeneralService.marker) ;
      let latlng=this.generalService.getEventLatLng(event);

      this.item.coordinates=[latlng.longitude, latlng.latitude];

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
    if(!this.item.coordinates){
      return this.showToast(this.translate("item.chooseLocation"));
    }
    if(this.item._id){
      this.item = Object.assign(this.item, this.itemForm.value);
      this.geoService.updateItem(this.item).then(d => {
        this.showToast(this.translate("item.status.updated"));
        this.openPage(MapPage);
      });
    }else{
      this.item = Object.assign(this.item, this.itemForm.value);
      this.geoService.addItem(this.item).then(d => {
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

}
