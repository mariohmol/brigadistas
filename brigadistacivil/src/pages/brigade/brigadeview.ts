
/**
 * 
 * 
 * 
 * VIEW
 * 
 * 
 * 
 */
import { Component } from "@angular/core";
import BasePage from "../basepage";
import { BrigadeService, GeneralService } from "../../providers";
import { Events, ToastController, App } from "ionic-angular";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from "@ionic-native/image-picker";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { BrigadesPage } from "./brigades";
import { TranslateService } from "ng2-translate";

@Component({
 templateUrl: `brigadeview.html`
})
export class BrigadeViewPage extends BasePage {
  brigade: any = {};
  brigadeForm: FormGroup;
  brigadeFormFields: any;
  public isBrigade: boolean;
  public isLeader: boolean;

  constructor(public app: App,public events: Events,public translateService: TranslateService,
  public camera: Camera, public imagePicker: ImagePicker,public generalService: GeneralService,
  public brigadeService: BrigadeService,public toastCtrl: ToastController,
  public fb: FormBuilder){
    super();
    events.subscribe('brigade:loaded', (brigade,isLeader,isBrigade, readonly) => {
       this.brigade=brigade;
       this.setDataForm(this.brigadeForm,this.brigadeFormFields,this.brigade);
       this.isLeader=isLeader;
       this.isBrigade=isBrigade;
       this.readonly=readonly;
    });

    events.subscribe('brigade:save', (brigade,isLeader,isBrigade, readonly) => {
       this.save();
    });

     this.brigadeFormFields={
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      city: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['']
    };
    this.brigadeForm = this.fb.group(this.brigadeFormFields);
  }


  isInLeaderes(){
    return this.isLeader && this.brigade._id!=null;
  }


  isInBrigade(){
    return this.isBrigade && this.brigade._id!=null;
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


  approveBrigade(userId){
    let message=this.translate("brigade.approveBrigade.confirm");
    let title=this.translate("brigade.approveBrigade.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.addRelationBrigade(this.brigade._id,"brigades",userId).then(d=>{
        this.showToast(this.translate("brigade.approveBrigade.feedback"));
        this.events.publish('brigade:load');
      });
    })
  }

  promoteBrigade(userId){
    let message=this.translate("brigade.promoteBrigade.confirm");
    let title=this.translate("brigade.promoteBrigade.action");
    this.showConfirm(message, title, confirm=>{
      this.brigadeService.addRelationBrigade(this.brigade._id,"leaders",userId).then(d=>{
        this.showToast(this.translate("brigade.promoteBrigade.feedback"));
        this.events.publish('brigade:load');
      });
    })
  }

  /**
   * IMG
   */
  getPic(){
    this.getPicture(d=>{ BrigadeService.data.image=d; });
  }

  takePic(){
    this.takePicture(d=>{ BrigadeService.data.image=d; });
  }

  getWebPic(){
    return (data)=>{
      BrigadeService.data.image=data; 
    }
  }


  uploadPic(){
     if(!BrigadeService.data.brigade._id || !BrigadeService.data.image) return;
     this.generalService.postFile("brigade",BrigadeService.data.brigade._id, BrigadeService.data.image).then(d=>{
      BrigadeService.data.brigade=d;
     });
  }
}