import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { CloseComponent } from '../component/close/close.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CreateAvatarComponent } from '../../landing-page/create-avatar/create-avatar.component';
import { PwdRecoveryComponent } from '../../landing-page/pwd-recovery/pwd-recovery.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MatDialogContent, EditProfileComponent, AvatarComponent, CloseComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  readonly dialog = inject(MatDialogRef <ProfileComponent>)
  readonly editDialog = inject(MatDialog)
  readonly pwdDialog = inject(MatDialog)

  fb = inject(FirebaseService);

  closeDialogProfile() {
    this.dialog.close()
  }
  
  openDialogEdit() {    
    this.editDialog.open(EditProfileComponent, {
      panelClass: 'edit-profile-container', // Custom class for profile dialog
    });
  }

  editAvatar() {
    this.editDialog.open(CreateAvatarComponent, {
      panelClass: 'create-profile-container', // Custom class for profile dialog
    });
  }

  pwdRecovery() {
    this.pwdDialog.open(PwdRecoveryComponent, {
      panelClass: 'pwdrecovery-container', // Custom class for profile dialog
    });
  }
}
