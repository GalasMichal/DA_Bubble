import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CloseComponent } from '../component/close/close.component';
import { AddUsersComponent } from '../add-users/add-users.component';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-show-users',
  standalone: true,
  imports: [CloseComponent, AvatarComponent, MatDialogContent],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.scss'
})
export class ShowUsersComponent {

    readonly dialog = inject(MatDialogRef <AddUsersComponent>)
    chat = inject(ChatRoomService);
    stateServer = inject(StateControlService
    )
  
    activeButton: boolean = false
  
    closeAddUsers() {
      this.dialog.close()
    }
    onButtonChanged(value: boolean) {
      this.activeButton = value;
    }
    addUserToChat() {

    }
}
