import { Component, inject, Input, input } from '@angular/core';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Channel } from '../../../models/interfaces/channel.model';
import { FormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent, CommonModule, FormsModule],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
})
export class ChannelEditComponent {
  readonly dialog = inject(MatDialogRef<ChannelEditComponent>);
  channelEditTitel: boolean = false;
  channelEditDescription: boolean = false;
  chat = inject(ChatRoomService);
  firestore = inject(Firestore)


  closeChannelEdit() {
    this.dialog.close();
  }

  editChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel;
  }

  editChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
  }

  deleteChannel(chanId: string) {
    "Tylko przejsciowo"
    if (window.confirm('Bist du dir sicher?')) {
      deleteDoc(doc(this.firestore, "channels", chanId));
    }
  }
  
}
