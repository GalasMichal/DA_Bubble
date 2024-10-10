import { Component, inject, Input, input } from '@angular/core';
import { CloseComponent } from '../close/close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Channel } from '../../../models/interfaces/channel.model';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent, CommonModule],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss'
})
export class ChannelEditComponent {
  readonly dialog = inject(MatDialogRef <ChannelEditComponent>)
  channelEditTitel: boolean = false
  channelEditDescription: boolean = false
  chat = inject(ChatRoomService);

  channelData: Channel | null = null;


  closeChannelEdit() {
    this.dialog.close()
  }

  editChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel
  }

  editChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription
  }
}
