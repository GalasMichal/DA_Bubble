import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { MenuSideLeftComponent } from './main-content/menu-side-left/menu-side-left/menu-side-left.component';
import { LegalComponent } from './legal/legal.component';
import { ImprintComponent } from './imprint/imprint.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginComponent } from './login/login.component';
import { CreateAvatarComponent } from './create-avatar/create-avatar.component';
import { PwdResetComponent } from './components/pwd-reset/pwd-reset.component';
import { PwdRecoveryComponent } from './components/pwd-recovery/pwd-recovery.component';
import { ChannelEmptyComponent } from './shared/component/channel-empty/channel-empty.component';
import { ChannelEditComponent } from './shared/component/channel-edit/channel-edit.component';
import { ChannelCreateComponent } from './shared/component/channel-create/channel-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


/*
IMPORTANTE
wenn ihr die route zum arbeiten ändert -> auch bitte wieder zurück setzen
Merci :)
*/

export const routes: Routes = [

  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: LoginComponent },
  { path: 'start/register', component: RegisterUserComponent },
  { path: 'start/main', component: MainContentComponent },
  { path: 'start/menu', component: MenuSideLeftComponent },
  { path: 'start/avatar', component: CreateAvatarComponent },
  { path: 'reset', component: PwdResetComponent },
  { path: 'recovery', component: PwdRecoveryComponent },
  { path: 'start/create', component: ChannelCreateComponent },
  { path: 'start/empty', component: ChannelEmptyComponent },
  { path: 'start/edit', component: ChannelEditComponent },
  { path: 'start/imprint', component: ImprintComponent },
  { path: 'start/legal', component: LegalComponent },
  { path: '**', component: PageNotFoundComponent } 

];

