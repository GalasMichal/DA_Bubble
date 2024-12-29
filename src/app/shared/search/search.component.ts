import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MessageService } from '../../services/messages/message.service';
import { Router } from '@angular/router';
import { User } from '../../models/interfaces/user.model';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/interfaces/channel.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { CloseComponent } from "../component/close/close.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, CloseComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchService = inject(SearchService);

  stateControl = inject(StateControlService)
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  ms = inject(MessageService);
  router = inject(Router);
  isResultsVisible = false;

  searchTerm = ''; // Speichert die Eingabe des Benutzers
  userResults: User[] = [];
  channelResults: Channel[] = [];
  allResults: Array<any>= []
  
  clearSearch() {
    this.searchTerm = '';
  }

  showResults() {
    this.isResultsVisible = true;
  }

  hideResults() {
    setTimeout(() => {
      this.isResultsVisible = false;
    }, 200);
  }

  openChannel(chanId: string, name: string) {
    this.searchTerm = name;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;
    this.stateControl.isThreadOpen = false
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

  onKeyUp(value: string) {    
    this.searchTerm = value;
    
    if(!value.startsWith('@') && !value.startsWith('#') && (value !== '')) {
      this.allResults = [
        ...this.sortListOfUser().filter(item =>
          item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
        ...this.chat.currentUserChannels.filter(item =>
          item.channelName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
      ];
      console.log(this.allResults);
    } else if (value.startsWith('@')) {
      this.userResults = this.sortListOfUser().filter(item =>
        item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
      );
    } else if (value.startsWith('#')) {
      this.channelResults = this.chat.currentUserChannels.filter(item =>
        item.channelName.toLowerCase().includes(value.slice(1).toLowerCase())
      );
    } else if (value === '') {
      this.channelResults = [];
      this.userResults = [];
      this.allResults = [];
    }
  }

  async openMessage(user: User) {
      this.searchTerm = user.displayName;
      this.stateControl.isThreadOpen = false;
      this.userService.messageReceiver = user;
      this.stateControl.responsiveChat = true;
      this.stateControl.responsiveArrow = true;
      this.stateControl.responsiveMenu = true;
  
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
}
