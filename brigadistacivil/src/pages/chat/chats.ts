import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import {ChatPage} from './chat';
import { UserService } from '../../providers/user-service';
import { ChatService } from '../../providers/chat-service';
import { GeneralService } from '../../providers/general-service';
import {TranslateService} from 'ng2-translate';


@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage extends BasePage {
  chats: any;
  senderId: string;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public chatService: ChatService,
    public generalService: GeneralService) {
    super();
  }

  ionViewDidLoad() {
  this.loadData();
  }

  loadData() {
    this.chatService.getChats().then(chat=>{
      this.chats=chat;
    });
  }

  showChat(chat){
    this.chatService.getChat(chat._id).then(chat=>{
      if(!chat) return this.showToast(this.translate("chat.notfound"));
      console.log(ChatPage,{ chat});
      this.navCtrl.push(ChatPage,{ chat});
    });
  }

  removeChat(chat){

  }
}
