import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-confirm-delete-channel',
  standalone: true,
  imports: [CommonModule, RouterModule, CloseComponent],
  templateUrl: './confirm-delete-channel.component.html',
  styleUrl: './confirm-delete-channel.component.scss',
})
export class ConfirmDeleteChannelComponent {
  readonly dialog = inject(MatDialogRef<ConfirmDeleteChannelComponent>);
  stateControl = inject(StateControlService);
  fb = inject(FirebaseService);

  constructor(
    public confirmDialogRef: MatDialogRef<ConfirmDeleteChannelComponent>
  ) {}

  closeDelete() {
    this.dialog.close();
  }

  confirmDeleteChannel() {
    const result = true;
    this.confirmDialogRef.close(result);
  }
}
