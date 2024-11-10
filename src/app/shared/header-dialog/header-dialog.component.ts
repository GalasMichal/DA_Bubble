import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileComponent } from '../profile/profile.component';
import { Router, RouterLink } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';

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
  stateControl = inject(StateControlService)

  openDialogProfile() {
    this.dialog.open(ProfileComponent, {
      panelClass: 'profile-container', // Custom class for profile dialog
    });
  }

  logOut() {
    this.closeDialog.close()
    this.stateControl.isUserLoggedIn = false;
    this.router.navigateByUrl('/start')
  }
}
