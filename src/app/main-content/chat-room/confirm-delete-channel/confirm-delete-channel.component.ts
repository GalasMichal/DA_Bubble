import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';

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
  chat = inject(ChatRoomService);

  constructor(
    public confirmDialogRef: MatDialogRef<ConfirmDeleteChannelComponent>
  ) {}

  closeDelete() {
    this.dialog.close();
  }

  confirmDeleteChannel() {
    const result = true;
    if (this.chat.currentChannelSignal() !== null) {
      const currentChannel = this.chat.currentChannelSignal();
      if (currentChannel !== null) {
        this.chat.deleteChannel(currentChannel.chanId);
      }
    }
    this.confirmDialogRef.close(result);
  }
}
