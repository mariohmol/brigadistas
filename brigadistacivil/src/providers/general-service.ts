import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker
} from 'ionic-native';
declare var google;

@Injectable()
export class GeneralService extends BaseService {
  public static dados: any = {};

  constructor(public http: Http) {
    super(http);
    console.log('Hello GeneralService Provider');
  }

  /**
   * [loadMap description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  loadMap(mapElement, position, options = {}) {
    let map;

    if (BaseService.device == 'mobile') {
      map = new GoogleMap(mapElement.nativeElement);

      // listen to MAP_READY event
      map.one(GoogleMapsEvent.MAP_READY).then(() => {

        if (position) {
          // create LatLng object
          let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(position.latitude, position.longitude);

          // create CameraPosition
          let cameraPos: CameraPosition = {
            target: ionic,
            zoom: 18,
            tilt: 30
          };

          // move the map's camera to position
          map.moveCamera(cameraPos);
        }
      });

      return map;
    } else {


      let mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      if (position) {
        //-34.9290, 138.6010
        let latLng = new google.maps.LatLng(position.latitude, position.longitude);
        mapOptions = Object.assign(mapOptions, { center: latLng });
      }
      mapOptions = Object.assign(mapOptions, options)

      if (mapElement) {
        map = new google.maps.Map(mapElement.nativeElement, mapOptions);
      } else {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }
      return map;
    }
  }


  addMarker(map, position, title) {
    if (BaseService.device == 'mobile') {
      if (!position) position = map.getCenter();
      // create new marker
      let markerOptions: GoogleMapsMarkerOptions = {
        position: position,
        title: title
      };

      map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
          marker.showInfoWindow();
        });

    } else {
      if (!position) position = map.getCenter();
      let marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: position
      });
      if (!title) return;
      this.addInfoWindow(map, marker, title);
    }

  }

  addInfoWindow(map, marker, content) {
    if (BaseService.device == 'mobile') { }
    else {
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    }
  }

  addPolygon(map, points) {
    map.addPolygon({
      'points': points,
      'strokeColor': '#AA00FF',
      'strokeWidth': 5,
      'fillColor': '#880000'
    }, function(polygon) {
      setTimeout(function() {
        polygon.remove();
      }, 3000);
    });
  }

  drawPolygon() {
    /*
    var drawingManager;

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
    });*/
    /**/
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
  }

}
