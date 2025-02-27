import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCreateComponent } from '../../chat-room/channel-create/channel-create.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/messages/message.service';
import { User } from '../../../models/interfaces/user.model';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { SearchComponent } from '../../../shared/search/search.component';
import { Channel } from '../../../models/interfaces/channel.model';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-menu-side-left',
  standalone: true,
  imports: [CommonModule, AvatarComponent, SearchComponent],
  templateUrl: './menu-side-left.component.html',
  styleUrls: ['./menu-side-left.component.scss'],
})
export class MenuSideLeftComponent {
  isFirstDropdownMenuOpen = true;
  isSecondDropdownMenuOpen = true;

  /**
   * inject dialog, firebase, chat, message, user, router, state, storage service
   */
  dialog = inject(MatDialog);
  fb = inject(FirebaseService);
  chat = inject(ChatRoomService);
  ms = inject(MessageService);
  userService = inject(UserServiceService);
  router = inject(Router);
  state = inject(StateControlService);
  storageService = inject(StorageService);

  channelUsers: Channel[] = [];
  selectedChannelId: string | null = null;
  sortAllChannels = computed(() => this.chat.channels());

  constructor() {}

  /**
   * subscribe user list and sort list of user
   */
  ngOnInit(): void {
    this.userService.subUserList();
    this.sortListOfUser();
  }

  /**
   * open selected channel
   * set upload message to empty
   * update state
   * set current channel
   * navigate to chat
   * @param channel interface channel
   */
  openChannel(channel: Channel): void {
    this.state.isDirectMessage = false;
    this.storageService.uploadMsg.set('');
    this.selectedChannelId = channel.chanId;
    this.updateState();
    this.chat.setCurrentChannel(channel);
    this.router.navigate(['main/chat', channel.chanId]);
  }

  /**
   * update state
   */
  private updateState(): void {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false;
  }

  /**
   * open selected message
   * set upload message to empty
   * update state
   * navigate to message
   * @param user interface user
   */
  async openMessage(user: User): Promise<void> {
    this.storageService.uploadMsg.set('');
    this.selectedChannelId = user.uId;
    this.updateState();
    this.ms.messages.set([]);
    this.state.isDirectMessage = true;
    await this.ms.saveMessageReceiverToIndexDB(user);
    await this.navigateToMessage(user.uId);
  }

  /**
   * navigate to message
   * existing chat id check in database if exists navigate to specified message
   * load messages from current chat
   * if not navigate to message component
   * @param uId string user id
   */
  private async navigateToMessage(uId: string): Promise<void> {
    const existingChatId = await this.ms.checkPrivateChatExists(uId);
    if (existingChatId) {
      this.router.navigate(['main/messages', existingChatId]);
      await this.ms.loadMessagesFromChat(existingChatId);
    } else {
      this.router.navigate(['main/messages']);
    }
  }

  /**
   * toogle dropdown menu
   */
  toogleDropDown1(): void {
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  /**
   * toogle dropdown menu
   */
  toogleDropDown2(): void {
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen;
  }

  /**
   * add channel
   * set states
   * open channel create component
   */
  addChannel(): void {
    this.state.isThreadOpen = false;
    this.state.createChannelActiveInput = false;
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    });
  }
  /**
   * show users in the channel
   * @returns number of users in the channel
   */
  sortListOfUser(): User[] {
    const sortAllUser = [...this.userService.userList];
    sortAllUser.sort((a, b) => {
      if (a.uId === this.fb.currentUser()?.uId) return -1;
      if (b.uId === this.fb.currentUser()?.uId) return 1;

      return a.displayName.localeCompare(b.displayName);
    });
    return sortAllUser;
  }

  /**
   * @returns sorted list of all channels
   */
  sortOfAllChannels() {
    this.sortAllChannels().sort((a, b) => {
      if (a.chanId === this.fb.mainChannel) return -1;
      if (b.chanId === this.fb.mainChannel) return 1;

      return a.channelName.localeCompare(b.channelName);
    });
    return this.sortAllChannels();
  }

  /**
   * open default component to write message
   */
  writeMessage(): void {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false;
    this.state.isSendButtonActive = true;
    this.router.navigate(['main']);
  }
}
