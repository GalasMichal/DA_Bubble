import { Component, computed, inject, Input, input, signal, Signal } from '@angular/core';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Channel } from '../../../models/interfaces/channel.model';
import { FormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { ToastComponent } from '../../../shared/component/toast/toast.component';
import { ConfirmDeleteChannelComponent } from '../confirm-delete-channel/confirm-delete-channel.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../../shared/component/dialog-global/dialog-global.component';
import { Router } from '@angular/router';
import { ConfirmLeaveChannelComponent } from '../confirm-leave-channel/confirm-leave-channel.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent, CommonModule, FormsModule, ToastComponent],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
})
export class ChannelEditComponent {
  readonly dialog = inject(MatDialogRef<ChannelEditComponent>);
  dialogConfirm = inject(MatDialog);
  // isDisabled: boolean = false;
  channelEditTitel: boolean = false;
  channelEditDescription: boolean = false;
  chat = inject(ChatRoomService);
  firestore = inject(Firestore);
  stateServer = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  router = inject(Router);
  currentChannel = computed(() => this.chat.currentChannelSignal());

  channelName = this.currentChannel()?.channelName;
  channelDescription = this.currentChannel()?.channelDescription;
  newTitle: string = '';
  newDescription: string = '';
  counter: number = 0;
  isDisabled = this.currentChannel()?.createdBy[0].uId !== this.fb.currentUser()?.uId;
  isDisabledCreatedBy =
    this.currentChannel()?.createdBy[0].uId ===
    this.fb.currentUser()?.uId;

  constructor() {
    if (this.stateServer.createChannelActiveInput) {
      this.filterAllUsersInChannel()
    }
  }

  closeChannelEdit() {
    this.dialog.close();
  }
  onCounter() {
    if (this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  onEditTittle() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.editChannelTittle();
    }
  }

  onEditDescription() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.editChannelDescription();
    }
  }

  showDialog() {
    this.dialogConfirm.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  editChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel;
  }

  saveChannelTittle() {
    this.channelEditTitel = !this.channelEditTitel;
    this.newTitle = this.currentChannel()!.channelName;
  }

  editChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
  }

  saveChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
    this.newDescription = this.currentChannel()!.channelDescription;
  }

  onUpdateChannel(text: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.updateChannel(text);
    }
  }

  updateChannel(text: string) {
    const newName = this.newTitle === '' ? this.currentChannel()!.channelName : this.newTitle;
    const newDescription = this.newDescription === '' ? this.currentChannel()!.channelDescription: this.newDescription;
    this.currentChannel()!.channelName = newName;
    this.currentChannel()!.channelDescription = newDescription;
    this.chat.updateChannel(this.currentChannel()!)
    this.stateServer.showToast = true;
    this.stateServer.showToastText.set(text);
    this.stateServer.removeShowToast();
    setTimeout(() => {
      this.dialog.close();
    }, 2200);
  }

  onDeleteChannel(chanId: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.deleteChannel(chanId);
    }
  }

  deleteChannel(chanId: string) {
    const confirmDialogRef = this.dialogConfirm.open(
      ConfirmDeleteChannelComponent,
      {
        panelClass: 'confirm-delete-channel',
      }
    );

    confirmDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.chat.deleteChannel(chanId)
        this.dialogConfirm.closeAll();
        this.router.navigate(['main']);
      } else {
        confirmDialogRef.close();
      }
    });
  }

  // Show all users except this user which created this channel
  filterAllUsersInChannel() {
    this.stateServer.choosenUser = [];
    const currentChannel = this.currentChannel();
    const showAllChoosenUsers = currentChannel?.specificPeople; // Array of user IDs
    const allUsers = this.userService.userList; // Array of User objects

    const filteredUsers = allUsers.filter(
      (user) => showAllChoosenUsers?.includes(user.uId) && user.uId);
    this.stateServer.choosenUser = filteredUsers; // Assign filtered users
}

  leaveChannel() {
    const currentUser = this.fb.currentUser();

    const confirmLeaveDialog = this.dialogConfirm.open(
      ConfirmLeaveChannelComponent,
      {
        panelClass: 'confirm-leave-channel',
      }
    );
    confirmLeaveDialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.stateServer.choosenUser =
          this.stateServer.choosenUser.filter(
            (user) => user.uId !== currentUser!.uId
          );
        // this.chat.updateSpecificPeopleInChannelFromState();
        this.dialogConfirm.closeAll();
        this.router.navigate(['main']);
      } else {
        confirmLeaveDialog.close();
      }
    });
  }
}
