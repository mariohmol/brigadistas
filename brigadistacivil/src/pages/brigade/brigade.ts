import { Component, ViewChild, ElementRef } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { App,Platform, NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import BasePage from '../basepage';
import { BrigadesPage } from './brigades';
import { BrigadeAreaPage } from './area';
import { UserService,BrigadeService,GeneralService } 
        from '../../providers';
import {TranslateService} from 'ng2-translate';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
declare var google;

@Component({
  selector: 'page-brigade',
  templateUrl: 'brigade.html'
})
export class BrigadePage  extends BasePage{
  public brigade: any;
  public position: any;
  public isBrigade: boolean;
  public isLeader: boolean;
  @ViewChild('map') mapElement: ElementRef;
  brigadeForm: FormGroup;
  brigadeFormFields: any;
  public readonly: boolean;
  public image: any;

  constructor(public app: App, public platform: Platform,
    public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService,public brigadeService: BrigadeService,
    public alertCtrl: AlertController,
    public userService: UserService,public toastCtrl: ToastController, public fb: FormBuilder,
    public generalService: GeneralService,
    public camera: Camera, public imagePicker: ImagePicker) {
    super();
    this.readonly=true;
    if(this.navParams.get("brigade")){
      this.brigade=this.navParams.get("brigade");
      this.loadData();
    }else if(this.navParams.get("brigadeId") && this.navParams.get("brigadeId")!="brigadeId"){
      this.brigade={_id: this.navParams.get("brigadeId")};
      this.loadData();
    } else{
      this.brigade={};
      this.readonly=false;
    }

    this.brigadeFormFields={
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      city: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['']
    };
    this.brigadeForm = this.fb.group(this.brigadeFormFields);
  }

  isInBrigade(){
    return this.isBrigade && this.brigade._id!=null;
  }

  isInLeaderes(){
    return this.isLeader && this.brigade._id!=null;
  }

  ionViewDidLoad() {

  }

  showMap(){
    this.navCtrl.push(BrigadeAreaPage,{brigadeId: this.brigade._id, brigade: this.brigade})
  }

  loadData(){
    if(!this.brigade) return;
    this.brigadeService.getBrigade(this.brigade._id).then(d=>{
      this.brigade=d;
      this.setDataForm(this.brigadeForm,this.brigadeFormFields,this.brigade);

      const {isLeader,isBrigade,readonly} = this.brigadeService.userPerms(UserService.loginData,this.brigade);
      this.isLeader=isLeader; this.isBrigade=isBrigade; this.readonly=readonly;
    });
  }

  save(){
    this.brigadeService.addBrigade(this.brigadeForm.value).then(d=>{
      this.uploadPic(); 
      if(this.brigade._id){
        this.showToast(this.translate("brigade.update"));
      }else{
        this.showToast(this.translate("brigade.new.warning"));
        this.openPage(BrigadesPage);
      }
    });
  }

  requestEnter(){
    let message=this.translate("brigade.requestEnter.confirm");
    let title=this.translate("brigade.requestEnter.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.addRelationBrigade(this.brigade._id,"requested").then(d=>{
        this.showToast(this.translate("brigade.requestEnter.feedback"));
        this.loadData();
      });
    });
  }

  leaveBrigade(){
    let message=this.translate("brigade.leaveBrigade.confirm");
    let title=this.translate("brigade.leaveBrigade.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.removeRelationBrigade(this.brigade._id,"requested").then(d=>{
        this.showToast(this.translate("brigade.leaveBrigade.feedback"));
        this.loadData();
      });
    });

  }

  approveBrigade(userId){
    let message=this.translate("brigade.approveBrigade.confirm");
    let title=this.translate("brigade.approveBrigade.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.addRelationBrigade(this.brigade._id,"brigades",userId).then(d=>{
        this.showToast(this.translate("brigade.approveBrigade.feedback"));
        this.loadData();
      });
    })
  }

  promoteBrigade(userId){
    let message=this.translate("brigade.promoteBrigade.confirm");
    let title=this.translate("brigade.promoteBrigade.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.addRelationBrigade(this.brigade._id,"leaders",userId).then(d=>{
        this.showToast(this.translate("brigade.promoteBrigade.feedback"));
        this.loadData();
      });
    })
  }

  getPic(){
    this.getPicture(d=>{ this.image=d; });
  }

  takePic(){
    this.takePicture(d=>{ this.image=d; });
  }

  getWebPic(){
    return (data)=>{
      this.image=data; 
    }
  }

  uploadPic(){
     if(!this.brigade._id || !this.image) return;
     this.generalService.postFile("brigade",this.brigade._id, this.image).then(d=>{
      this.brigade=d;
     });
  }

}
