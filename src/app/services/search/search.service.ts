import { Injectable, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { SearchResultsService } from '../search-results/search-results.service';
import { RecentSearchesService } from '../recent-searches/recent-searches.service';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  public readonly overlayOpen = signal(true);

  public readonly searchTerm = signal('');

  resultsService = inject(SearchResultsService);
  router = inject(Router);
  recentSearchesService = inject(RecentSearchesService);

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(500))
      .subscribe((term) => {
        // this.resultsService.getQuickResults(term);
      });
  }

  searchForTerm(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.search();
  }

  search() {
    this.router.navigate([`/search/${this.searchTerm()}`]);
    // Tu
    this.overlayOpen.set(true);
    this.recentSearchesService.addToRecentSearches(this.searchTerm());
  }

  clearSearch() {
    this.searchTerm.set('');
    this.overlayOpen.set(true);
  }

  openBookDetail(bookId: string) {
    this.router.navigate([`/book/${bookId}`]);
    // TU
    this.overlayOpen.set(true);
  }
}
