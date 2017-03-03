import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/user/login';
import { FirePage } from '../pages/fire/fire';
import { FiresPage } from '../pages/fire/fires';
import { BrigadePage } from '../pages/brigade/brigade';
import { BrigadesPage } from '../pages/brigade/brigades';

import {BaseService} from '../providers/base-service';
import {GeneralService} from '../providers/general-service';
import {UserService} from '../providers/user-service';
import {FireService} from '../providers/fire-service';
import {BrigadeService} from '../providers/brigade-service';

import {ReadOnlyClass} from './directives/readonlyclass';

import { TranslateModule,TranslateLoader ,TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {HttpModule,Http} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

let pages = [
  MyApp,
  UserPage,LoginPage,
  FirePage, FiresPage,
  BrigadePage, BrigadesPage
];

let declarations = [...pages, ReadOnlyClass ];
@NgModule({
  declarations: declarations,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},GeneralService,BaseService,
              UserService,FireService,BrigadeService]
})
export class AppModule {}
