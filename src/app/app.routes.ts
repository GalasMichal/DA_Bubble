import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { MenuSideLeftComponent } from './main-content/menu-side-left/menu-side-left/menu-side-left.component';
import { LegalComponent } from './legal/legal.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginComponent } from './login/login.component';
import { CreateAvatarComponent } from './create-avatar/create-avatar.component';
import { PwdResetComponent } from './pwd-reset/pwd-reset.component';
import { PwdRecoveryComponent } from './pwd-recovery/pwd-recovery.component';


export const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'main', component: MainContentComponent },
  { path: 'menu', component: MenuSideLeftComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'create', component: CreateAvatarComponent },
  { path: 'recovery', component: PwdRecoveryComponent },
  { path: 'reset', component: PwdResetComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'legal', component: LegalComponent },
];
