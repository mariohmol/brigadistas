import { LoginPageComponent } from './login.component';
import { UserPageComponent } from './user.component';
import { RecoverPageComponent } from './recover.component';
import { UserProfilePageComponent } from './profile.component';

export const UserRoutes = [
  { component: LoginPageComponent, name: 'Login', segment: 'login' },
  { component: UserPageComponent, name: 'User', segment: 'uer' },
  { component: RecoverPageComponent, name: 'Recover', segment: 'recover' },
  { component: UserProfilePageComponent, name: 'UserProfile', segment: 'profile' }
];
