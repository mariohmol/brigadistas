import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ToastController, ModalController, Platform, ViewController } from 'ionic-angular';
import BasePage from '../basepage';
import {ChatPage} from './chat';
import { ChatService,GeneralService } from '../../providers';
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
    public generalService: GeneralService, public modalCtrl: ModalController) {
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
    this.navCtrl.push(ChatPage,{ chat, chatId: chat._id});
  }

  removeChat(chat){
    this.chatService.deleteChat(chat._id).then(chat=>{
      this.showToast(this.translate("chat.deleted"));
      this.loadData();
    });
  }

  addChat() {
    let modal = this.modalCtrl.create(NewChatModalPage);
    modal.present();
  }
}



@Component({
  template: `<ion-header>
  <ion-toolbar>
    <ion-title>
      {{ "chat.select" | translate }}
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">{{ "cancel" | translate }}</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
    <select-item [select]="select"></select-item>
</ion-content>`
})
export class NewChatModalPage extends BasePage {
  character;

  constructor(
    public app: App,public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public chatService: ChatService,
    public translateService: TranslateService,
    public toastCtrl: ToastController,
  ) {
   super();
   this.select = this.select.bind(this);
  }

  select(user){
    let chat={members: [user]};
    this.chatService.addChat(chat).then( (d:any)=>{
      console.log(d);
      this.openPageParam(ChatPage, { chatId: d._id })
       this.viewCtrl.dismiss();
    }).catch(e=>{ console.log(e);
      this.showToast(this.translate("chat.new.error"));
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
