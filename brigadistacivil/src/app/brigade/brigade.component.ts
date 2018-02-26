import { Component, ViewChild } from '@angular/core';
import {
  App, Platform, NavParams, AlertController, ToastController,
  Events, Tabs, ActionSheetController
} from 'ionic-angular';
import { TranslateService } from 'ng2-translate';
import { BrigadeViewPageComponent } from './brigadeview.component';
import { BrigadeAreaPageComponent } from './area.component';
import BasePage from '../core/basepage';
import { BrigadeService } from './brigade.service';
import { UserService } from '../user/user.service';
import { GeneralService } from '../shared/general.service';
import { FireService } from '../fire/fire.service';
declare var google;

@Component({
  selector: 'app-page-brigade',
  templateUrl: 'brigade.component.html'
})
export class BrigadePageComponent extends BasePage {
  public brigade: any;
  public position: any;
  public isBrigade: boolean;
  public isLeader: boolean;
  @ViewChild('myTabs') tabRef: Tabs;
  public readonly: boolean;
  public image: any;
  tab1Root: any = BrigadeViewPageComponent;
  tab2Root: any = BrigadeAreaPageComponent;
  tab3Root: any = BrigadeFiresPage;

  constructor(public app: App,
    public platform: Platform,
    public navParams: NavParams,
    public actionsheetCtrl: ActionSheetController,
    public translateService: TranslateService,
    public brigadeService: BrigadeService,
    public alertCtrl: AlertController,
    public events: Events,
    public userService: UserService,
    public toastCtrl: ToastController,
    public generalService: GeneralService
  ) {
    super();
    this.readonly = true;
    if (this.navParams.get('brigade')) {
      BrigadeService.data.brigade = this.brigade = this.navParams.get('brigade');
      this.loadData();
    } else if (this.navParams.get('brigadeId') && this.navParams.get('brigadeId') !== 'brigadeId') {
      BrigadeService.data.brigade = this.brigade = { _id: this.navParams.get('brigadeId') };
      this.loadData();
    } else {
      BrigadeService.data.brigade = this.brigade = {};
      this.readonly = false;
    }

    this.events.subscribe('brigade:load', () => {
      this.loadData();
    });
  }


  loadData() {
    if (!this.brigade) { return; }
    this.brigadeService.getBrigade(this.brigade._id).then(d => {
      BrigadeService.data.brigade = this.brigade = d;

      const { isLeader, isBrigade, readonly } = this.brigadeService.userPerms(UserService.loginData, this.brigade);
      this.isLeader = isLeader; this.isBrigade = isBrigade; this.readonly = readonly;
      this.events.publish('brigade:loaded', this.brigade, isLeader, isBrigade, readonly);
    });
  }

  openMenu() {
    const buttons = [];
    const addButton = (icon, text, cb) => {
      buttons.push({
        text: this.translate(text),
        icon: !this.platform.is('ios') ? icon : null,
        handler: () => {
          cb();
        }
      });
    };
    if (!this.readonly) {
      addButton('checkmark-round', this.translate('save'), b => {
        this.events.publish('brigade:save');
      });
    }


    const actionSheet = this.actionsheetCtrl.create({
      title: this.translate('options'),
      cssClass: 'action-sheets-basic-page',
      buttons: [...buttons,
      {
        text: 'Cancel',
        role: 'cancel', // will always sort to be on the bottom
        icon: !this.platform.is('ios') ? 'close' : null,
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
    });
    actionSheet.present();
  }


  requestEnter() {
    const message = this.translate('brigade.requestEnter.confirm');
    const title = this.translate('brigade.requestEnter.action');
    this.showConfirm(message, title, confirm => {
      this.brigadeService.addRelationBrigade(this.brigade._id, 'requested').then(d => {
        this.showToast(this.translate('brigade.requestEnter.feedback'));
        this.loadData();
      });
    });
  }

  leaveBrigade() {
    const message = this.translate('brigade.leaveBrigade.confirm');
    const title = this.translate('brigade.leaveBrigade.action');
    this.showConfirm(message, title, confirm => {
      this.brigadeService.removeRelationBrigade(this.brigade._id, 'requested').then(d => {
        this.showToast(this.translate('brigade.leaveBrigade.feedback'));
        this.loadData();
      });
    });

  }



}





/**
 *
 * Fires
 *
 */
@Component({
  template: `<div ><select-item [readonly]="readonly" [items]="fires"
              title="title" subtitle="status" ></select-item></div>`
})
export class BrigadeFiresPageComponent extends BasePage {
  public fires: any = [];
  public readonly = true;

  constructor(public fireService: FireService) {
    super();
    this.fireService.getFires({ brigade: BrigadeService.data.brigade._id }).then(d => {
      this.fires = d;
    });
  }

}
