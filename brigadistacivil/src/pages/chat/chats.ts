import { Component, ViewChild, ElementRef } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { UserService } from '../../providers/user-service';
import { BrigadeService } from '../../providers/brigade-service';
import { GeneralService } from '../../providers/general-service';
import {TranslateService} from 'ng2-translate';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatsPage extends BasePage {
  chats;
  senderId: string;

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService, public alertCtrl: AlertController,
    public userService: UserService, public toastCtrl: ToastController,
    public generalService: GeneralService) {
    super()

  }

  findChats() {

  }

  findLastChatMessage(chatId: string) {

  }

  showMessages(chat): void {
  }

  removeChat(chat: any): void {

  }

}
