import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseComponent } from '../close/close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteChannelComponent } from '../../../main-content/chat-room/confirm-delete-channel/confirm-delete-channel.component';

@Component({
  selector: 'app-dialog-global',
  standalone: true,
  imports: [CommonModule, RouterModule, CloseComponent],
  templateUrl: './dialog-global.component.html',
  styleUrl: './dialog-global.component.scss',
})
export class DialogGlobalComponent {
  readonly dialog = inject(MatDialogRef<ConfirmDeleteChannelComponent>);

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialog.close();
  }
}
