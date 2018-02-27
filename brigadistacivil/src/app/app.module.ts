import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';



import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppRoutes } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AppSharedModule } from './shared/shared.module';
import { BrigadeModule } from './brigade/brigade.module';
import { ChatModule } from './chat/chat.module';
import { FireModule } from './fire/fire.module';
import { GeoModule } from './geo/geo.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom'
    }, {
        links: AppRoutes
      }),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
      deps: [Http]
    }),
    CoreModule,
    AppSharedModule,
    BrigadeModule,
    ChatModule,
    FireModule,
    GeoModule,
    MessageModule,
    UserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, BackgroundGeolocation,
    Camera, ImagePicker]
})
export class AppModule { }
