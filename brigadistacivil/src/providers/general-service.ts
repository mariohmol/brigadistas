import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from './base-service';
import { Geolocation } from 'ionic-native';
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
  public static map: any;
  public static marker: any;
  public static polygon: any;
  public static markers: [any];
  public static polygons: [any];
  public selectedShape: any;

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
    if(GeneralService.map && GeneralService.map.clear)GeneralService.map.clear();
    console.log(BaseService.device);
    if (BaseService.device == 'mobile') {
      GeneralService.map = new GoogleMap(mapElement.nativeElement);

      // listen to MAP_READY event
      GeneralService.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        if (position) {
          // create LatLng object
          let posLatLng: GoogleMapsLatLng = new GoogleMapsLatLng(position.latitude, position.longitude);

          // create CameraPosition
          let cameraPos: CameraPosition = {
            target: posLatLng,
            zoom: 18,
            tilt: 30
          };

          // move the map's camera to position
          GeneralService.map.moveCamera(cameraPos);
        }
      });

      return GeneralService.map;
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
        GeneralService.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
      } else {
        GeneralService.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }
      return GeneralService.map;
    }
  }


  addMarker(map, position, title, cb = null) {
    if (BaseService.device == 'mobile') {
      let posLatLng: GoogleMapsLatLng;

      if (!position) posLatLng = map.getCenter();
      else {
        posLatLng = new GoogleMapsLatLng(position.latitude, position.longitude);
      }
      // create new marker
      let markerOptions: GoogleMapsMarkerOptions = {
        position: posLatLng,
        title: title
      };

      map.addMarker(markerOptions)
        .then((marker: GoogleMapsMarker) => {
          if (cb) cb(marker);
          marker.showInfoWindow();
        });

    } else {
      let latlng;
      if (!position) position = map.getCenter();
      else {
        latlng = new google.maps.LatLng(position.latitude, position.longitude);
      }
      let marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: latlng
      });
      if (!title) return;
      this.addInfoWindow(map, marker, title);
      if (cb) cb(marker);
    }

  }

  clearSelection(shape) {
    if (shape) {
      shape.setEditable(false);
      this.selectedShape = null;
    }
  }

  setSelection(shape) {
    this.clearSelection(shape);
    this.selectedShape = shape;

    console.log(shape.getPath())

    shape.setEditable(true);
    google.maps.event.addListener(shape.getPath(), 'set_at', () => { this.calcar(shape) });
    google.maps.event.addListener(shape.getPath(), 'insert_at', () => { this.calcar(shape) });
  }

  calcar(shape) {
    const area = google.maps.geometry.spherical.computeArea(shape.getPath());
    document.getElementById("area").innerHTML = "Area =" + area.toFixed(2);

    this.selectedShape = shape;
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
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

  addPolygon(map, points, cb) {
     var minZoomLevel = 15, newShape;
    const polyOptions = {
       strokeWeight: 0,
       fillOpacity: 0.45,
       editable: true
     };

    const drawingManager = new google.maps.drawing.DrawingManager({
       drawingControl: true,
       drawingControlOptions: {
         drawingModes: [
           google.maps.drawing.OverlayType.POLYGON,
         ]
       },
       polygonOptions: polyOptions,
       map: map
     });

     google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
        this.selectedShape = e.overlay;

        if (e.type != google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);

          let newShape = e.overlay;
          newShape.type = e.type;

          google.maps.event.addListener(newShape, 'click', () => {
            this.setSelection(newShape);
          });

          const area = google.maps.geometry.spherical.computeArea(newShape.getPath());
          document.getElementById("area").innerHTML = "Area =" + area.toFixed(2);

          this.setSelection(newShape);
        }
      });

      google.maps.event.addListener(map, 'click', () => { this.clearSelection(newShape); });
      //google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', () => { this.deleteSelectedShape(); });


  /*  map.addPolygon({
      'points': points,
      'strokeColor': '#AA00FF',
      'strokeWidth': 5,
      'fillColor': '#880000'
    }, function(polygon) {
      cb(polygon);
      map.animateCamera({
        'target': polygon.getPoints()
      });
    });*/
  }

  getPosition(cb) {
    if (BaseService.device == 'mobile') {
      Geolocation.getCurrentPosition().then((pos) => {
        console.log(pos);
        cb(pos.coords);
      }).catch(e => { console.log(e); cb(); });

      /*let watch = Geolocation.watchPosition();
      watch.subscribe((data) => {
        console.log(data);
       // data can be a set of coordinates, or an error (if an error occurred).
       // data.coords.latitude
       // data.coords.longitude
     });*/
    }
    else {
      //using navigator
      if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };

        //position.coords.latitude,position.coords.longitude
        navigator.geolocation.getCurrentPosition(pos => {
          cb(pos.coords);
        }, error => {
          cb();
        }, options);
      }
    }
  }

  drawMarker(map, cb) {
    if (BaseService.device == 'mobile') {
      map.addEventListener(GoogleMapsEvent.MAP_CLICK).subscribe(cb);
    } else {
      google.maps.event.addListener(map, 'click', event => {
        cb(event)
      });
    }
  }

  getEventLatLng(event){
    let latlng;
    if(event.latLng){
      latlng = {latitude: event.latLng.lat(), longitude: event.latLng.lng()};
    }else if(event.lat && event.lng){
      latlng = {latitude: event.lat, longitude: event.lng};
    }else{
      latlng = {latitude: event.latitude, longitude: event.longitude};
    }
    return latlng;
  }

  removeElement(element){
    if(element.setMap){
      console.log("setMap()")
      element.setMap(null);
    }else{
      console.log("remove()")
      element.remove();
    }
  }

  drawPolygon(map, points, cb) {
    google.maps.event.addListener(map, 'click', event => {
      cb(event)
    });

    let doPolygon = d => {

    };
    this.addPolygon(map, points, doPolygon);

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
