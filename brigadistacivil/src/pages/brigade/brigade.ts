import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import BasePage from '../basepage';
import {BrigadesPage} from './brigades'
import { UserService } from '../../providers/user-service';
import { BrigadeService } from '../../providers/brigade-service';
import { Geolocation } from 'ionic-native';
import {TranslateService} from 'ng2-translate';
declare var google;

@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage  extends BasePage{
  public brigade: any;
  @ViewChild('map') mapElement: ElementRef;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService,public brigadeService: BrigadeService,
    public userService: UserService) {
    super();

    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");

      this.brigadeService.getBrigade(this.brigade._id).then(d=>{
        this.brigade=d;
        console.log(this.brigade);
        if(this.brigade && this.brigade.leaders && this.brigade.leaders.find(d=>{return d._id==UserService.loginData._id}))
          this.readonly=false;
        else this.readonly=true;
      });

    } else{
      this.brigade={};
      this.readonly=false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrigadePage');
      Geolocation.getCurrentPosition().then((position) => {
        this.loadMap(position.coords);
      });

  }

  save(){
    this.brigadeService.addBrigade(this.brigade).then(d=>{
      console.log("hehehehe",d);
      this.showToast(this.translate.get("brigade.new.warning"));
      this.openPage(BrigadesPage);
    });
  }

}
