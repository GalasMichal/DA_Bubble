import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { User } from '../../../models/interfaces/user.model';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
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

  listOfAllUsers: User[] = [...this.userService.userList];

  @Output() activeButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Emits an event to active or deactivate the add users button
   * @param para default true, if true the button will be activated
   */
  activeReactiveButton(para: boolean = true) {
    this.activeButton.emit(para);
  }

  /**
   * Initializes the InputAddUsersComponent by resetting the chosen users list
   * and filtering all users in the current channel to update the available users list.
   */
  constructor() {
    this.stateServer.choosenUser = [];
    this.filterAllUsersInChannel();
  }

  /**
   * Filters and returns a list of users who are available to be added to the channel.
   *
   * This function creates a set of user IDs from the currently chosen users and
   * filters the list of all users to exclude those who are already chosen or
   * the current user. The result is a list of users who are not yet added to the channel.
   *
   * @returns {User[]} An array of user objects that are available to be added.
   */
  filterOnlyAvaliableUser(): User[] {
    const choosenUsers = new Set(
      this.stateServer.choosenUser.map((user) => user.uId)
    );
    return this.listOfAllUsers.filter(
      (user) =>
        !choosenUsers.has(user.uId) &&
        user.uId !== this.fireService.currentUser()?.uId
    );
  }

  /**
   * Finds the current user in the list of all users and adds them to the list of chosen users.
   * This is used to ensure the current user is always shown in the list of users in the channel.
   */
  filterAdmin() {
    const admin = this.listOfAllUsers.find(
      (user) => user.uId === this.fireService.currentUser()?.uId
    );
    if (admin) {
      this.stateServer.choosenUser.push(admin);
    }
  }

  /**
   * Filters and returns a list of users who are specifically chosen in the current channel.
   *
   * This function retrieves the list of user IDs from the current channel's `specificPeople` array
   * and filters the `userService.userList` to include only users whose IDs match.
   * The result is a list of users who are part of the selected users in the channel.
   * @returns {User[]} An array of user objects that are part of the selected users in the channel.
   */
  filterAllUsersInChannel() {
    this.filterAdmin();
    const currentChannel = this.currentChannel();
    const showAllChoosenUsers = currentChannel?.specificPeople;
    const allUsers = this.userService.userList;
    const filteredUsers = allUsers.filter((user) =>
      showAllChoosenUsers?.includes(user.uId)
    );
    this.stateServer.choosenUser = filteredUsers;
  }

  /**
   * Adds a user to the list of chosen users.
   * @param uId The ID of the user to add.
   * @param event The event that triggered this function.
   */
  addUser(uId: string, event: Event) {
    event.preventDefault();
    const selectedUser = this.listOfAllUsers.find((user) => user.uId === uId);
    if (selectedUser) {
      this.stateServer.choosenUser.push(selectedUser);
      this.makeButtonActiveReactive();
    }
  }

  /**
   * Removes a user from the list of chosen users.
   * @param index The index of the user to remove.
   * @param event The event that triggered this function.
   */
  removeUser(index: number, event: Event) {
    event.preventDefault();
    this.stateServer.choosenUser.splice(index, 1);
    this.makeButtonActiveReactive();
  }

  /**
   * Enables or disables the 'Add' button based on the number of chosen users.
   * If there are no chosen users, the button is disabled.
   * If there are chosen users, the button is enabled.
   */
  makeButtonActiveReactive() {
    if (this.stateServer.choosenUser.length === 0) {
      this.activeReactiveButton(false);
    } else {
      this.activeReactiveButton(true);
    }
  }
}
