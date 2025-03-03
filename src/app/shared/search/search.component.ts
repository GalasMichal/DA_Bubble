import { Component, computed, inject, Input } from '@angular/core';
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
import { CloseComponent } from '../component/close/close.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, CloseComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  stateControl = inject(StateControlService);
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  ms = inject(MessageService);
  router = inject(Router);

  searchTerm = '';
  userResults: User[] = [];
  channelResults: Channel[] = [];
  allResults: Array<any> = [];
  currentIndex: number = -1;
  isResultsVisible = false;
  @Input() placeholderText: string = '';
  currentUserChannels = computed(() => this.chat.channels());

  /**
   * Clears the search term.
   */
  clearSearch() {
    this.searchTerm = '';
  }

  /**
   * Shows the search results by setting isResultsVisible to true.
   */
  showResults() {
    this.isResultsVisible = true;
  }

  /**
   * Hides the search results by setting isResultsVisible to false after a
   * short delay (200ms). This is used to prevent the results from disappearing
   * immediately when the user clicks outside of the search input.
   */
  hideResults() {
    setTimeout(() => {
      this.isResultsVisible = false;
    }, 200);
  }

  /**
   * Handles the keyboard navigation for the search results.
   * If the 'ArrowDown' key is pressed, it navigates to the next result.
   * If the 'ArrowUp' key is pressed, it navigates to the previous result.
   * If the 'Enter' key is pressed, it selects the current highlighted result.
   * @param event - The keyboard event triggered by the user.
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.navigateDown();
    } else if (event.key === 'ArrowUp') {
      this.navigateUp();
    } else if (event.key === 'Enter') {
      this.selectResult();
    }
  }

  /**
   * Navigates to the next result in the search dropdown.
   * If the currently highlighted result is the last one,
   * it wraps around to the top.
   */
  navigateDown(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex < totalResults - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.scrollToCurrentResult();
  }

  /**
   * Navigates to the previous result in the search dropdown.
   * If the currently highlighted result is the first one,
   * it wraps around to the bottom.
   */
  navigateUp(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = totalResults - 1;
    }
    this.scrollToCurrentResult();
  }

  /**
   * Selects the currently highlighted result in the search dropdown.
   * If the highlighted result is a user, it opens a message to that user.
   * If the highlighted result is a channel, it opens that channel.
   */
  selectResult(): void {
    const totalResults = this.getTotalResults();
    if (this.currentIndex >= 0 && this.currentIndex < totalResults) {
      const selectedResult = this.getSelectedResult();

      // Check if it's a user or a channel
      if (selectedResult.displayName) {
        this.openMessage(selectedResult);
      } else if (selectedResult.channelName) {
        this.openChannel(selectedResult, selectedResult.channelName);
      }
    }
  }

  /**
   * Gets the selected result object based on the currentIndex.
   * @returns {any} The selected result object.
   */
  getSelectedResult(): any {
    // Get the result object based on the currentIndex
    let selectedResult: any = null;

    if (this.currentIndex < this.userResults.length) {
      selectedResult = this.userResults[this.currentIndex];
    } else if (
      this.currentIndex <
      this.userResults.length + this.channelResults.length
    ) {
      selectedResult =
        this.channelResults[this.currentIndex - this.userResults.length];
    } else if (
      this.currentIndex <
      this.userResults.length +
        this.channelResults.length +
        this.allResults.length
    ) {
      selectedResult =
        this.allResults[
          this.currentIndex -
            this.userResults.length -
            this.channelResults.length
        ];
    }
    return selectedResult;
  }

  /**
   * Returns the total number of results from userResults, channelResults, and allResults.
   * @returns {number} The total number of results.
   */
  getTotalResults(): number {
    // Total results from userResults, channelResults, and allResults
    return (
      this.userResults.length +
      this.channelResults.length +
      this.allResults.length
    );
  }

  /**
   * Scrolls the currently highlighted search result into view.
   * It utilizes the currentIndex to find the corresponding result element
   * and smoothly scrolls it into the nearest viewable position.
   */
  scrollToCurrentResult(): void {
    const resultElement = document.querySelector(
      `#result-${this.currentIndex}`
    );
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Opens the selected channel.
   * @param channel The selected channel.
   * @param name The name of the selected channel.
   */
  openChannel(channel: Channel, name: string) {
    this.searchTerm = name;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;
    this.stateControl.isThreadOpen = false;
    this.stateControl.isSendButtonActive = false;
    this.chat.setCurrentChannel(channel);
    this.router.navigate(['main/chat', channel.chanId]);
  }

  /**
   * Sorts the list of users with the current user at the top of the list.
   *
   * The function sorts users such that the current user is always at the start
   * of the list, followed by other users sorted alphabetically by their display names.
   *
   * @returns {User[]} A sorted array of users with the current user appearing first.
   */
  sortListOfUser(): User[] {
    const sortAllUser = this.userService.userList;
    sortAllUser.sort((a, b) => {
      if (a.uId === this.fb.currentUser()?.uId) return -1;
      if (b.uId === this.fb.currentUser()?.uId) return 1;

      return a.displayName.localeCompare(b.displayName);
    });
    return sortAllUser;
  }

  /**
   * Handles the key up event for the search field.
   * Checks if the value contains '@' or '#' and
   * sets the corresponding results accordingly.
   * @param value the value of the search field
   */
  onKeyUp(value: string) {
    this.searchTerm = value;
    this.isResultsVisible = true;
    if (!value.startsWith('@') && !value.startsWith('#') && value !== '') {
      this.allResults = [
        ...this.sortListOfUser().filter((item) =>
          item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
        ...this.currentUserChannels()!.filter((item) =>
          item.channelName.toLowerCase().includes(value.slice(1).toLowerCase())
        ),
      ];
    } else if (value.startsWith('@')) {
      this.userResults = this.sortListOfUser().filter((item) =>
        item.displayName.toLowerCase().includes(value.slice(1).toLowerCase())
      );
    } else if (value.startsWith('#')) {
      this.channelResults = this.currentUserChannels().filter((item) =>
        item.channelName.toLowerCase().includes(value.slice(1).toLowerCase())
      );
    } else if (value === '') {
      this.channelResults = [];
      this.userResults = [];
      this.allResults = [];
    }
  }

  /**
   * Opens a direct message interface with the specified user.
   * Updates the application's state to reflect the current message receiver and view settings.
   * Checks if a private chat already exists with the user and navigates to it if found.
   * If no existing chat is found, initiates a new private message channel with the user.
   *
   * @param user - The user to open a message with, their displayName is set as the searchTerm.
   */
  async openMessage(user: User) {
    debugger
    this.stateControl.isThreadOpen = false;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;
    this.stateControl.isSendButtonActive = false;
    const existingChatId = await this.ms.checkPrivateChatExists(user.uId);

    if (existingChatId) {
      this.router.navigate(['main/messages', existingChatId]);
      await this.ms.loadMessagesFromChat(existingChatId);
    } else {
      this.router.navigate(['main/messages']);
      this.ms.newPrivateMessageChannel(user);
    }
  }
}
