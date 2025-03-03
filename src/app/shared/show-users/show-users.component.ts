import { Component, computed, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CloseComponent } from '../component/close/close.component';
import { AddUsersComponent } from '../add-users/add-users.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { DialogGlobalComponent } from '../component/dialog-global/dialog-global.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [CloseComponent, AvatarComponent, MatDialogContent],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.scss',
})
export class ShowUsersComponent {
  readonly dialog = inject(MatDialogRef<AddUsersComponent>);
  readonly openUsers = inject(MatDialog);
  userDialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  stateControl = inject(StateControlService);
  userService = inject(UserServiceService);
  dialogConfirm = inject(MatDialog);
  fb = inject(FirebaseService);

  counter: number = 0;
  currentChannel = computed(() => this.chat.currentChannelSignal());
  activeButton: boolean = false;

  /**
   * Closes the add users dialog.
   * It uses the dialog service to close all dialogs.
   */
  closeAddUsers() {
    this.dialog.close();
  }

  /**
   * Handles the activeButton value change, given by the child component InputAddUsersComponent.
   * @param value - boolean, true if the button is active, false if not
   */
  onButtonChanged(value: boolean) {
    this.activeButton = value;
  }

  /**
   * Checks the counter value and displays a dialog if the counter is 2 or more.
   * Resets the counter to zero after the dialog is shown.
   */
  onCounter() {
    if (this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  /**
   * Opens the dialog to add users to the channel.
   * Checks if the current user is the creator of the channel, and if so, increments the counter.
   * If the counter is 2 or more, it shows a dialog confirming the action, and resets the counter.
   * If the current user is not the creator of the channel, it opens the dialog to add users.
   */
  onOpenAddUsers() {
    const isDisabled =
      this.chat.currentChannelSignal()?.createdBy[0].uId !==
      this.fb.currentUser()?.uId;
    this.counter++;
    if (isDisabled) {
      this.onCounter();
    } else {
      this.openAddUsers();
    }
  }

  /**
   * Opens the dialog to add users to the channel.
   * Sets the `createChannelActiveInput` flag to true and opens the AddUsersComponent dialog.
   * The dialog is given a custom class of 'add-users-container' for styling purposes.
   */
  openAddUsers() {
    this.stateControl.createChannelActiveInput = true;
    this.openUsers.open(AddUsersComponent, {
      panelClass: 'add-users-container',
    });
  }

  /**
   * Opens a dialog that confirms the action of adding a user to the channel.
   * This dialog is only shown if the current user is not the creator of the channel.
   */
  showDialog() {
    this.dialogConfirm.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  /**
   * Filters and returns a list of users who are specifically chosen in the current channel.
   *
   * This function retrieves the list of user IDs from the current channel's `specificPeople` array
   * and filters the `userService.userList` to include only users whose IDs match.
   * You receive arra with obejct from users.
   * @returns {Array} An array of user objects that are part of the selected users in the channel.
   */
  filterAllUsersInChannel() {
    const showAllChoosenUsers = this.currentChannel()?.specificPeople;
    const allUsers = this.userService.userList;
    const filteredUsers = allUsers.filter((user) =>
      showAllChoosenUsers?.includes(user.uId)
    );
    return filteredUsers;
  }

  /**
   * Opens a dialog displaying the full profile of a user.
   *
   * @param userId - The unique identifier of the user whose profile will be displayed.
   */
  async openDialogProfile(userId: string) {
    await this.userService.openProfileUserSingle(userId);
  }
}
