import { Component, computed, inject } from '@angular/core';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { FormsModule } from '@angular/forms';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { ToastComponent } from '../../../shared/component/toast/toast.component';
import { ConfirmDeleteChannelComponent } from '../confirm-delete-channel/confirm-delete-channel.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../../shared/component/dialog-global/dialog-global.component';
import { Router } from '@angular/router';
import { ConfirmLeaveChannelComponent } from '../confirm-leave-channel/confirm-leave-channel.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { User } from '../../../models/interfaces/user.model';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent, CommonModule, FormsModule, ToastComponent],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
})
export class ChannelEditComponent {
  /**
   * Inject the MatDialogRef service to close the dialog
   * Inject the StateControlService to access the global state
   * Inject the MatDialog service to open the confirm dialog
   * Inject the ChatRoomService to access the chat room
   * Inject the FirebaseService to access the firebase
   * Inject the UserServiceService to access the user list
   * Inject the Router to navigate to another page
   */
  readonly dialog = inject(MatDialogRef<ChannelEditComponent>);
  dialogConfirm = inject(MatDialog);
  chat = inject(ChatRoomService);
  stateServer = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  router = inject(Router);

  channelEditTitel: boolean = false;
  channelEditDescription: boolean = false;

  /**
   * Get the current channel from the chat room service signal
   */
  currentChannel = computed(() => this.chat.currentChannelSignal());

  channelName = this.currentChannel()?.channelName;
  channelDescription = this.currentChannel()?.channelDescription;
  newTitle: string = '';
  newDescription: string = '';
  counter: number = 0;
  /**
   * Check if the user is the creator of the channel
   */
  isDisabled =
    this.currentChannel()?.createdBy[0].uId !== this.fb.currentUser()?.uId;
  isDisabledCreatedBy =
    this.currentChannel()?.createdBy[0].uId === this.fb.currentUser()?.uId;

  /**
   * Filter all users in the channel
   */
  constructor() {
    if (this.stateServer.createChannelActiveInput) {
      this.filterAllUsersInChannel();
    }
  }

  /**
   * Close the dialog
   */
  closeChannelEdit() {
    this.dialog.close();
  }

  /**
   * Handle the counter to show the dialog
   * If the counter is greater than 2, show the dialog
   */
  onCounter() {
    if (this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  /**
   * Edit the channel tittle
   */
  onEditTittle() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.editChannelTittle();
    }
  }

  /**
   * Edit the channel description
   */
  onEditDescription() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.editChannelDescription();
    }
  }

  /**
   * Show the dialog
   */
  showDialog() {
    this.dialogConfirm.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  /**
   * Edit the channel tittle
   */
  editChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel;
  }

  /**
   * Save the channel tittle
   */
  saveChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel;
    this.newTitle = this.currentChannel()!.channelName;
  }

  /**
   * Edit the channel description
   */
  editChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
  }

  /**
   * Save the channel description
   */
  saveChannelDescription() {
    this.toggleChannelEditDescription();
    this.setNewDescription();
  }

  toggleChannelEditDescription() {
    this.channelEditDescription = !this.channelEditDescription;
  }

  setNewDescription() {
    this.newDescription = this.currentChannel()!.channelDescription;
  }

  /**
   *  Update the channel
   * @param text text to show in the toast
   */
  onUpdateChannel(text: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.updateChannel(text);
    }
  }

  updateChannel(text: string) {
    const newName = this.getNewChannelName();
    const newDescription = this.getNewChannelDescription();
    this.applyChannelUpdates(newName, newDescription, text);
  }

  getNewChannelName() {
    return this.newTitle === ''
      ? this.currentChannel()!.channelName
      : this.newTitle;
  }

  getNewChannelDescription() {
    return this.newDescription === ''
      ? this.currentChannel()!.channelDescription
      : this.newDescription;
  }

  applyChannelUpdates(newName: string, newDescription: string, text: string) {
    const currentChannel = this.currentChannel();
    if (currentChannel) {
      currentChannel.channelName = newName;
      currentChannel.channelDescription = newDescription;
      this.chat.updateChannel(currentChannel);
      this.showUpdateToast(text);
      this.closeDialogAfterDelay();
    }
  }

  showUpdateToast(text: string) {
    this.stateServer.showToast = true;
    this.stateServer.showToastText.set(text);
    this.stateServer.removeShowToast();
  }

  closeDialogAfterDelay() {
    setTimeout(() => {
      this.dialog.close();
    }, 2200);
  }

  onDeleteChannel(chanId: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.confirmAndDeleteChannel(chanId);
    }
  }

  confirmAndDeleteChannel(chanId: string) {
    const confirmDialogRef = this.openConfirmDialog();

    confirmDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.performChannelDeletion(chanId);
      } else {
        confirmDialogRef.close();
      }
    });
  }

  openConfirmDialog() {
    return this.dialogConfirm.open(ConfirmDeleteChannelComponent, {
      panelClass: 'confirm-delete-channel',
    });
  }

  performChannelDeletion(chanId: string) {
    this.chat.deleteChannel(chanId);
    this.dialogConfirm.closeAll();
    this.router.navigate(['main']);
  }

  // Show all users except this user which created this channel
  filterAllUsersInChannel() {
    this.stateServer.choosenUser = [];
    const currentChannel = this.currentChannel();
    const showAllChoosenUsers = currentChannel?.specificPeople; // Array of user IDs
    const allUsers = this.userService.userList; // Array of User objects

    const filteredUsers = this.getFilteredUsers(allUsers, showAllChoosenUsers);
    this.stateServer.choosenUser = filteredUsers; // Assign filtered users
  }

  getFilteredUsers(
    allUsers: User[],
    showAllChoosenUsers: string[] | undefined
  ) {
    return allUsers.filter(
      (user) => showAllChoosenUsers?.includes(user.uId) && user.uId
    );
  }

  leaveChannel() {
    const currentUser = this.fb.currentUser();
    this.confirmAndLeaveChannel(currentUser);
  }

  confirmAndLeaveChannel(currentUser: User | null) {
    const confirmLeaveDialog = this.openLeaveConfirmDialog();

    confirmLeaveDialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.performChannelLeave(currentUser);
      } else {
        confirmLeaveDialog.close();
      }
    });
  }

  openLeaveConfirmDialog() {
    return this.dialogConfirm.open(ConfirmLeaveChannelComponent, {
      panelClass: 'confirm-leave-channel',
    });
  }

  performChannelLeave(currentUser: User | null) {
    this.stateServer.choosenUser = this.stateServer.choosenUser.filter(
      (user) => user.uId !== currentUser!.uId
    );
    // this.chat.updateSpecificPeopleInChannelFromState();
    this.dialogConfirm.closeAll();
    this.router.navigate(['main']);
  }
}
