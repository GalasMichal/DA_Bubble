import { Routes } from '@angular/router';
import { LegalComponent } from './landing-page/legal/legal.component';
import { ImprintComponent } from './landing-page/imprint/imprint.component';
import { RegisterUserComponent } from './landing-page/register-user/register-user.component';
import { LoginComponent } from './landing-page/login/login.component';
import { CreateAvatarComponent } from './landing-page/create-avatar/create-avatar.component';
import { PwdResetComponent } from './landing-page/pwd-reset/pwd-reset.component';
import { PwdRecoveryComponent } from './landing-page/pwd-recovery/pwd-recovery.component';
import { ChatRoomComponent } from './main-content/chat-room/chat-room.component';
import { MessageNewComponent } from './shared/component/message-new/message-new.component';
import { DirectMessageComponent } from './shared/direct-message/direct-message.component';
import { ConfirmationComponent } from './landing-page/confirmation/confirmation.component';
import { MainLayoutComponent } from './main-content/main-layout/main-layout.component';
import { LandingLayoutComponent } from './landing-page/landing-layout/landing-layout.component';
import { MainContentComponent } from './main-content/main-content/main-content.component';
// import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent, // Public layout (before login)
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterUserComponent },
      { path: 'avatar', component: CreateAvatarComponent },
      { path: 'imprint', component: ImprintComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: 'legal', component: LegalComponent },
      { path: 'reset', component: PwdResetComponent },
      { path: 'recovery', component: PwdRecoveryComponent },
    ],
  },
  {
    path: 'main',
    component: MainLayoutComponent, // Logged-in layout
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        component: MainContentComponent, // Main content wrapper
        children: [
          { path: '', component: MessageNewComponent },
          { path: 'chat/:id', component: ChatRoomComponent },
          { path: 'messages', component: DirectMessageComponent },
          { path: 'messages/:id', component: DirectMessageComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' }, // Catch-all redirect
];
