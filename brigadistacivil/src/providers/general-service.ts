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
declare var google, cordova;

@Injectable()
export class GeneralService extends BaseService {
  public static dados: any = {};
  public static map: any;
  public static marker: any;
  public static polygon: any;
  public static polylines: [any] = <any>[];
  public static markers: [any];
  public static polygons: [any] = <any>[];
  public static selectedShape: any;

  constructor(public http: Http) {
    super(http);
  }

  /**
   * [loadMap description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  loadMap(mapElement, position, options = {}, cb = null) {
    try {
      if (GeneralService.map && GeneralService.map.clear)
        GeneralService.map.clear();
    } catch (e) {
      console.log(e);
    }

    if (BaseService.device == 'mobile') {
      GeneralService.map = new GoogleMap(mapElement.nativeElement, options);

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
          if (cb) cb();
        }
      });

      return GeneralService.map;
    } else {

      let mapOptions = {
        center: new google.maps.LatLng(-19.9364705, -43.980769),
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
      if (cb) cb();
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

  setSelection(shape, cb = null) {
    this.clearSelection(shape);
    GeneralService.selectedShape = shape;
    shape.setEditable(true);
    google.maps.event.addListener(shape.getPath(), 'set_at', () => { this.calcar(shape) });
    google.maps.event.addListener(shape.getPath(), 'insert_at', () => { this.calcar(shape) });
    if (cb) cb(shape);
  }

  calcar(shape) {
    //"Area =" + area.toFixed(2);
    const area = google.maps.geometry.spherical.computeArea(shape.getPath());
    GeneralService.selectedShape = shape;
    return area;
  }

  deleteSelectedShape(selectedShape = GeneralService.selectedShape) {
    GeneralService.polygons = <any>GeneralService.polygons.filter(p => {
      let pPaths = [];
      p.getPath().b.forEach(b => {
        pPaths.push([b.lng(), b.lat()]);
      });

      let bSelected = GeneralService.selectedShape.getPath().b;
      if (bSelected.length != pPaths.length) return false;

      let found = true;
      bSelected.forEach((b, i) => {
        if (pPaths[i][0] != b.lng() || pPaths[i][1] != b.lat()) found = false;
      });
      return found;

    });
    if (selectedShape) {
      selectedShape.setMap(null);
    }
  }

  addInfoWindow(map, marker, content) {
    if (BaseService.device == 'mobile' || BaseService.device == 'web') {
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    }
  }

  drawPolygon(map, points, cbAddPol, cbSelectPol = null) {
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
      GeneralService.polygons.push(GeneralService.selectedShape);

      if (e.type != google.maps.drawing.OverlayType.MARKER) {
        drawingManager.setDrawingMode(null);

        let newShape = e.overlay;
        newShape.type = e.type;

        google.maps.event.addListener(newShape, 'click', () => {
          this.setSelection(newShape, cbSelectPol);
        });
        //"Area =" + area.toFixed(2);
        //const area = google.maps.geometry.spherical.computeArea(newShape.getPath());
        if (cbAddPol) cbAddPol(newShape);
        this.setSelection(newShape, cbSelectPol);
      }
    });
    google.maps.event.addListener(map, 'click', () => { this.clearSelection(newShape); });
  }

  getPosition(cb) {
    if (BaseService.device == 'mobile') {

      cordova.plugins.diagnostic.isLocationAvailable(function (available) {
        Geolocation.getCurrentPosition().then((pos) => {
          cb(pos.coords);
        }).catch(e => {
          cb();
        });
      }, function (error) {
        //console.error("The following error occurred: "+error);
        cb();
      });
      /*let watch = Geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred). data.coords.latitude, data.coords.longitude
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
        }, options); ``
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

  getEventLatLng(event) {
    let latlng;
    if (event.latLng) {
      latlng = { latitude: event.latLng.lat(), longitude: event.latLng.lng() };
    } else if (event.lat && event.lng) {
      latlng = { latitude: event.lat, longitude: event.lng };
    } else if (event.latitude && event.longitude) {
      latlng = { latitude: event.latitude, longitude: event.longitude };
    } else {
      latlng = { latitude: event[1], longitude: event[0] };
    }
    return latlng;
  }

  removeElement(element) {
    if (element.setMap) {
      element.setMap(null);
    } else {
      element.remove();
    }
  }

  addPolygon(map, areas, cbSelectPol = null) {
    let options = {
      paths: areas,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    };
    if (BaseService.device == 'mobile') {
      map.addPolygon(options, function (polygon) {
        this.map.animateCamera({
          'target': polygon.getPoints()
        });
        GeneralService.polygons.push(polygon);
      });
    } else {
      var pol = new google.maps.Polygon(options);
      map.fitBounds(this.getBounds(pol.getPaths()));
      pol.setMap(map);
      GeneralService.polygons.push(pol);
      google.maps.event.addListener(pol, 'click', () => {
        this.setSelection(pol, cbSelectPol);
      });
    }
  }

  /**
   * 
   * @param map 
   * @param areas  var flightPlanCoordinates = [
          {lat: 37.772, lng: -122.214},
          {lat: 21.291, lng: -157.821},
          {lat: -18.142, lng: 178.431},
          {lat: -27.467, lng: 153.027}
        ];
   * @param optionsArg 
   */
  addPolyline(map, areas, optionsArg = {}) {
    let latlngArea = areas.map(a => {
      return { lat: a[1], lng: a[0] };
    })
    let options = {
      ...{
        path: latlngArea,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        content: null
      }, ...optionsArg
    };

    if (BaseService.device == 'mobile') {
      map.addPolyline(options, function (polyline) {
        GeneralService.polylines.push(polyline);
        this.addInfoWindow(map, polyline, options.content);
      });
    } else {

      var polyline = new google.maps.Polyline(options);
      polyline.setMap(map);
      GeneralService.polylines.push(polyline);
      if (options.content) {
        this.addInfoWindow(map, polyline, options.content);
      }
    }

  }

  /**
   * [addMissingMaps description]
   * @param  {[type]} paths ex.:  polygon.getPaths();
   * @return {[type]}       [description]
   */
  getBounds(paths) {
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

  colors() {
    return ["#f44336", "#9c27b0", "#673ab7", "#4caf50", "#3f51b5", "#2196f3", "#8bc34a", "#cddc39",
      "#ffeb3b", "#795548", "#9e9e9e", "#607d8b", "#009688", "#00bcd4"];
  }

  postFile(type, id, files) {
    return this.doPost(`/${type}/image/${id}`, null, files);
  }

  fileUrl(data) {
    if (!data) return data;
    if (data.image) {
      data.image = BaseService.baseUrl + data.image;
    } else {
      data.forEach(item => {
        if (item.image) item.image = BaseService.baseUrl + item.image;
      });
    }
    return data;
  }
}
