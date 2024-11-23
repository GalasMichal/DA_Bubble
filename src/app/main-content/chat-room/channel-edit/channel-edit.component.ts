import { Component, inject, Input, input } from '@angular/core';
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
import { setTimeout } from 'node:timers';

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


  channelEditTitel: boolean = false;
  channelEditDescription: boolean = false;
  chat = inject(ChatRoomService);
  firestore = inject(Firestore)
  stateControl = inject(StateControlService)
  fb = inject(FirebaseService);

  currentTitle = this.chat.currentChannelData.channelName
  currentDescription = this.chat.currentChannelData.channelDescription
  newTitle: string = ""
  newDescription: string = ""
  counter: number = 0;
  isDisabled = this.chat.currentChannelData.createdBy[0].uId !== this.fb.currentUser()?.uId


  closeChannelEdit() {
    this.dialog.close();
  }
  onCounter() {
    if(this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  onEditTittle() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter()
    } else {
      // Perform the normal action
      this.editChannelTittle();
    }
  }

  onEditDescription() {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter()
    } else {
      // Perform the normal action
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
    this.newTitle = this.chat.currentChannelData.channelName;
  }

  editChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
  }
  
  saveChannelDescription() {
    this.channelEditDescription = !this.channelEditDescription;
    this.newDescription = this.chat.currentChannelData.channelDescription
  }

  onUpdateChannel(chanId: string, text:string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter()
    } else {
      // Perform the normal action
      this.updateChannel(chanId, text);
    }
  }
  
  updateChannel(chanId: string, text:string) {

    const newTitleNewDescription = doc(this.firestore, "channels", chanId);

    updateDoc(newTitleNewDescription, {
      channelName: this.newTitle === "" ? this.currentTitle : this.newTitle,
      channelDescription: this.newDescription === "" ? this.currentDescription : this.newDescription,
    });

    this.stateControl.showToast = true;
    this.stateControl.showToastText = text

    this.stateControl.removeShowToast();
    setTimeout(() => {
      this.dialog.close()
    }, 2200);
  }

  onDeleteChannel(chanId: string) {
    this.counter++;

    if (this.isDisabled) {
      this.onCounter()
    } else {
      // Perform the normal action
      this.deleteChannel(chanId);
    }
  }

  deleteChannel(chanId: string) {
    const confirmDialogRef = this.dialogConfirm.open(ConfirmDeleteChannelComponent, {
      panelClass: 'confirm-delete-channel',
    });

    confirmDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        deleteDoc(doc(this.firestore, "channels", chanId));
        this.dialogConfirm.closeAll()
      } else {
        confirmDialogRef.close()
      }
    })
  }
  
}
