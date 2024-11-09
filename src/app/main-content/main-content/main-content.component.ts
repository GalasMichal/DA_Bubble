import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../../shared/user-profile/user-profile.component';
import { MenuSideLeftComponent } from '../menu-side-left/menu-side-left/menu-side-left.component';
import { ThreadAnswerComponent } from '../../shared/component/thread-answer/thread-answer.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router, RouterModule } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MenuSideLeftComponent,
    ThreadAnswerComponent,
    RouterModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  readonly userDialog = inject(MatDialog);
  stateServer: StateControlService = inject(StateControlService);
  isMenuOpen = true;
  public db = inject(FirebaseService);
  router = inject(Router);
  private auth = inject(Auth);

  constructor() {
    this.stateServer.isUserLoggedIn = true;
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.db.getUserByUid(user.uid); // Laden des Benutzers
      } else {
        this.router.navigate(['/start/login']);
      }
    });
  }

  openUserProfile() {
    this.userDialog.open(UserProfileComponent, {
      panelClass: 'user-profile-container',
    });
  }
}
