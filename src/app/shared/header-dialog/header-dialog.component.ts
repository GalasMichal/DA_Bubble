import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { Router } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './header-dialog.component.html',
  styleUrl: './header-dialog.component.scss',
})
export class HeaderDialogComponent {
  readonly dialog = inject(MatDialog);
  readonly closeDialog = inject(MatDialogRef<ProfileComponent>);
  router = inject(Router);
  stateControl = inject(StateControlService);
  firebase = inject(FirebaseService);
  user = inject(UserServiceService);

  /**
   * Opens the profile dialog component if the user is not a guest.
   * Checks if the user is logged in and their username is not 'Gast'.
   * The profile dialog component has a custom class 'profile-container'.
   */
  openDialogProfile() {
    if (this.firebase.currentUser()!.displayName != 'Gast') {
      this.dialog.open(ProfileComponent, {
        panelClass: 'profile-container', // Custom class for profile dialog
      });
    }
  }

  /**
   * Logs out the user by calling logoutUser from FirebaseService.
   * Updates the user's online status to false.
   * Closes the header dialog.
   * Sets the user's login status to false.
   * Sets the confirmation text to 'Du bist erfolgreich abgemeldet.'.
   * Navigates to the confirmation page.
   */
  async logOut() {
    const userId = this.firebase.currentUser()!.uId;
    await this.firebase.logoutUser(userId);
    // noch dazu muss kommen update signal to firebase oder update profile tu firebase
    this.closeDialog.close();
    this.stateControl.isUserLoggedIn = false;
    this.stateControl.showConfirmationText.set(
      'Du bist erfolgreich abgemeldet.'
    );
    this.router.navigate(['confirmation']);
  }
}
