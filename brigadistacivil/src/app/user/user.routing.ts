import { LoginPageComponent } from './login.component';
import { UserPageComponent } from './user.component';
import { RecoverPageComponent } from './recover.component';
import { UserProfilePageComponent } from './profile.component';

export const UserRoutes = [
  { component: UserPageComponent, name: 'User', segment: 'user' },
  { component: RecoverPageComponent, name: 'Recover', segment: 'recover' },
  { component: UserProfilePageComponent, name: 'UserProfile', segment: 'profile' },
  { component: LoginPageComponent, name: 'Login', segment: '*' }
];
