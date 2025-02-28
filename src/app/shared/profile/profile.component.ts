import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { CloseComponent } from '../component/close/close.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CreateAvatarComponent } from '../../landing-page/create-avatar/create-avatar.component';
import { PwdRecoveryComponent } from '../../landing-page/pwd-recovery/pwd-recovery.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [AvatarComponent, CloseComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly dialog = inject(MatDialogRef<ProfileComponent>);
  readonly openDialog = inject(MatDialog);
  fb = inject(FirebaseService);

  /**
   * Closes the profile dialog without saving any changes.
   */
  closeDialogProfile() {
    this.dialog.close();
  }

  /**
   * Opens the edit profile dialog.
   *
   * @remarks
   * This dialog is a modal that allows users to edit their profile information.
   * The dialog is styled with the 'edit-profile-container' class.
   */
  openDialogEdit() {
    this.openDialog.open(EditProfileComponent, {
      panelClass: 'edit-profile-container',
    });
  }

  /**
   * Opens the avatar creation dialog.
   *
   * @remarks
   * This dialog is a modal that allows users to upload and select their avatar.
   * The dialog is styled with the 'create-profile-container' class.
   */
  editAvatar() {
    this.openDialog.open(CreateAvatarComponent, {
      panelClass: 'create-profile-container',
    });
  }

  /**
   * Opens the password recovery dialog.
   * @remarks
   * This dialog allows users to initiate the password recovery process.
   * The dialog is styled with the 'pwdrecovery-container' class.
   */
  pwdRecovery() {
    this.openDialog.open(PwdRecoveryComponent, {
      panelClass: 'pwdrecovery-container',
    });
  }

  /**
   * Initiates the account deletion process by confirming the user's credentials.
   * @remarks
   * This function calls the Firebase service to authenticate the user with their password
   * before proceeding with the account deletion. If successful, the user's account will
   * be permanently deleted.
   */
  deleteAccount() {
    this.fb.confirmDeleteAccountWithPassword();
  }
}
