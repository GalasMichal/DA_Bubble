import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MatDialogContent, MatButtonModule, EditProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  readonly dialog = inject(MatDialogRef <ProfileComponent>)
  readonly editDialog = inject(MatDialog)

  closeDialogProfile() {
    this.dialog.close()
  }

  openDialogEdit() {
    this.editDialog.open(EditProfileComponent, {
      panelClass: 'edit-profile-container', // Custom class for profile dialog
    });
  }

}
