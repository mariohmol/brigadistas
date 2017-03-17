import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, TestBed, ComponentFixture } from '@angular/core/testing';
//import { inject, async, fakeAsync, tick, TestBed, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { asyncPower, fakeAsyncPower, setTimeoutPromise, elements, elementText } from '../../../../helpers';

import { NavController } from 'ionic-angular';
import { UserPage,LoginPage,UserProfilePage } from '../../../targets.ref';
import { Observable } from 'rxjs/Rx';

/*
public app: App, public navCtrl: NavController, public navParams: NavParams, public userService: UserService,
  public translateService: TranslateService, public alertCtrl: AlertController, public menuCtrl: MenuController,
  public fb: FormBuilder, public toastCtrl: ToastController
 */
describe('TEST: HomePage Component', () => {
  /*let builder: TestComponentBuilder;
  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));*/

  beforeEach(() => {
    TestBed.configureTestingModule({
      //imports: [ ... ],
    //  declarations: [ ... ],
      providers: [
        { NavController }
      ]
    });
    TestBed.compileComponents();
  });



  it('can create, should have title', asyncPower(async () => {
    const fixture = TestBed.createComponent(UserPage); //await builder.createAsync(UserPage);
    const el = fixture.nativeElement as HTMLElement;
    assert(!!fixture);
    assert(elementText(el, 'ion-title').trim() === 'Home');
  }));

});
