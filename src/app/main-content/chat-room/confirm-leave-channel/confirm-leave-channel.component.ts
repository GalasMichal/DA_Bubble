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
  templateUrl: './confirm-leave-channel.component.html',
  styleUrl: './confirm-leave-channel.component.scss',
})
export class ConfirmLeaveChannelComponent {
  readonly dialog = inject(MatDialogRef<ConfirmLeaveChannelComponent>);
  stateControl = inject(StateControlService);
  fb = inject(FirebaseService);

  constructor(
    public confirmLeaveDialog: MatDialogRef<ConfirmLeaveChannelComponent>
  ) {}

  closeLeaveChannel() {
    this.dialog.close();
  }

  confirmLeaveChannel() {
    const result = true;
    this.confirmLeaveDialog.close(result);
  }
}
