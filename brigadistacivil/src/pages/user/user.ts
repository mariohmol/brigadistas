import { Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App,NavController, NavParams, MenuController,ToastController } from 'ionic-angular';
import { UserService } from '../../providers';
import {TranslateService} from 'ng2-translate';
import BasePage from '../basepage';
import { FiresPage } from '../fire/fires';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage extends BasePage {
  userForm: FormGroup;
  public user: any;

  constructor(public app: App,public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder,
    public userService: UserService, public translateService: TranslateService, public menuCtrl: MenuController,
    public toastCtrl: ToastController) {
    super();
    this.userForm = this.fb.group({
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      email: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      city: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      bio: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });
  }

  ionViewDidLoad() {
    if (this.navParams.get("user")) {
      this.user = this.navParams.get("user");
      if(UserService.loginData && this.user._id===UserService.loginData._id) this.readonly = false;
      else this.readonly = true;
    } else {
      this.user = {};
      this.readonly = false;
    }


  }

  save() {
    if (this.user._id) {
      this.userService.updateProfile(this.user).then((d: any) => {
        this.login(d.username, d.password);
      }).catch(e=>{
        this.showToast(this.translate("user.update.error"))
      });
    } else {
      let originalPassword =this.userForm.value.password;
      this.userService.register(this.userForm.value).then((d: any) => {
        this.login(d.username, originalPassword);
      }).catch(e=>{
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

}
