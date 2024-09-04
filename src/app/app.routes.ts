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
  { path: '', component: LoginComponent },
  { path: 'main', component: MainContentComponent },
  { path: 'menu', component: MenuSideLeftComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateAvatarComponent },
  { path: 'reset', component: PwdResetComponent },
  { path: 'recovery', component: PwdRecoveryComponent },
];

// { path: 'no', component: LoginComponent },
//   { path: '', component: MainContentComponent },
//   { path: 'login/main', component: MainContentComponent },
//   { path: 'login/register/', component: MainContentComponent },
//   { path: 'menu', component: MenuSideLeftComponent },
//   { path: 'legal', component: LegalComponent },
//   { path: 'imprint/legal', component: LegalComponent },
//   { path: 'legal/imprint/legal', component: LegalComponent },
//   { path: 'recovery/legal', component: LegalComponent },
//   { path: 'reset/legal', component: LegalComponent },
//   { path: 'imprint', component: ImprintComponent },
//   { path: 'legal/imprint', component: ImprintComponent },
//   { path: 'reset/imprint', component: ImprintComponent },
//   { path: 'recovery/imprint', component: ImprintComponent },
//   { path: 'login/register', component: RegisterUserComponent },
//   { path: 'register', component: RegisterUserComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'legal/login', component: LoginComponent },
//   { path: 'login/register/login', component: LoginComponent },
//   { path: 'imprint/login', component: LoginComponent },
//   { path: 'login/legal', component: LegalComponent },
//   { path: 'login/register/legal', component: LegalComponent },
//   { path: 'login/register/create/legal', component: LegalComponent },
//   { path: 'login/register/imprint', component: ImprintComponent },
//   { path: 'login/register/create/imprint', component: ImprintComponent },
//   { path: 'login/imprint', component: ImprintComponent },
//   { path: 'create', component: CreateAvatarComponent },
//   { path: 'reset', component: PwdResetComponent },
//   { path: 'reset/login', component: LoginComponent },
//   { path: 'recovery', component: PwdRecoveryComponent },
//   { path: 'recovery/login', component: LoginComponent },
//   { path: 'recovery/login/register', component: RegisterUserComponent },
//   { path: 'recovery/login/main', component: MainContentComponent },
//   { path: 'login/register/create', component: CreateAvatarComponent },
//   { path: 'login/register/create/login', component: LoginComponent },