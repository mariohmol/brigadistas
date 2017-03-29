import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { GeoService,GeneralService } from '../../providers';
import {  ViewChild, ElementRef } from '@angular/core';
import {TranslateService} from 'ng2-translate';
declare var google;

@Component({
  selector: 'page-area',
  templateUrl: 'area.html'
})
export class AreaPage extends BasePage {
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

  loadData(){
    
  }

  ionViewDidLoad() {
    if(!this.position && !(this.item && this.item.coordinates)){
      this.generalService.getPosition((pos)=>{
        this.position=pos;
        this.initMap();
      });
      //this.initMap();
    }else{
      this.initMap();
    }
  }


  changeStatus(status){
    this.geoService.changeItemStatus(this.item._id,status).then(d=>{
      this.showToast(this.translate("item.status.updated"));
      this.loadData();
    });
  }


  initMap(){
  /*  let coords;
    GeneralService.polygons=<any>[];
    if(this.position)coords=this.position.coords;
      this.map = this.generalService.loadMap(this.mapElement,coords,{scrollwheel: false});

      let selectShapeCb = (function(obj){
          return shape=>{
            obj.selectedShape = shape;
          };
        })(this);

      if(this.brigade.area && (this.brigade.area.coordinates || this.brigade.area.length>0)){
        let a=this.brigade.area;
        if(this.brigade.area.coordinates) a=this.brigade.area.coordinates;
        a.forEach(area=>{
          if(!area || !area.map) return;
          let areas= area.map(a=>{
            return {lat: a[1], lng: a[0]};
          });
          this.generalService.addPolygon(this.map,areas,selectShapeCb);
        });
        if(!this.readonly) this.generalService.drawPolygon(this.map, [],null, selectShapeCb);
      }else{
        let newPolyCb = p=>{
          if(p.getPath().b.length>2){
            this.valid=true;
            this.readonly=false;
          }
        };
        if(!this.readonly) this.generalService.drawPolygon(this.map, [],newPolyCb, selectShapeCb);
      }*/
  }

  remove(){
  /*  this.showConfirm(this.translate("remove"), null,c=>{
      this.brigadeService.deleteArea(this.brigade._id);
      this.generalService.deleteSelectedShape();
    });*/
  }

  save(){
  /*  if(!GeneralService.selectedShape){
      this.openPageParam(BrigadePage, {brigade: this.brigade, brigadeId: this.brigade._id});
      return
    }
    let paths=[];
    console.log(GeneralService.polygons)
    GeneralService.polygons.forEach(p=>{
      let init;
      p.getPath().b.forEach((b,i)=>{
        if(i==0) init=[b.lng(), b.lat()];
        paths.push([b.lng(), b.lat()]);
      });
      paths.push(init);
    });
    if(!this.brigade.area) this.brigade.area={coordinates: []};
    else if(!this.brigade.area.coordinates) this.brigade.area.coordinates=[];
    this.brigade.area={type: 'Polygon',coordinates: [paths]};

    this.brigadeService.updateBrigade({
      _id: this.brigade._id,
      area: this.brigade.area
    }).then(c=>{
      this.showToast(this.translate("brigade.area.save"));
      this.loadData(true);
    });*/
  }

}
