import { Component } from '@angular/core';
//import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { UserService,ChatService,GeneralService } from '../../providers';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage extends BasePage {
  chat: any;
  senderId: string;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService, public alertCtrl: AlertController,
    public userService: UserService, public toastCtrl: ToastController,
    public generalService: GeneralService, public chatService: ChatService) {
      super();
    }

  ionViewDidLoad() {
    if (this.navParams.get("chat")) {
      this.chat = this.navParams.get("chat");
      this.loadData();
    }if (this.navParams.get("chatId")) {
      this.chat = {_id: this.navParams.get("chatId")};
      this.loadData();
    } else {
      this.chat = {};
      this.readonly = false;
    }
  }

  loadData() {
    this.chatService.getChat(this.chat._id).then(chat=>{
      this.chat=chat;
    });
  }

}
