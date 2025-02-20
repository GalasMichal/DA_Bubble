import { Component, computed, effect, inject } from '@angular/core';
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
  dialog = inject(MatDialog);
  fb = inject(FirebaseService);
  chat = inject(ChatRoomService);
  ms = inject(MessageService);
  userService = inject(UserServiceService);
  router = inject(Router);
  state = inject(StateControlService);
  storageService = inject(StorageService); // StorageService injizieren
  channelUsers: Channel[] = [];
  selectedChannelId: string | null = null; // Store selected channel ID

  constructor() {}

  ngOnInit(): void {
    this.userService.subUserList(); // Load users from Friebase
    this.sortListOfUser();
  }

  toggleMenuSubscription() {
    if (this.isFirstDropdownMenuOpen || this.state.isMenuOpen) {
      // Starte das Abonnement, wenn das Menü sichtbar ist
      // this.chat.subChannelList();
      // this.chat.channelList;
    } else {
      // Beende das Abonnement, wenn das Menü nicht sichtbar ist
      // this.chat.unsubscribe('channel');
    }
  }

  ngOnDestroy(): void {
    // // Ressourcen bereinigen
    // this.chat.unsubscribe(this.chat.channelUnsubscribe);
    // if (this.ms.unsubscribeMessages) {
    //   this.ms.unsubscribe(this.ms.unsubscribeMessages);
    // }
  }

  openChannel(channel: Channel): void {
    this.storageService.uploadMsg.set(''); // remove image from text area
    this.selectedChannelId = channel.chanId; // Highlight the selected channel
    // this.chat.unsubscribe('channel');
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false;
    this.chat.setCurrentChannel(channel);
    this.router.navigate(['main/chat', channel.chanId]);
  }

  async openMessage(user: User): Promise<void> {
    this.storageService.uploadMsg.set(''); // remove image from text area
    this.selectedChannelId = user.uId; //Highlight the selected channel
    this.state.isThreadOpen = false;
    this.userService.messageReceiver = user;
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;

    const existingChatId = await this.ms.checkPrivateChatExists(user.uId);
    if (existingChatId) {
      this.router.navigate(['main/messages', existingChatId]);
      this.ms.loadMessagesFromChat(existingChatId);
    } else {
      this.router.navigate(['main/messages']);
    }
  }

  toogleDropDown1(): void {
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  toogleDropDown2(): void {
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen;
  }

  addChannel(): void {
    this.state.isThreadOpen = false;
    this.state.createChannelActiveInput = false;
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    });
  }

  sortListOfUser(): User[] {
    const sortAllUser = [...this.userService.userList];
    sortAllUser.sort((a, b) => {
      if (a.uId === this.fb.currentUser()?.uId) return -1;
      if (b.uId === this.fb.currentUser()?.uId) return 1;

      return a.displayName.localeCompare(b.displayName);
    });
    return sortAllUser;
  }
  sortAllChannels = computed(() => this.chat.channels());
  sortOfAllChannels() {
    this.sortAllChannels().sort((a, b) => {
      if (a.chanId === this.fb.mainChannel) return -1;
      if (b.chanId === this.fb.mainChannel) return 1;

      return a.channelName.localeCompare(b.channelName);
    });
    return this.sortAllChannels();
  }

  writeMessage(): void {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false;
    this.state.isSendButtonActive = true;
    this.router.navigate(['main']);
  }
}
