import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
} from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatDialogContent, ProfileComponent, RouterLink ],
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
