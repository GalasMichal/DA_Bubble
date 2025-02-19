import { Component, computed, inject } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CloseComponent } from '../component/close/close.component';
import { AddUsersComponent } from '../add-users/add-users.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { DialogGlobalComponent } from '../component/dialog-global/dialog-global.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { ProfileSingleUserComponent } from '../profile-single-user/profile-single-user.component';

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
    userDialog = inject(MatDialog);

    chat = inject(ChatRoomService);
    stateControl = inject(StateControlService);
    userService = inject(UserServiceService);
    counter: number = 0;
    dialogConfirm = inject(MatDialog);
      fb = inject(FirebaseService);
    currentChannel = computed(() => this.chat.currentChannelSignal());
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
      this.stateControl.createChannelActiveInput = true
      this.openUsers.open(AddUsersComponent, {
        panelClass: 'add-users-container', // Custom class for profile dialog
      });
    }

    showDialog() {
        this.dialogConfirm.open(DialogGlobalComponent, {
          panelClass: 'dialog-global-container',
        });
      }

      filterAllUsersInChannel() {
        const showAllChoosenUsers = this.currentChannel()?.specificPeople; // Array of user IDs
        const allUsers = this.userService.userList; // Array of User objects
    
        const filteredUsers = allUsers.filter((user) =>
          showAllChoosenUsers?.includes(user.uId)
        );
       
        return filteredUsers
      }

      /**
       * Opens a dialog displaying the full profile of a user.
       *
       * @param userId - The unique identifier of the user whose profile will be displayed.
       */
      async openDialogProfile(userId: string) {
          await this.userService.openProfileUserSingle(userId)
        }
}
