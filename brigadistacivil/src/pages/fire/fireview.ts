/**
 * 
 * 
 * 
 * VIEW
 * 
 * 
 * 
 */
import { Component, ElementRef, ViewChild } from "@angular/core";
import BasePage from "../basepage";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, Events, App } from "ionic-angular";
import { ImagePicker } from "@ionic-native/image-picker";
import { Camera } from "@ionic-native/camera";
import { TranslateService } from "ng2-translate";
import { FireService, GeneralService } from "../../providers";
import { FiresPage } from "./fires";

@Component({
  templateUrl: `fireview.html`
})
export class FireViewPage extends BasePage {
  public position: any; @ViewChild('map')
  mapElement: ElementRef;
  fireForm: FormGroup;
  fireFormFields: any;
  public image: any;
  fire: any;


  constructor(public app: App,
    public fireService: FireService, public generalService: GeneralService,
    public toastCtrl: ToastController, public events: Events, public translateService: TranslateService,
    public fb: FormBuilder, public camera: Camera, public imagePicker: ImagePicker) {
    super();
    this.fireFormFields = {
      title: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['', [<any>Validators.required]],
      intensity: ['', [<any>Validators.required]]
    };
    this.ionViewDidLoad();

    events.subscribe('fire:loaded', (fire, time) => {
      this.ionViewDidLoad();
    });

    events.subscribe('fire:save', (fire, time) => {
      this.save();
    });

  }

  ionViewDidLoad() {
    if (!FireService.data.fire) this.fire = FireService.data.fire = {}
    else this.fire = FireService.data.fire;
    this.fireForm = this.fb.group(this.fireFormFields);
    if (Object.keys(this.fire).length > 0) {
      this.setDataForm(this.fireForm, this.fireFormFields, FireService.data.fire);
    }
  }



  save() {
    if (!FireService.data.fire.coordinates) {
      return this.showToast(this.translate("fire.chooseLocation"));
    }
    if (FireService.data.fire._id) {
      FireService.data.fire = Object.assign(FireService.data.fire, this.fireForm.value);
      this.fireService.updateFire(FireService.data.fire).then(d => {
        FireService.data.fire = d;
        this.uploadPic();
        this.openPage(FiresPage);
      });
    } else {
      FireService.data.fire = Object.assign(FireService.data.fire, this.fireForm.value);
      this.fireService.addFire(FireService.data.fire).then(d => {
        FireService.data.fire = d;
        this.uploadPic();
        this.openPage(FiresPage);
      });
    }
  }

  isInBrigade() {
    return FireService.data.isBrigade && this.fire._id != null;
  }

  isReadonly() {
    return FireService.data.readonly;
  }

  getPic() {
    this.getPicture(d => { this.image = d; });
  }

  takePic() {
    this.takePicture(d => { this.image = d; });
  }

  getWebPic() {
    return (data) => {
      this.image = data;
    }
  }

  uploadPic() {
    if (!FireService.data.fire._id || !this.image) return;
    this.generalService.postFile("fire", FireService.data.fire._id, this.image).then(d => {
      FireService.data.fire = d;
    });
  }

}
