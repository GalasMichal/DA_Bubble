import { Component, effect, inject } from '@angular/core';
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
import { channel } from 'diagnostics_channel';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-menu-side-left',
  standalone: true,
  imports: [CommonModule, AvatarComponent, SearchComponent],
  templateUrl: './menu-side-left.component.html',
  styleUrl: './menu-side-left.component.scss',
})
export class MenuSideLeftComponent {
  isFirstDropdownMenuOpen = false;
  isSecondDropdownMenuOpen = true;
  dialog = inject(MatDialog);
  fb = inject(FirebaseService);
  chat = inject(ChatRoomService);
  ms = inject(MessageService);
  userService = inject(UserServiceService);
  router = inject(Router);
  state = inject(StateControlService);
  channelUsers : Channel[] = [];

  constructor() {
      effect(() => {
        if(this.fb.currentUser() != null) {
          console.log(this.fb.currentUser())
          const userId = this.fb.currentUser()!.uId;
          this.chat.getUserChannels(userId).then((userChannels) => {
            this.channelUsers = userChannels
          })
        }
  })
    this.chat.subChannelList();
    this.userService.subUserList();

  }


 async openMessage(user: User) {
    this.state.isThreadOpen = false;
    this.userService.messageReceiver = user;
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;

  // Prüfen, ob ein privater Chat bereits existiert
  const existingChatId = await this.ms.checkPrivateChatExists(user.uId);
  console.log('chatID', existingChatId);

  if (existingChatId) {
    // Wenn der Chat existiert, zur spezifischen Nachricht navigieren
    this.router.navigate(['/start/main/messages', existingChatId]);
    this.ms.loadMessagesFromChat(existingChatId);
  } else {

    this.router.navigate(['/start/main/messages']);
    // this.ms.newPrivateMessageChannel(user);
  }
  }
  ngOnDestroy(): void {}

  // Schow all channels
  async toogleDropDown1() {
    const userId = this.fb.currentUser()!.uId;
    this.chat.getUserChannels(userId);
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  toogleDropDown2() {
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen;
  }

  addChannel() {
    this.state.isThreadOpen = false;
    this.state.createChannelActiveInput = false;
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    });
  }

  async openChannel(chanId: string) {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false
    await this.chat.openChatById(chanId);
  }

  sortListOfUser() {
    const sortAllUser = this.userService.userList
    sortAllUser.sort((a, b) => {
      if(a.uId === this.fb.currentUser()?.uId) return -1
      if(b.uId === this.fb.currentUser()?.uId) return 1

      return a.displayName.localeCompare(b.displayName)
    })
    return sortAllUser
  };


  writeMessage() {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false;
    this.router.navigate(['/start/main']);
  }
}
