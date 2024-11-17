import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { User } from '../../../models/interfaces/user.model';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { log } from 'console';

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

  // Nicht fertig
  listOfAllUsers: User[] = [...this.userService.userList];
  listOfAllChoosenUsers: User[] = [...this.chat.currentChannelData.specificPeople];

  top: number = 40;

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  constructor() {
  }

  filterOnlyAvaliableUser() {
    const listOfAllUser = this.listOfAllUsers.map((user) => user.uId);
    
    const commonUsers = this.listOfAllChoosenUsers.filter((user) =>
      listOfAllUser.includes(user.uId)
    );

    let updatedListOfAllUsers = this.listOfAllUsers.filter(
      (user) => !commonUsers.some((commonUser) => commonUser.uId === user.uId)
    );

    return updatedListOfAllUsers
  }

  addUser(index: number, event: Event) {
    event.preventDefault();
    this.filterOnlyAvaliableUser();
    const indexListOfAllUsers = this.listOfAllUsers[index];
    this.stateServer.choosenUser.push(indexListOfAllUsers);
    this.activeReactiveButton();
    this.removeUserFromListOfAllUsers(index);
    this.addPxToList();
  }

  removeUser(index: number, event: Event) {
    event.preventDefault();
    const indexChoosenUser = this.stateServer.choosenUser[index];
    this.listOfAllUsers.push(indexChoosenUser);
    this.removeUserFromChoosenUser(index);
    this.makeButtonActiveReactive();
    this.removePxFromList();
  }

  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    }
  }

  removeUserFromListOfAllUsers(index: number) {
    this.listOfAllUsers.splice(index, 1);
  }

  removeUserFromChoosenUser(index: number) {
    this.stateServer.choosenUser.splice(index, 1);
  }

  addPxToList() {
    this.top += 54;
  }

  removePxFromList() {
    this.top -= 54;
  }
}
