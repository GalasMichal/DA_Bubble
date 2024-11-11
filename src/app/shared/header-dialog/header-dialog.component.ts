import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { Router, RouterLink } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatDialogContent, ],
  templateUrl: './header-dialog.component.html',
  styleUrl: './header-dialog.component.scss'
})
export class HeaderDialogComponent {
  readonly dialog = inject(MatDialog)
  readonly closeDialog = inject(MatDialogRef <ProfileComponent>)
  router = inject(Router)
  stateControl = inject(StateControlService)
  firebase = inject(FirebaseService)
  user = inject(UserServiceService)

  openDialogProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'profile-container', // Custom class for profile dialog
    });
  }

  logOut() {
    this.firebase.logoutUser();
    this.firebase.currentUser()!.status = false;
    // noch dazu muss kommen update signal to firebase oder update profile tu firebase
    this.closeDialog.close()
    this.stateControl.isUserLoggedIn = false;
    this.router.navigateByUrl('')
  }
}
