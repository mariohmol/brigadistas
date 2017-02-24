import { App, Platform, NavController, MenuController, AlertController,
            LoadingController, ToastController } from 'ionic-angular'; //ModalController
import {UserService} from '../providers/user-service';
import {  ViewChild,ElementRef } from '@angular/core';
declare var google;

export default class BasePage {
  public userService: UserService;
  public navCtrl: NavController;
  public menuCtrl: MenuController;
  public alertCtrl: AlertController;
  public loadingCtrl: LoadingController
  public toastCtrl: ToastController
  public app: App;
  public platform: Platform;
  public loading: any;
  public password;
  public username;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor() {
    if (!UserService.loginData && 'profile' in localStorage) {
      try {
        UserService.loginData = JSON.parse(localStorage['profile']);
      } catch (e) { }
    }
  }

  /**
   * ESTRUTURA
   */

  setMenu() {
    if (!this.menuCtrl) return;
    if (this.isUser()) {
      this.menuCtrl.enable(true, 'menuUser');
      this.menuCtrl.swipeEnable(true);
    }
    else this.menuCtrl.swipeEnable(false);
  }

  showLoading(): void {
    if (!this.loadingCtrl || this.loading) return;
    this.loading = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 90000
    });
    this.loading.present();
    return this.loading;
  }

  dismissLoading(): void {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  /**
   * FORMS
   */
  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode == 13) {
      this.formsubmit();
    }
  }

  toDate(mydate) {
    return new Date(mydate.substring(6, 10), mydate.substring(3, 5), mydate.substring(0, 2), mydate.substring(11, 13), mydate.substring(14, 16));
  }

  formsubmit() { }


  /**
   * USUARIO
   */
  isUser() {
    if (UserService && UserService.loginData)
      return true;
    else return false;
  }

  openPageParam(page, param) {
    console.log("aeeeeeee333")
    if (this.menuCtrl) this.menuCtrl.close();

    if (this.app) {
      if (param) this.app.getRootNav().push(page, param);
      else this.app.getRootNav().setRoot(page);
    }
    //let nav = this.app.getActiveNav();nav.push(page);
  }
  openPage(page) {
    return this.openPageParam(page, null);
  }
  goBack() {
    this.app.getRootNav().pop();
  }


  /**
   * VIEWS
   */

  showAlert(title, desc) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: desc,
      buttons: ['OK']
    });
    alert.present();
  }

  showConfirm(message, title, callback) {
    if (!title) title = "Confirmação de operação";
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Sim, desejo continuar',
          handler: () => {
            callback();
          }
        }
      ]
    });
    confirm.present();
  }


  showConfirmOptions(title, message, names, callback) {
    let alertConfirm;

    alertConfirm = this.alertCtrl.create();

    if (!title) title = "Escolha uma opção"
    alertConfirm.setTitle(title);
    alertConfirm.setMessage(message);

    for (let i = 0; i < names.length; i++) {
      alertConfirm.addInput({
        type: 'radio',
        label: names[i].label,
        value: names[i].value,
        checked: false
      });
    }

    alertConfirm.addButton('Cancelar');
    alertConfirm.addButton({
      text: 'Ok',
      handler: (data: any) => {
        if (data) {
          callback(data);
        } else {
          alert('Por favor, selecione sua nota para continuar a avliação.')
          return false;
          //alert('Selecione uma opção para avaliar');
        }
      }
    });

    alertConfirm.present().then(() => {

    });

  }



  showError(error: any) {
    console.log(error)
    this.dismissLoading();
    if (error && error.status === 0) {
      error = "Provável problema com a sua internet, tente novamente."
    }

    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: "Ocorreu um erro ao conectar",
        subTitle: error,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showValidacao(desc) {
    this.showAlert("Validação de informações", desc);
  }

  showToast(desc, fixed = false) {
    if (!this.toastCtrl) return;
    let options = {
      message: desc,
      position: "top",
      closeButtonText: "OK",
      showCloseButton: false,
      duration: 5000
    };

    if (fixed === true) {
      options.duration = 15000;
      options.showCloseButton = true;
    }
    let toast = this.toastCtrl.create(options);
    toast.present();
  }



  /**
   *USERS ACTIONS
   *
   */
  afterLogin() { }

  authSuccess(token, user) {
    console.log(user, token)
    localStorage['profile'] = JSON.stringify(user);
    localStorage['id_token'] = token;


    if (localStorage['deviceToken']) {
      let type = "android"; //windows
      if (this.platform && this.platform.is('ios')) {
        type = "ios";
      }
      //this.userService.storeDeviceToken(type, localStorage['deviceToken']);
    }
    this.afterLogin();
    this.showToast(user.fullname + ', seja bem vindo(a)!');
  }

  login(username: any = null, password: any = null, callback: any = null): void {
    this.showLoading();
    if (!username) username = this.username;
    if (!password) password = this.password;

    this.userService.login(username, password).then(user => {
      this.dismissLoading();
      if (user) {
        this.authSuccess(true, user);
        if (callback) callback();
      }
      else {
        this.errorlogin();
      }

    }).catch(err => {
      this.dismissLoading();
      this.errorlogin();
    });
  }

  errorlogin(): void {
    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: 'Não foi possível entrar',
        subTitle: 'Seu usuário ou senha está incorreto! Se ainda não e cadastrou, faça agora!',
        buttons: ['OK']
      });
      alert.present();
    }
  }




    loadMap(position){
      if(!this.mapElement) return;

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

}
