import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { CloseComponent } from '../component/close/close.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CreateAvatarComponent } from '../../landing-page/create-avatar/create-avatar.component';
import { PwdRecoveryComponent } from '../../landing-page/pwd-recovery/pwd-recovery.component';
import { DeleteAccountComponent } from '../component/delete-account/delete-account.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    MatDialogContent,
    AvatarComponent,
    CloseComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly dialog = inject(MatDialogRef<ProfileComponent>);
  readonly editDialog = inject(MatDialog);
  readonly openDialog = inject(MatDialog);
  fb = inject(FirebaseService);
  
  closeDialogProfile() {
    this.dialog.close();
  }

  openDialogEdit() {
    this.openDialog.open(EditProfileComponent, {
      panelClass: 'edit-profile-container', // Custom class for profile dialog
    });
  }

  editAvatar() {
    this.openDialog.open(CreateAvatarComponent, {
      panelClass: 'create-profile-container', // Custom class for profile dialog
    });
  }

  pwdRecovery() {
    this.openDialog.open(PwdRecoveryComponent, {
      panelClass: 'pwdrecovery-container', // Custom class for profile dialog
    });
  }

  deleteAccount() {
    this.openDialog.open(DeleteAccountComponent, {
      panelClass: 'delete-container', // Custom class for profile dialog
    });

  }
}
