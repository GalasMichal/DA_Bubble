import { Component, computed, inject } from '@angular/core';
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
  currentChannel = computed(() => this.chat.currentChannelSignal());
  activeButton: boolean = false;

  closeAddUsers() {
    this.dialog.closeAll();
  }
  onButtonChanged(value: boolean) {
    this.activeButton = value;
  }
  async addUserToChat() {
    // await this.chat.updateSpecificPeopleInChannelFromState();
    this.closeAddUsers();
    console.log('this.stateServer.choosenUser FINAL: ', this.stateServer.choosenUser);
    this.stateServer.choosenUser = [];
  }
}
