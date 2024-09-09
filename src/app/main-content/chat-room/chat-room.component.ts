import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, AddUsersComponent, MessageFieldComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})

export class ChatRoomComponent {
  usersInChat = ['assets/media/icons/profile-icons/user-1-elise.svg', 'assets/media/icons/profile-icons/user-2-elias.svg', 'assets/media/icons/profile-icons/user-4-steffen.svg'];
  dialog = inject(MatDialog)

  openAddUsers() {
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container', // Custom class for profile dialog
    });
  }

}
