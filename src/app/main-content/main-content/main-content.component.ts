import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { MenuSideLeftComponent } from '../menu-side-left/menu-side-left/menu-side-left.component';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { ThreadAnswerComponent } from '../../shared/component/thread-answer/thread-answer.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LogoComponent,
    MenuSideLeftComponent,
    ChatRoomComponent,
    ThreadAnswerComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  readonly userDialog = inject(MatDialog);
  state: StateControlService = inject(StateControlService);
  isMenuOpen = true;

  openUserProfile() {
    this.userDialog.open(UserProfileComponent, {
      panelClass: 'user-profile-container',
    });
  }
}
