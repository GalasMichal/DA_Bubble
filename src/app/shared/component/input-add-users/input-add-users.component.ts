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

  top: number = 40;

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  constructor() {
    this.showAllChoosenUsers()
    this.addPxToList()
  }

  showAllChoosenUsers() {
    this.stateServer.choosenUser = [];
    const listOfAllChoosenUsers= this.chat.currentChannelData.specificPeople;
    for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
      const object = listOfAllChoosenUsers[i];
      this.stateServer.choosenUser.push(object)
    }
  }


  filterOnlyAvaliableUser() {
    const listOfAllUserId = this.listOfAllUsers.map((user) => user.uId);
    
    const commonUsers = this.stateServer.choosenUser.filter((user) =>
      listOfAllUserId.includes(user.uId)
    );

    let updatedListOfAllUsers = this.listOfAllUsers.filter(
      (user) => !commonUsers.some((commonUser) => commonUser.uId === user.uId)
    );

    return updatedListOfAllUsers
  }

  addUser(index: number, event: Event) {
    event.preventDefault();
    const indexListOfAllUsers = this.filterOnlyAvaliableUser()[index];
    this.stateServer.choosenUser.push(indexListOfAllUsers);
    this.activeReactiveButton();
    this.filterOnlyAvaliableUser()
    this.addPxToList();
  }

  removeUser(index: number, event: Event) {
    event.preventDefault();
    this.removeUserFromChoosenUser(index)
    this.makeButtonActiveReactive();
    this.filterOnlyAvaliableUser()
    this.removePxFromList();
  }

  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    } else {
      this.activeReactiveButton(true);
    }
  }

  removeUserFromChoosenUser(index: number) {
    this.stateServer.choosenUser.splice(index, 1);
  }

  addPxToList() {
    if(this.stateServer.choosenUser.length != 0) {
    this.top = 54 + (54 * this.stateServer.choosenUser.length)
  } else {
    this.top += 54;
  }
}
  removePxFromList() {
    this.top -= 54;
  }
}
