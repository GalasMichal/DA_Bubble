import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatDialogContent, ProfileComponent, RouterLink ],
  templateUrl: './header-dialog.component.html',
  styleUrl: './header-dialog.component.scss'
})
export class HeaderDialogComponent {
  readonly dialog = inject(MatDialog)
  readonly closeDialog = inject(MatDialogRef <ProfileComponent>)
  router = inject(Router)

  openDialogProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'profile-container', // Custom class for profile dialog
    });
  }

  logOut() {
    this.closeDialog.close()
    this.router.navigateByUrl('/start')
  }
}
