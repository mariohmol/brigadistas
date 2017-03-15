import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { UserService } from '../../providers/user-service';
import { BrigadeService } from '../../providers/brigade-service';
import { GeneralService } from '../../providers/general-service';
import {TranslateService} from 'ng2-translate';
declare var google;

@Component({
  selector: 'page-brigadearea',
  templateUrl: 'area.html'
})
export class BrigadeAreaPage {
  public brigade: any;
  public position: any;
  @ViewChild('map') mapElement: ElementRef;
  public readonly: boolean;
  map: any;
  valid: boolean;

  constructor(public navParams: NavParams,
    public translateService: TranslateService,public alertCtrl: AlertController,
    public userService: UserService,public toastCtrl: ToastController,
    public generalService: GeneralService) {

    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");
      this.readonly=this.navParams.get("readonly");
      //TODO: this.valid=false;
    } else{
      this.brigade={};
      this.readonly=false;
      this.valid=false;
    }
  }

  showMap(){
    let cb = ()=>{
      let coords;
      if(this.position)coords=this.position.coords;
        this.map = this.generalService.loadMap(this.mapElement,coords,{scrollwheel: false});
        //this.generalService.drawPolygon(this.map, [],cb) ;

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


}
