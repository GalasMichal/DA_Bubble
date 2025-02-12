import { Component, computed, ElementRef, inject, Input, viewChild } from '@angular/core';
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
  
  searchTerm = ''; // Speichert die Eingabe des Benutzers
  userResults: User[] = [];
  channelResults: Channel[] = [];
  allResults: Array<any>= []
  currentIndex: number = -1; 
  isResultsVisible = false;
  @Input() placeholderText: string = '';
  currentUserChannels = computed(() => this.chat.channels());

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

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.navigateDown();
    } else if (event.key === 'ArrowUp') {
      this.navigateUp();
    } else if (event.key === 'Enter') {
      this.selectResult();
      this.isResultsVisible = false;
    }
  }

  navigateDown(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex < totalResults - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;  // Wrap to the top
    }
    this.scrollToCurrentResult();
  }

  navigateUp(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = totalResults - 1;  // Wrap to the bottom
    }
    this.scrollToCurrentResult();
  }

  selectResult(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex >= 0 && this.currentIndex < totalResults) {
      const selectedResult = this.getSelectedResult();

      // Check if it's a user or a channel
      if (selectedResult.displayName) {
        this.openMessage(selectedResult);  // It's a user, open message
      } else if (selectedResult.channelName) {
        this.openChannel(selectedResult.chanId, selectedResult.channelName);  // It's a channel, open channel
      }
    }
  }

  getSelectedResult(): any {
    // Get the result object based on the currentIndex
    let selectedResult: any = null;

    if (this.currentIndex < this.userResults.length) {
      selectedResult = this.userResults[this.currentIndex];
    } else if (this.currentIndex < this.userResults.length + this.channelResults.length) {
      selectedResult = this.channelResults[this.currentIndex - this.userResults.length];
    } else if (this.currentIndex < this.userResults.length + this.channelResults.length + this.allResults.length) {
      selectedResult = this.allResults[this.currentIndex - this.userResults.length - this.channelResults.length];
    }

    return selectedResult;
  }

  getTotalResults(): number {
    // Total results from userResults, channelResults, and allResults
    return this.userResults.length + this.channelResults.length + this.allResults.length;
  }


  scrollToCurrentResult(): void {
    const resultElement = document.querySelector(`#result-${this.currentIndex}`);
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  openChannel(channel: Channel, name: string) {
    this.searchTerm = name;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;
    this.stateControl.isThreadOpen = false
    this.chat.setCurrentChannel(channel);
    this.router.navigate(['main/chat', channel.chanId]);
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
    this.isResultsVisible = true;
    if(!value.startsWith('@') && !value.startsWith('#') && (value !== '')) {
      this.allResults = [
        ...this.sortListOfUser().filter(item =>
          item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
        ...this.currentUserChannels()!.filter(item =>
          item.channelName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
      ];
      console.log(this.allResults);
    } else if (value.startsWith('@')) {
      this.userResults = this.sortListOfUser().filter(item =>
        item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
      );
    } 
    else if (value.startsWith('#')) {
      this.channelResults = this.currentUserChannels().filter(item =>
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
      this.router.navigate(['main/messages', existingChatId]);
      this.ms.loadMessagesFromChat(existingChatId);
    } else {

      this.router.navigate(['main/messages']);
      this.ms.newPrivateMessageChannel(user);
    }
    }
}
