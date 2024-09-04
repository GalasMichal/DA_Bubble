import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatDialogContent, ProfileComponent ],
  templateUrl: './header-dialog.component.html',
  styleUrl: './header-dialog.component.scss'
})
export class HeaderDialogComponent {
  dialog = inject(MatDialog)

  openDialogProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'profile-container', // Custom class for profile dialog
    });
  }

}
