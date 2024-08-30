import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { MenuSideLeftComponent } from './main-content/menu-side-left/menu-side-left/menu-side-left.component';
import { LegalComponent } from './legal/legal.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [

  { path: '', component: MainContentComponent },
  { path: 'menu', component: MenuSideLeftComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'imprint/legal', component: LegalComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'legal/imprint', component: ImprintComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
];
