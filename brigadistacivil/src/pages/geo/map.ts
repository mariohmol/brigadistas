import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavController, NavParams, AlertController,ToastController, PopoverController } from 'ionic-angular';
import BasePage from '../basepage';
import { UserService } from '../../providers/user-service';
import { BrigadeService } from '../../providers/brigade-service';
import { GeneralService } from '../../providers/general-service';
import { MapOptionsComponent } from './mapoptions';
import {TranslateService} from 'ng2-translate';
declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage  extends BasePage{
  public brigade: any;
  public position: any;
  @ViewChild('map') mapElement: ElementRef;
  public readonly: boolean;
  valid: boolean;
  public selectedShape: any;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public translateService: TranslateService,public brigadeService: BrigadeService,
    public alertCtrl: AlertController,
    public userService: UserService,public toastCtrl: ToastController,
    public generalService: GeneralService) {
    super();
    this.readonly=true;

  }

  ionViewDidLoad() {
      this.showMap();
  }

  showMap(){
    let cb = ()=>{
      let coords;
      GeneralService.polygons=<any>[];
      if(this.position)coords=this.position.coords;
        this.map = this.generalService.loadMap(this.mapElement,coords,{scrollwheel: false});

        let selectShapeCb = (function(obj){
            return shape=>{
              obj.selectedShape = shape;
            };
          })(this);

        /*if(this.brigade.area && (this.brigade.area.coordinates || this.brigade.area.length>0)){
          let a=this.brigade.area;
          if(this.brigade.area.coordinates) a=this.brigade.area.coordinates;
          a.forEach(area=>{
            let areas= area.map(a=>{
              return {lat: a[1], lng: a[0]};
            });
            this.generalService.addPolygon(this.map,areas,selectShapeCb);
          });
        }else{
          let newPolyCb = p=>{
            if(p.getPath().b.length>2){
              this.valid=true;
              this.readonly=false;
            }
          };
        }*/
    }

    let addPosition= (pos)=>{
      this.position=pos;
      cb();
    }

    if(!this.position){
      this.generalService.getPosition(addPosition);
    }else{
      cb();
    }

  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(MapOptionsComponent, {}, {
      cssClass: 'options-popover chats-options-popover'
    });

    popover.present();
  }
}
