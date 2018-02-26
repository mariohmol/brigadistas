import { NgModule } from '@angular/core';
import { AppSharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { UserPageComponent } from './user.component';
import { RecoverPageComponent } from './recover.component';
import { UserProfilePageComponent } from './profile.component';
import { LoginPageComponent } from './login.component';


@NgModule({
    imports: [
        AppSharedModule
    ],
    declarations: [
        UserPageComponent, RecoverPageComponent,
        UserProfilePageComponent, LoginPageComponent
    ],
    exports: [
        UserPageComponent, RecoverPageComponent,
        UserProfilePageComponent, LoginPageComponent
    ],
    entryComponents: [
        UserPageComponent, RecoverPageComponent,
        UserProfilePageComponent, LoginPageComponent
    ],
    providers: [
        UserService
    ]
})
export class UserModule {
}
