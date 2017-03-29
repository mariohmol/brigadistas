import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavController, NavParams, AlertController, ToastController, PopoverController } from 'ionic-angular';
import BasePage from '../basepage';
import { UserService,GeneralService,GeoService } from '../../providers';
import { MapOptionsComponent } from './mapoptions';
import {TranslateService} from 'ng2-translate';
declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage extends BasePage {
  public position: any;
  public items: [any];
  @ViewChild('map') mapElement: ElementRef;
  public readonly: boolean;
  public selectedShape: any;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public translateService: TranslateService, public geoService: GeoService,
    public alertCtrl: AlertController,
    public userService: UserService, public toastCtrl: ToastController,
    public generalService: GeneralService) {
    super();
    this.readonly = true;

  }

  ionViewDidLoad() {
    this.showMap();
  }


  showMap() {

    let addPosition = (pos) => {
      this.position = pos;
      this.initMap();
    }

    if (!this.position) {
      this.generalService.getPosition(addPosition);
    } else {
      this.initMap();
    }
  }

  initMap() {
    let coords;
    GeneralService.polygons = <any>[];
    if (this.position && this.position.coords) coords = this.position.coords;
    else if (this.position) coords = this.position;
    this.map = this.generalService.loadMap(this.mapElement, coords, { scrollwheel: false });

    let selectShapeCb = (function(obj) {
      return shape => {
        obj.selectedShape = shape;
      };
    })(this);

    this.geoService.getItemsByLoc(coords.longitude, coords.latitude).then(d => {
      this.items = <any>d;
      if (this.items) {
        this.items.forEach(item => {
          if (item.loc && item.loc.coordinates && item.loc.coordinates.length) {
            let c = item.loc.coordinates;
            if(item.loc.type=="Point"){
              let pos={latitude: c[1], longitude: c[0]};
              this.generalService.addMarker(this.map,pos,`${item.title} (${item.category})`);
            }else if(item.loc.type=="Polygon"){
              c.forEach(area => {
                let areas = area.map(a => {
                  return { lat: a[1], lng: a[0] };
                });
                this.generalService.addPolygon(this.map, areas, selectShapeCb);
              });
            }
          }
        });
      }
    });


  }

  showOptions(): void {
    const popover = this.popoverCtrl.create(MapOptionsComponent, {}, {
      cssClass: 'options-popover chats-options-popover'
    });

    popover.present();
  }
}
