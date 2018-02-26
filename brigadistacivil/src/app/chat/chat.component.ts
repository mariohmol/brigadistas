import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import BasePage from '../core/basepage';
import { UserService } from '../user/user.service';
import { GeneralService } from '../shared/general.service';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-page-chat',
  templateUrl: 'chat.component.html'
})
export class ChatPageComponent extends BasePage {
  chat: any;
  senderId: string;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService, public alertCtrl: AlertController,
    public userService: UserService, public toastCtrl: ToastController,
    public generalService: GeneralService, public chatService: ChatService) {
    super();
  }

  ionViewDidLoad() {
    if (this.navParams.get('chat')) {
      this.chat = this.navParams.get('chat');
      this.loadData();
    } if (this.navParams.get('chatId')) {
      this.chat = { _id: this.navParams.get('chatId') };
      this.loadData();
    } else {
      this.chat = {};
      this.readonly = false;
    }
  }

  loadData() {
    this.chatService.getChat(this.chat._id).then(chat => {
      this.chat = chat;
    });
  }

}
