import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import { InputAddUsersComponent } from '../component/input-add-users/input-add-users.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { CloseComponent } from '../component/close/close.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [MatDialogContent, InputAddUsersComponent, CloseComponent],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss',
})
export class AddUsersComponent {
  readonly dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  stateServer = inject(StateControlService);

  activeButton: boolean = false;

  closeAddUsers() {
    this.dialog.closeAll();
  }
  onButtonChanged(value: boolean) {
    this.activeButton = value;
  }
  async addUserToChat() {
    this.stateServer.choosenUserFirebase.push(
      // this.chat.currentChannelData!.createdBy[0].uId
    );
    // await this.chat.updateSpecificPeopleInChannelFromState();
    this.closeAddUsers();
    this.stateServer.choosenUser = [];
  }
}
