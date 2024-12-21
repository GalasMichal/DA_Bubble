import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCreateComponent } from '../../chat-room/channel-create/channel-create.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from '../../../services/messages/message.service';
import { PrivateChat } from '../../../models/interfaces/privateChat.class';
import { User } from '../../../models/interfaces/user.model';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { log } from 'console';
import { SearchComponent } from '../../../shared/search/search.component';

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

  ngOnInit() {
    this.chat.subChannelList();
    this.userService.subUserList();
  }

  openMessage(user: User) {
    this.state.isThreadOpen = false
    this.userService.messageReceiver = user;
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.router.navigate(['/start/main/messages']);
    // this.ms.newPrivateMessageChannel(user);
  }

  ngOnDestroy(): void {
  }

  async toogleDropDown1() {
    const userId = this.fb.currentUser()!.uId
    this.chat.checkUserInChannels(userId)
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  toogleDropDown2() {
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen;
  }

  addChannel() {
    this.state.isThreadOpen = false
    this.state.createChannelActiveInput = false;
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    });
  }
  
  openChannel(chanId: string) {
    this.state.responsiveChat = true;
    this.state.responsiveArrow = true;
    this.state.responsiveMenu = true;
    this.state.isThreadOpen = false
    this.chat.openChatById(chanId);
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
    this.state.isThreadOpen = false
    this.router.navigate(['/start/main']);
  }
}
