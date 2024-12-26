import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchService = inject(SearchService);
  searchTerm = this.searchService.searchTerm;
  stateControl = inject(StateControlService)
  chat = inject(ChatRoomService);

  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

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

  search() {
    if (!this.searchTerm()) {
      return;
    }

    this.searchService.search();
  }

}
