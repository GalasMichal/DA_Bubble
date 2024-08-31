import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MatDialogContent, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  dialog = inject(MatDialogRef <ProfileComponent>)

  closeDialogProfile() {
    this.dialog.close()
  }

}
