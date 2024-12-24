import { Component, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { RecentSearchesService } from '../../../services/recent-searches/recent-searches.service';
import { SearchBarService } from '../../../services/search/search.service';

@Component({
  selector: 'app-recent-searches-list',
  standalone: true,
  imports: [
    MatListModule, MatIcon, MatIconButton
  ],
  templateUrl: './recent-searches-list.component.html',
  styleUrl: './recent-searches-list.component.scss'
})
export class RecentSearchesListComponent {
  searchBarService = inject(SearchBarService);
  recentSearchesService = inject(RecentSearchesService);
  recentSearches = computed(() => {
    const recentSearches = this.recentSearchesService.recentSearches();
    const term = this.searchBarService.searchTerm();
    if (term) {
      return recentSearches.filter((s) => s.includes(term)).splice(0, 1);
    }

    return recentSearches.slice(0, 5);
  });

  deleteSearch(searchTerm: string, event: MouseEvent) {
    event.stopPropagation();
    this.recentSearchesService.deleteRecentSearch(searchTerm);
  }
}
