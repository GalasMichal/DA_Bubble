import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss'
})
export class DialogEditProfileComponent {

  readonly dialog = inject(MatDialog);
  stateControl = inject(StateControlService);
  fb = inject(FirebaseService);

  constructor() {}

  closeDialog() {
    this.dialog.closeAll();
  }
}
