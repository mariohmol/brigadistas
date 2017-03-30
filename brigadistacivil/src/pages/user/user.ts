import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { App, NavController, NavParams, MenuController, ToastController, Platform } from 'ionic-angular';
import { UserService,GeneralService } from '../../providers';
import { TranslateService } from 'ng2-translate';
import BasePage from '../basepage';
import { FiresPage } from '../fire/fires';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage extends BasePage {
  userForm: FormGroup;
  userFormFields: any;
  public user: any;
  public image: any;

  constructor(public app: App, public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder,
    public userService: UserService, public translateService: TranslateService, public menuCtrl: MenuController,
    public toastCtrl: ToastController, public generalService: GeneralService,
    public camera: Camera, public imagePicker: ImagePicker) {
    super();
    this.userFormFields = {
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      city: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      bio: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    };

    this.userForm = this.fb.group(this.userFormFields);
  }

  ionViewDidLoad() {
    if (this.navParams.get("user")) {
      this.user = this.navParams.get("user");
      if (UserService.loginData && this.user._id === UserService.loginData._id) this.readonly = false;
      else this.readonly = true;
    } else if (UserService.loginData) {
      this.user = UserService.loginData;
      this.userService.getMe().then((u: any) => {
        this.user = u;
        this.user.email = u.username;
        if (UserService.loginData && this.user._id === UserService.loginData._id) this.readonly = false;
        else this.readonly = true;
        this.setDataForm(this.userForm, this.userFormFields, this.user);
      });
    } else {
      this.user = {};
      this.readonly = false;
    }


  }

  save() {
    if (this.user._id) {
      this.user = {...this.user,...this.userForm.value};
      this.user.username = this.user.email;
      this.userService.updateUser(this.user).then((d: any) => {
        this.uploadPic();
        this.showToast(this.translate("user.update.ok"))
      }).catch(e => {
        this.showToast(this.translate("user.update.error"))
      });
    } else {
      let originalPassword = this.userForm.value.password;
      this.userService.register(this.userForm.value).then((d: any) => {
        this.user = d;
        this.uploadPic();
        this.login(d.username, originalPassword);
      }).catch(e => {
        this.showToast(this.translate("user.new.error"))
      });
    }
  }

  afterLogin() {
    this.openPage(FiresPage);
  }

  loginPage(username, password) {
    this.login(username, password);
  }

  getPic() {
    this.getPicture(d => { this.image = d; });
  }

  takePic() {
    this.takePicture(d => { this.image = d; });
  }

  getWebPic() {
    return (data) => {
      this.image = data;
    }
  }

  uploadPic() {
    if (!this.user._id || !this.image) return;
    this.generalService.postFile("user", this.user._id, this.image).then(d => {
      this.user = d;
    });
  }

}
