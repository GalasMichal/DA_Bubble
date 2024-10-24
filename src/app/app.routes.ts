import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { LegalComponent } from './landing-page/legal/legal.component';
import { ImprintComponent } from './landing-page/imprint/imprint.component';
import { RegisterUserComponent } from './landing-page/register-user/register-user.component';
import { LoginComponent } from './landing-page/login/login.component';
import { CreateAvatarComponent } from './landing-page/create-avatar/create-avatar.component';
import { PwdResetComponent } from './landing-page/pwd-reset/pwd-reset.component';
import { PwdRecoveryComponent } from './landing-page/pwd-recovery/pwd-recovery.component';

import { ChannelEditComponent } from './main-content/chat-room/channel-edit/channel-edit.component';
import { ChannelCreateComponent } from './main-content/chat-room/channel-create/channel-create.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ChatRoomComponent } from './main-content/chat-room/chat-room.component';
import { empty } from 'rxjs';
import { MessageNewComponent } from './shared/component/message-new/message-new.component';

/*
IMPORTANTE
wenn ihr die route zum arbeiten ändert -> auch bitte wieder zurück setzen
Merci :)
*/

export const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'start', component: LoginComponent },
  { path: 'start/register', component: RegisterUserComponent },
  // { path: 'start/main', component: MainContentComponent },
  { path: 'start/avatar', component: CreateAvatarComponent },
  { path: 'start/imprint', component: ImprintComponent },
  { path: 'start/legal', component: LegalComponent },
  {
    path: 'start/main',
    component: MainContentComponent,
    children: [
      { path: '', component: MessageNewComponent },
      { path: 'chat/:id', component: ChatRoomComponent },
    ],
  },
  { path: 'reset', component: PwdResetComponent },
  { path: 'recovery', component: PwdRecoveryComponent },
  // { path: '**', component: PageNotFoundComponent },
];

// from before :
// export const routes: Routes = [
//   { path: '', redirectTo: 'start', pathMatch: 'full' },
//   { path: 'start', component: LoginComponent },
//   { path: 'start/register', component: RegisterUserComponent },
//   // { path: 'start/main', component: MainContentComponent },
//   { path: 'start/avatar', component: CreateAvatarComponent },
//   { path: 'start/imprint', component: ImprintComponent },
//   { path: 'start/legal', component: LegalComponent },
//   // { path: '**', component: PageNotFoundComponent },
//   { path: 'start/main', component: MainContentComponent, children:[
//     { path: '', component: MessageNewComponent},
//     { path: 'chat/:id', component: ChatRoomComponent}
//   ] },

// ];
