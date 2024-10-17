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
  top: number = 175;

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeReactiveButton(para:boolean = true) {
    this.activeButton.emit(para); 
  }

  addUser(user: string, id: string) {
    const foundUser = this.choosenUser.find(
      (userchoosenUser) => userchoosenUser.uId === id
    );

    if (!foundUser) {
      this.choosenUser.push({ userName: user, uId: id });
      this.addPxToList();
      this.activeReactiveButton();
    }
  }

  removeUser(index: number) {
    this.choosenUser.splice(index, 1);
    this.removePxFromList();
    if(this.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    }
  }

  addPxToList() {
    this.top += 58;
  }

  removePxFromList() {
    this.top -= 58;
  }
}
