import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent, CloseComponent, CommonModule],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss',
})
export class InputAddUsersComponent {
  userService = inject(UserServiceService);
  stateServer = inject(StateControlService)

  listOfAllUsers: { userName: string; uId: string }[] = [];

  bottom: number = -135;

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  ngOnInit(): void {
    this.loadOfListOfAllUsers()
  }

  loadOfListOfAllUsers() {
    const listOfUsers = this.userService.userList;
    for (let i = 0; i < listOfUsers.length; i++) {
      const userName = listOfUsers[i].displayName;
      const userId = listOfUsers[i].uId;
      this.listOfAllUsers.push({ userName: userName, uId: userId });
    }
  }

  addUser(index: number, event: Event) {
    event.preventDefault()
    const indexListOfAllUsers = this.listOfAllUsers[index];
    this.stateServer.choosenUser.push(indexListOfAllUsers);
    this.activeReactiveButton();
    this.removeUserFromListOfAllUsers(index);
    this.addPxToList();
  }

  removeUser(index: number, event: Event) {
    event.preventDefault();
    this.removePxFromList();
    const indexChoosenUser = this.stateServer.choosenUser[index];
    this.listOfAllUsers.push(indexChoosenUser);
    this.removeUserFromChoosenUser(index);
    this.makeButtonActiveReactive()
  }

  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
        this.activeReactiveButton(false);
      }
  }

  removeUserFromChoosenUser(index: number) {
    this.stateServer.choosenUser.splice(index, 1);
  }

  removeUserFromListOfAllUsers(index: number) {
    this.listOfAllUsers.splice(index, 1);
  }

  addPxToList() {
    if(this.listOfAllUsers.length === 0) {
      this.bottom += 0;
    } else {
      this.bottom += 58;
    }
  }

  removePxFromList() {
    if(this.listOfAllUsers.length === 0) {
      this.bottom -= 0;
    } else {
      this.bottom -= 58;
    }
  }
}
