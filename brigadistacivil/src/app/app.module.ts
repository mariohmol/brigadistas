import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { UserPage } from '../pages/user/user';

import {BaseService} from '../providers/base-service';
import {GeneralService} from '../providers/general-service';
import {UserService} from '../providers/user-service';

let pages = [
  MyApp,
  Page1,
  Page2,
  UserPage
];
@NgModule({
  declarations: pages,
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    UserPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},GeneralService,UserService,BaseService]
})
export class AppModule {}
