import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from './base.service';
import { IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Push } from '@ionic-native/push';
import { PopoverComponent } from './popover.component';
import { FileUploadDirective } from './directives/fileupload.directive';
import { ReadOnlyDirective } from './directives/readonlyclass.directive';
import { SelectItemDirective } from './directives/selectitem.directive';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        FileUploadDirective, ReadOnlyDirective,
        SelectItemDirective
    ],
    exports: [
        FileUploadDirective, ReadOnlyDirective,
        SelectItemDirective, IonicModule
    ],
    entryComponents: [PopoverComponent],
    providers: [
        BaseService, SplashScreen,
        StatusBar, Push,
        Geolocation
    ]
})
export class CoreModule {
}
