import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent, CloseComponent, CommonModule],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss',
})
export class InputAddUsersComponent {
  userService = inject(UserServiceService);

  choosenUser: { userName: string; uId: string }[] = [];
  listOfAllUsers: { userName: string; uId: string }[] = [];

  top: number = 175;

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

  addUser(index: number) {
    const indexListOfAllUsers = this.listOfAllUsers[index];
    this.choosenUser.push(indexListOfAllUsers);
    this.addPxToList();
    this.activeReactiveButton();
    this.removeUserFromListOfAllUsers(index);
  }

  removeUser(index: number) {
    const indexChoosenUser = this.choosenUser[index];
    this.listOfAllUsers.push(indexChoosenUser);
    this.removeUserFromChoosenUser(index);
    this.makeButtonActiveReactive()
    this.removePxFromList();
  }

  makeButtonActiveReactive() {
    if (this.choosenUser.length === 0) {
        this.activeReactiveButton(false);
      }
  }

  removeUserFromChoosenUser(index: number) {
    this.choosenUser.splice(index, 1);
  }

  removeUserFromListOfAllUsers(index: number) {
    this.listOfAllUsers.splice(index, 1);
  }

  addPxToList() {
    this.top += 58;
  }

  removePxFromList() {
    this.top -= 58;
  }
}
