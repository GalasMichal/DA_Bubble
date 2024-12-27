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

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
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
  allChannels = this.chat.currentUserChannels
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  searchTerm = ''; // Speichert die Eingabe des Benutzers
  results: User[] = [];


  clearSearch() {
    this.searchService.clearSearch();
  }

  openChannel(chanId: string) {
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
    if (value.startsWith('@')) {
      this.results = this.sortListOfUser().filter(item =>
        item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
        
      );
      console.log('@:', this.results)
    } else {
      // Keine Ergebnisse anzeigen, wenn das erste Zeichen weder @ noch #
      this.results = [];
    }
  }

  async openMessage(user: User) {
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
