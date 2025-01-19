import { Component, EventEmitter, inject, Output } from '@angular/core';
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
  fireService = inject(FirebaseService);

  // Nicht fertig
  listOfAllUsers: User[] = [...this.userService.userList];

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  constructor() {
    if (this.stateServer.createChannelActiveInput) {
      this.showAllChoosenUsers();
    }
  }

  showAllChoosenUsers() {
    this.stateServer.choosenUser = [];
    this.stateServer.choosenUserFirebase = [];

    if (this.chat.currentChannelData !== undefined) {
      const listOfAllChoosenUsers =
        this.chat.currentUserChannelsSpecificPeopleObject;
      for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
        const object = listOfAllChoosenUsers[i];
        if (object.uId !== this.chat.currentChannelData.createdBy[0].uId) {
          this.stateServer.choosenUser.push(object);
          this.stateServer.choosenUserFirebase.push(object.uId);
        }
      }
    }
  }

  filterOnlyAvaliableUser() {
    const choosenUsers = new Set(
      this.stateServer.choosenUser.map((user) => user.uId)
    );
    return this.listOfAllUsers.filter(
      (user) =>
        !choosenUsers.has(user.uId) &&
        user.uId !== this.fireService.currentUser()?.uId
    );
  }

  addUser(index: number, event: Event, uId: string) {
    event.preventDefault();
    const indexListOfAllUsers = this.filterOnlyAvaliableUser()[index];
    this.stateServer.choosenUser.push(indexListOfAllUsers);
    this.stateServer.choosenUserFirebase.push(uId);

    this.makeButtonActiveReactive();
    this.filterOnlyAvaliableUser();
  }

  removeUser(index: number, event: Event) {
    event.preventDefault();
    this.stateServer.choosenUser.splice(index, 1);
    this.stateServer.choosenUserFirebase.splice(index, 1);
    this.makeButtonActiveReactive();
    this.filterOnlyAvaliableUser();
  }

  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    } else {
      this.activeReactiveButton(true);
    }
  }
}
