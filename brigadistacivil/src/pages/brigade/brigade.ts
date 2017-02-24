import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import BasePage from '../basepage';
import BrigadesPage from './brigades'
import { BrigadeService} from '../../providers/brigade-service';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage  extends BasePage{
  public brigade: any;
  public readonly: boolean;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public brigadeService: BrigadeService) {
    super();

    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");
      this.readonly=true;
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
      this.openPage(BrigadesPage);
    });
  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    //this.addInfoWindow(marker, content);

  }


  loadMap(position){
     var drawingManager;


      //-34.9290, 138.6010
     let latLng = new google.maps.LatLng(position.latitude, position.longitude);

     let mapOptions = {
       center: latLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };

     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

     var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
      };

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
          ]
        },
        polygonOptions: polyOptions,
        map: this.map
      });
        /*
      google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {

          this.selectedShape=e.overlay

          if (e.type != google.maps.drawing.OverlayType.MARKER) {
              // Switch back to non-drawing mode after drawing a shape.
              drawingManager.setDrawingMode(null);

              // Add an event listener that selects the newly-drawn shape when the user
              // mouses down on it.
              newShape = e.overlay;
              newShape.type = e.type;

              google.maps.event.addListener(newShape, 'click', ()=> {

                this.setSelection(newShape);


              });
            }
      })

      */
    /* map.addPolygon({
        'points': GORYOKAKU_POINTS,
        'strokeColor' : '#AA00FF',
        'strokeWidth': 5,
        'fillColor' : '#880000'
      }, function(polygon) {
        setTimeout(function() {
          polygon.remove();
        }, 3000);
      });*/


 }

  isReadonly(){
    return this.readonly;
  }

}
