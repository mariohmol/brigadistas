import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/user/login';
import { RecoverPage } from '../pages/user/recover';
import { UserProfilePage } from '../pages/user/profile';
import { FirePage,FireMapPage } from '../pages/fire/fire';
import { FiresPage } from '../pages/fire/fires';
import { BrigadePage, BrigadeFiresPage } from '../pages/brigade/brigade'; 

import { BrigadeAreaPage } from '../pages/brigade/area';
import { BrigadesPage } from '../pages/brigade/brigades';
import { ChatPage } from '../pages/chat/chat';
import { ChatsPage,NewChatModalPage } from '../pages/chat/chats';
import { AreaPage } from '../pages/geo/area';
import { ItemPage } from '../pages/geo/item';
import { MapPage } from '../pages/geo/map';
import { MapOptionsComponent } from '../pages/geo/mapoptions';

import { NewLocationMessageComponent } from '../pages/message/location-message';
import { MessagesAttachmentsComponent } from '../pages/message/messages-attachments';
import { MessagesOptionsComponent } from '../pages/message/messages-options';
import { MessagesPage } from '../pages/message/messages';
import { ShowPictureComponent } from '../pages/message/show-picture';

import {GeneralService,BaseService,UserService,FireService,
      BrigadeService,ChatService,GeoService} from '../providers';

import {FileUploadComponent,ReadOnlyClass,SelectItem} from './directives';

import { TranslateModule,TranslateLoader ,TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {HttpModule,Http} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FireViewPage } from "../pages/fire/fireview";
import { BrigadeViewPage } from "../pages/brigade/brigadeview";


let pages = [
  MyApp,
  UserPage,LoginPage,UserProfilePage,
  FirePage,FireViewPage,FireMapPage, FiresPage,
  BrigadePage, BrigadesPage,BrigadeViewPage,BrigadeAreaPage,BrigadeFiresPage,
  RecoverPage,
  ChatsPage,ChatPage,NewChatModalPage,
  NewLocationMessageComponent,MessagesAttachmentsComponent,MessagesOptionsComponent,MessagesPage,ShowPictureComponent,
  AreaPage,ItemPage,MapPage,MapOptionsComponent
];

let declarations = [...pages, ReadOnlyClass, FileUploadComponent,SelectItem ];

let links=[
      { component: UserPage, name: 'User', segment: 'register' },
      { component: LoginPage, name: 'Login', segment: 'login' },
      { component: RecoverPage, name: 'Recover', segment: 'recover/:token' },
      { component: UserProfilePage, name: 'UserProfilePage', segment: 'profile/:userId' },
      { component: FiresPage, name: 'Fires', segment: 'fires/' },
      { component: FirePage, name: 'Fire', segment: 'fire/:fireId' },
      { component: BrigadesPage, name: 'Brigades', segment: 'brigades/' },
      { component: BrigadePage, name: 'Brigade', segment: 'brigade/:brigadeId' },
      { component: BrigadeAreaPage, name: 'BrigadeArea', segment: 'brigade/:brigadeId/area' },
      { component: ChatsPage, name: 'Chats', segment: 'chats/' },
      { component: ChatPage, name: 'Chat', segment: 'chat/:chatId' },
      { component: AreaPage, name: 'Area', segment: 'area/:areaId' },
      { component: ItemPage, name: 'Item', segment: 'item/:itemId' },
      { component: MapPage, name: 'Map', segment: 'map/' }
    ];

@NgModule({
  declarations: declarations,
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      tabsPlacement: 'bottom'
    },{
      links: links
    }),
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},BackgroundGeolocation,
              Camera, ImagePicker, 
              GeneralService,BaseService,UserService,FireService,
              BrigadeService,ChatService,GeoService]
})
export class AppModule {}
