import { Component, computed, inject } from '@angular/core';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
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
  /**
   * inject services chat state and dialog
   */
  readonly dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  stateServer = inject(StateControlService);
  /**
   * Compute the current channel signal.
   * It returns the current channel signal from the chat service
   */
  currentChannel = computed(() => this.chat.currentChannelSignal());
  activeButton: boolean = false;

  /**
   * Closes the add users dialog.
   * It uses the dialog service to close all dialogs.
   */
  closeAddUsers() {
    this.dialog.closeAll();
  }

  /**
   * Updates the activeButton property with the given value.
   * This property is used to determine if the 'Add' button should be enabled or disabled.
   * @param value boolean - the new value of the activeButton
   */
  onButtonChanged(value: boolean) {
    this.activeButton = value;
  }

  /**
   * Adds the chosen users to the current chat channel and updates the channel information.
   * This function closes the add users dialog, maps the chosen users' IDs to the current channel's
   * specific people, updates the channel with the new list, and resets the chosen users list.
   * It ensures only the selected users are included in the channel's specific people list.
   */
  async addUserToChat() {
    this.closeAddUsers();
    const allChoosenUsersId = this.stateServer.choosenUser.map(
      (user) => user.uId
    );
    this.currentChannel()!.specificPeople = allChoosenUsersId;
    this.chat.updateChannel(this.currentChannel()!);
    this.stateServer.choosenUser = [];
  }
}
