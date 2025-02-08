import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CloseComponent } from '../component/close/close.component';
import { AddUsersComponent } from '../add-users/add-users.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { DialogGlobalComponent } from '../component/dialog-global/dialog-global.component';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [CloseComponent, AvatarComponent, MatDialogContent],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.scss'
})
export class ShowUsersComponent {

    readonly dialog = inject(MatDialogRef <AddUsersComponent>)
    readonly openUsers = inject(MatDialog)

    chat = inject(ChatRoomService);
    stateServer = inject(StateControlService);
    counter: number = 0;
    dialogConfirm = inject(MatDialog);
      fb = inject(FirebaseService);

    activeButton: boolean = false

    closeAddUsers() {
      this.dialog.close()
    }
    onButtonChanged(value: boolean) {
      this.activeButton = value;
    }
    addUserToChat() {

    }

    onCounter() {
      if(this.counter >= 2) {
        this.showDialog();
        this.counter = 0;
      }
    }

    onOpenAddUsers() {
      const isDisabled = this.chat.currentChannelSignal()?.createdBy[0].uId !== this.fb.currentUser()?.uId
      this.counter++;

      if (isDisabled) {
        this.onCounter()
      } else {
        this.openAddUsers();
      }
    }

    openAddUsers() {
      this.stateServer.createChannelActiveInput = true
      this.openUsers.open(AddUsersComponent, {
        panelClass: 'add-users-container', // Custom class for profile dialog
      });
    }

    showDialog() {
        this.dialogConfirm.open(DialogGlobalComponent, {
          panelClass: 'dialog-global-container',
        });
      }
}
