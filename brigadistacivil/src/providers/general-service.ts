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
  public static selectedShape: any;

  constructor(public http: Http) {
    super(http);
  }

  /**
   * [loadMap description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  loadMap(mapElement, position, options = {}) {
    if(GeneralService.map && GeneralService.map.clear)GeneralService.map.clear();
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
        center: new google.maps.LatLng(-19.9364705,-43.980769),
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
      GeneralService.selectedShape = null;
    }
  }

  setSelection(shape,cb=null) {
    this.clearSelection(shape);
    GeneralService.selectedShape = shape;
    shape.setEditable(true);
    google.maps.event.addListener(shape.getPath(), 'set_at', () => { this.calcar(shape) });
    google.maps.event.addListener(shape.getPath(), 'insert_at', () => { this.calcar(shape) });
    if(cb) cb(shape);
  }

  calcar(shape) {
    //"Area =" + area.toFixed(2);
    const area = google.maps.geometry.spherical.computeArea(shape.getPath());
    GeneralService.selectedShape = shape;
    return area;
  }

  deleteSelectedShape(selectedShape=GeneralService.selectedShape) {
    if (selectedShape) {
      selectedShape.setMap(null);
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

  drawPolygon(map, points, cbAddPol, cbSelectPol=null) {
     var newShape;
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
        GeneralService.selectedShape = e.overlay;

        if (e.type != google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);

          let newShape = e.overlay;
          newShape.type = e.type;

          google.maps.event.addListener(newShape, 'click', () => {
            this.setSelection(newShape,cbSelectPol);
          });
          //"Area =" + area.toFixed(2);
          //const area = google.maps.geometry.spherical.computeArea(newShape.getPath());
          cbAddPol(newShape);
          this.setSelection(newShape,cbSelectPol);
        }
      });
      google.maps.event.addListener(map, 'click', () => { this.clearSelection(newShape); });
  }

  getPosition(cb) {
    if (BaseService.device == 'mobile') {
      Geolocation.getCurrentPosition().then((pos) => {
        cb(pos.coords);
      }).catch(e => { cb(e); });

      /*let watch = Geolocation.watchPosition();
      watch.subscribe((data) => {
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
      element.setMap(null);
    }else{
      element.remove();
    }
  }

  addPolygon(map,areas,cbSelectPol=null) {
    let options={
       paths: areas,
       strokeColor: '#FF0000',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     };
    if (BaseService.device == 'mobile') {
      map.addPolygon(options, function(polygon) {
         this.map.animateCamera({
           'target': polygon.getPoints()
         });
       });
    }else{
      var pol = new google.maps.Polygon(options);
       map.fitBounds(this.getBounds(pol.getPaths()));
       pol.setMap(map);
       google.maps.event.addListener(pol, 'click', () => {
         this.setSelection(pol,cbSelectPol);
       });
    }
  }

  /**
   * [addMissingMaps description]
   * @param  {[type]} paths ex.:  polygon.getPaths();
   * @return {[type]}       [description]
   */
  getBounds(paths){
    var bounds = new google.maps.LatLngBounds();
    var path;
    for (var i = 0; i < paths.getLength(); i++) {
        path = paths.getAt(i);
        for (var ii = 0; ii < path.getLength(); ii++) {
            bounds.extend(path.getAt(ii));
        }
    }
    return bounds;
  }

}
