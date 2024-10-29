import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../../shared/user-profile/user-profile.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { MenuSideLeftComponent } from '../menu-side-left/menu-side-left/menu-side-left.component';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { ThreadAnswerComponent } from '../../shared/component/thread-answer/thread-answer.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

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
    RouterModule,
    RouterLink,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  readonly userDialog = inject(MatDialog);
  state: StateControlService = inject(StateControlService);
  isMenuOpen = true;
  public db = inject(FirebaseService);
  router = inject(Router);
  private auth = inject(Auth);
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService);

  constructor() {
    this.state.showMainContent = true;
  }

  async ngOnInit(): Promise<void> {
    let authenticated = false;

    await new Promise<void>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          authenticated = true;
          this.db.getUserByUid(user.uid); // Laden des Benutzers
        } else {
          this.router.navigate(['/start']);
        }
        resolve();
      });
    });

    if (!authenticated) {
      return;
    }}
    
  ngOnDestroy(): void {
    this.chat.unsubscribeAll();
    // this.userService.unsubscribe();
  }

  openUserProfile() {
    this.userDialog.open(UserProfileComponent, {
      panelClass: 'user-profile-container',
    });
  }
}
