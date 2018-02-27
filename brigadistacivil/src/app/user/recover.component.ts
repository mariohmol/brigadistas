import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, AlertController, App, MenuController, ToastController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { UserService } from './user.service';
import BasePage from '../core/basepage';
import { LoginPageComponent } from './login.component';

@Component({
  selector: 'app-page-recover',
  templateUrl: 'recover.component.html'
})
export class RecoverPageComponent extends BasePage {
  recoverForm: FormGroup;
  user: any;
  token: string;

  constructor(public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public translateService: TranslateService,
    public alertCtrl:
      AlertController,
    // public menuCtrl: MenuController,
    public fb: FormBuilder, public toastCtrl: ToastController) {
    super();
    this.recoverForm = fb.group({
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });
  }

  ionViewDidLoad() {
    this.token = this.navParams.get('token');
    this.userService.recoverCheck(this.token).then(u => {
      this.user = u;
    });
  }


  recoverPage(form) {
    this.userService.recoverPassword(this.token, form.password).then(u => {
      if (u) {
        this.showToast(this.translate('user.recover.changed'));
      } else { this.showToast(this.translate('generalError')); }
      this.navCtrl.push(LoginPageComponent);
    });
  }

}
