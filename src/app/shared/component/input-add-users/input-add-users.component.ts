import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { User } from '../../../models/interfaces/user.model';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { log } from 'console';
import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent, CloseComponent, CommonModule],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss',
})
export class InputAddUsersComponent {
  userService = inject(UserServiceService);
  stateServer = inject(StateControlService);
  chat = inject(ChatRoomService);
  fb = inject(FirebaseService);
  fireService = inject(FirebaseService);
  currentChannel = computed(() => this.chat.currentChannelSignal());
  // Nicht fertig
  listOfAllUsers: User[] = [...this.userService.userList];

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  constructor() {
    this.stateServer.choosenUser = []
    this.filterAllUsersInChannel()
  }
  
  // HTML LINIE 23 filter only avalibale user but not Admin
  filterOnlyAvaliableUser() {
    const choosenUsers = new Set(
      this.stateServer.choosenUser.map((user) => user.uId)
    );
    return this.listOfAllUsers.filter(
      (user) => !choosenUsers.has(user.uId) && user.uId !== this.fireService.currentUser()?.uId
    );
  }

  filterAdmin() {
    const admin = this.listOfAllUsers.find((user) => user.uId === this.fireService.currentUser()?.uId)
    if(admin) {
      this.stateServer.choosenUser.push(admin)
    }
  }

// Show all users in channel.
  filterAllUsersInChannel() {
    this.filterAdmin()
    const currentChannel = this.currentChannel();
    const showAllChoosenUsers = currentChannel?.specificPeople; // Array of user IDs
    const allUsers = this.userService.userList; // Array of User objects

    const filteredUsers = allUsers.filter(
      (user) => showAllChoosenUsers?.includes(user.uId));
    this.stateServer.choosenUser = filteredUsers; // Assign filtered users
    console.log('INPUT-ADD-ISERS: this.stateServer.choosenUser ', this.stateServer.choosenUser);
}

addUser(uId: string, event: Event) {
  event.preventDefault();
  const selectedUser = this.listOfAllUsers.find(user => user.uId === uId);
  if (selectedUser) {
    this.stateServer.choosenUser.push(selectedUser);
    this.makeButtonActiveReactive();
  }
  console.log(this.stateServer.choosenUser);

}

  removeUser(index: number, event: Event) {
    event.preventDefault();
    this.stateServer.choosenUser.splice(index, 1);
    this.makeButtonActiveReactive();
    console.log('choosenUserFirebase: ', this.stateServer.choosenUser);    
  }

  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    } else {
      this.activeReactiveButton(true);
    }
  }
}
