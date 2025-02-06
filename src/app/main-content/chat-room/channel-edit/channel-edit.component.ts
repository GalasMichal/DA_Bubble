import { Component, inject, Input, input, signal, Signal } from '@angular/core';
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
  isDisabled: boolean = false;
  channelEditTitel: boolean = false;
  channelEditDescription: boolean = false;
  chat = inject(ChatRoomService);
  firestore = inject(Firestore);
  stateServer = inject(StateControlService);
  fb = inject(FirebaseService);
  router = inject(Router);
  currentChannel: Signal<Channel | null> = signal<Channel | null>(null);

  // currentTitle = this.chat.currentChannelData?.channelName;
  // currentDescription = this.chat.currentChannelData?.channelDescription;
  newTitle: string = '';
  newDescription: string = '';
  counter: number = 0;
  // isDisabled =
  //   this.chat.currentChannelData?.createdBy[0].uId !==
  //   this.fb.currentUser()?.uId;
  isDisabledCreatedBy = false;
    // this.chat.currentChannelData?.createdBy[0].uId ===
    // this.fb.currentUser()?.uId;

  constructor() {
    // if (this.stateServer.createChannelActiveInput) {
    //   this.showAllChoosenUsers();
    // }
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

  onUpdateChannel(chanId: string, text: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter();
    } else {
      this.updateChannel(chanId, text);
    }
  }

  updateChannel(chanId: string, text: string) {
    const newTitleNewDescription = doc(this.firestore, 'channels', chanId);

    updateDoc(newTitleNewDescription, {
      channelName: this.newTitle === '' ? this.currentChannel()?.channelName : this.newTitle,
      channelDescription:
        this.newDescription === ''
          ? this.currentChannel()?.channelDescription
          : this.newDescription,
    });

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
        deleteDoc(doc(this.firestore, 'channels', chanId));
        this.dialogConfirm.closeAll();
        this.router.navigate(['main']);
      } else {
        confirmDialogRef.close();
      }
    });
  }

  showAllChoosenUsers() {
    // this.stateServer.choosenUser = [];
    // this.stateServer.choosenUserFirebase = [];

    // if (this.chat.currentChannelData !== undefined) {
    //   const listOfAllChoosenUsers =
    //     this.chat.currentUserChannelsSpecificPeopleObject;
    //   for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
    //     const object = listOfAllChoosenUsers[i];
    //     this.stateServer.choosenUser.push(object);
    //     this.stateServer.choosenUserFirebase.push(object.uId);
    //   }
    // }
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
        this.stateServer.choosenUserFirebase =
          this.stateServer.choosenUserFirebase.filter(
            (user) => user !== currentUser!.uId
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
