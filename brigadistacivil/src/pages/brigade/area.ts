import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavParams, AlertController, ToastController, Events } from 'ionic-angular';
import BasePage from '../basepage';
import { BrigadeService,GeneralService,UserService } from '../../providers';
import {TranslateService} from 'ng2-translate';
import { BrigadePage } from './brigade';
declare var google;

@Component({
  selector: 'page-brigadearea',
  templateUrl: 'area.html'
})
export class BrigadeAreaPage extends BasePage {
  public brigade: any;
  public position: any;
  public isBrigade: boolean;
  public isLeader: boolean;
  @ViewChild('map') mapElement: ElementRef;
  public readonly: boolean;
  map: any;
  valid: boolean;
  public selectedShape: any;

  constructor(public app: App, public navParams: NavParams,public events: Events,
    public translateService: TranslateService,public alertCtrl: AlertController,
    public userService: UserService,public toastCtrl: ToastController,
    public generalService: GeneralService, public brigadeService: BrigadeService) {
      super();

    events.subscribe('brigade:loaded', ()=>{
      this.ionViewDidLoad();
    });

     events.subscribe('brigade:save', ()=>{
      this.save();
    });
  }

  ionViewDidLoad() {
    this.loadData(false);
  }

  loadData(force){
    if(this.navParams.get("brigade") && !force){
      this.brigade=this.navParams.get("brigade");
      this.readonly=this.navParams.get("readonly");
      this.initData()
      //TODO: this.valid=false;
    } else if(this.navParams.get("brigadeId")){
      this.brigadeService.getBrigade(this.navParams.get("brigadeId")).then(d=>{
        this.brigade=d;
        this.initData()
      });
    }else if(BrigadeService.data.brigade){
      this.brigade=BrigadeService.data.brigade;
      this.initData();
    }
    else{
      this.brigade={};
      this.readonly=false;
      this.valid=false;
    }

    
  }

  initData(){
       const {isLeader,isBrigade,readonly} = this.brigadeService.userPerms(UserService.loginData,this.brigade);
      this.isLeader=isLeader; this.isBrigade=isBrigade; this.readonly=readonly;
      this.showMap();
    }

  showMap(){
    let addPosition= (pos)=>{
      this.position=pos;
      this.initMap();
    }

    if(!this.position){
      this.generalService.getPosition(addPosition);
      setTimeout(function(){ if(!GeneralService.map) this.initMap(); }, 10000);
    }else{
      this.initMap();
    }
  }

  initMap(){
    let coords;
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
      }
  }

  remove(){
    this.showConfirm(this.translate("remove"), null,c=>{
      this.brigadeService.deleteArea(this.brigade._id);
      this.generalService.deleteSelectedShape();
    });
  }

  save(){
    if(!GeneralService.selectedShape){
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
    });
  }

}
