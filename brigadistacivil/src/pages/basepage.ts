import {
  App, Platform, NavController, MenuController, AlertController,
  LoadingController, ToastController
} from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { UserService,GeneralService,BaseService } from '../providers';
import { TranslateService } from 'ng2-translate';
import { ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
declare var google;

export default class BasePage {
  public userService: UserService;
  public generalService: GeneralService;
  public translateService: TranslateService;
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
  public currentLocation: any;
  public readonly: boolean;
  public camera: Camera;
  public imagePicker: ImagePicker;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor() {
    if (!UserService.loginData && 'profile' in localStorage) {
      try {
        UserService.loginData = JSON.parse(localStorage['profile']);
      } catch (e) { }
    }
  }

  isCordova(){
    if(this.platform) return this.platform.is('cordova')==true;
    return BaseService.device === 'mobile';
  }

  /**
   * ESTRUTURA
   */
  setMenu() {
    if (!this.menuCtrl) return;
    /*if (this.isUser()) {
    this.menuCtrl.enable(true, 'menuUser');
      this.menuCtrl.swipeEnable(true);
    }
    else this.menuCtrl.swipeEnable(false);*/
    this.menuCtrl.enable(true, 'menuUser');
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

  /**
   * [setDataForm description]  Ex.: this.setDataForm(this.fireForm,this.fireFormFields,this.fire);
   * @param  {[type]} form ex.: this.fireForm
   * @param  {[type]} keys ex.: [name: [], title: []]
   * @param  {[type]} data ex.: this.fire
   * @return {[type]}      [description]
   */
  setDataForm(form, keys, data) {
    let formData = {};
    for (let key in keys) {
      if (key in data) formData[key] = data[key];
      else formData[key] = "";
    }
    (<FormGroup>form).setValue(formData, { onlySelf: true });
  }




  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode == 13) {
      this.formsubmit();
    }
  }

  isReadonly() {
    return this.readonly;
  }

  toDate(mydate) {
    return new Date(mydate.substring(6, 10), mydate.substring(3, 5), mydate.substring(0, 2), mydate.substring(11, 13), mydate.substring(14, 16));
  }

  formsubmit() { }

  /**
   * get current translationfor a key
   * @param  {string} key "brigade.requestEnter.confirm"
   * @return {string}     [description]
   */
  translate(key, args = {}) {
    let newKey = this.translateService.get(key, args);
    if (newKey && (<any>newKey).value) {
      let value = (<any>newKey).value
      return this.applyTemplate(value, args);
    }
    return key;
  }

  applyTemplate(tpl, o) {
    for(let key in o){
      if(o.hasOwnProperty(key)){
        tpl = tpl.replace('{'+key+'}',o[key]);
      } //prevent iteration on any prototype inherited methods
    }
    return tpl;
  }

  /**
   * User
   */
  isUser() {
    if (UserService && UserService.loginData)
      return true;
    else return false;
  }

  openPageParam(page, param) {
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
    if (!title) title = this.translate("confirmOperation");
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: this.translate("cancel"),
          handler: () => {
          }
        },
        {
          text: this.translate("yesContinue"),
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

    if (!title) title = this.translate("chooseOption");
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

    alertConfirm.addButton(this.translate("cancel"));
    alertConfirm.addButton({
      text: 'Ok',
      handler: (data: any) => {
        if (data) {
          callback(data);
        } else {
          alert(this.translate("chooseOptionFail"))
          return false;
        }
      }
    });

    alertConfirm.present().then(() => {

    });
  }



  showError(error: any) {
    this.dismissLoading();
    if (error && error.status === 0) {
      error = this.translate("cancel")
    }

    if (this.alertCtrl) {
      let alert = this.alertCtrl.create({
        title: this.translate("connectionFail"),
        subTitle: error,
        buttons: ['OK']
      });
      alert.present();
    }
  }


  showToast(desc, fixed = false) {
    if (!this.toastCtrl) return;
    let options = {
      message: desc,
      position: "top",
      closeButtonText: "OK",
      showCloseButton: true,
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

  authSuccess(token, user, password) {
    localStorage['profile'] = JSON.stringify(user);
    localStorage['id_token'] = token;
    localStorage['base_token'] = btoa(user.username + ':' + password);
    console.log(localStorage);
    if (localStorage['deviceToken']) {
      if (this.platform && this.platform.is('ios')) this.userService.storeDeviceToken("ios", localStorage['deviceToken']);
      else this.userService.storeDeviceToken("android", localStorage['deviceToken']);
    }
    this.afterLogin();
    this.showToast(user.name + this.translate("user.new.welcome"));
  }

  login(username: any = null, password: any = null, callback: any = null): void {
    this.showLoading();
    if (!username) username = this.username;
    if (!password) password = this.password;

    this.userService.login(username, password).then(user => {
      this.dismissLoading();
      if (user) {
        this.authSuccess(true, user, password);
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
        title: this.translate("user.login.title"),
        subTitle: this.translate("user.login.subTitle"),
        buttons: ['OK']
      });
      alert.present();
    }
  }
  currentUser() {
    return UserService.loginData;
  }


  /**
   * [loadMap description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  loadMap(position, options = {}, cb = null) {
    this.map = this.generalService.loadMap(this.mapElement, position, options, cb);
  }


  addMarker(position, info) {
    return this.generalService.addMarker(this.map, position, info);
  }

  addInfoWindow(marker, content) {
    return this.generalService.addMarker(this.map, marker, content);
  }


takePicture(cb){
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  this.camera.getPicture(options).then((imageData) => {
  // imageData is either a base64 encoded string or a file URI
  // If it's base64:
  let base64Image = 'data:image/jpeg;base64,' + imageData;
    cb(base64Image);
  }, (err) => {
  // Handle error
  });
}

getPicture(cb){
  let options = {
      // max images to be selected, defaults to 15. If this is set to 1, upon
    // selection of a single image, the plugin will return it.
    maximumImagesCount: 1,

    // max width and height to allow the images to be.  Will keep aspect
    // ratio no matter what.  So if both are 800, the returned image
    // will be at most 800 pixels wide and 800 pixels tall.  If the width is
    // 800 and height 0 the image will be 800 pixels wide if the source
    // is at least that wide.
    width: 1500,
    height: 1500,

    // quality of resized image, defaults to 100 - int (0-100)
    quality: 100
  };
  this.imagePicker.getPictures(options).then((results) => {
    for (var i = 0; i < results.length; i++) {
        cb(results[i]);
    }
  }, (err) => { });
}

}
