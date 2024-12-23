import { Injectable, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
// import { RecentSearchesService } from './recent-searches.service';
// import { SearchResultsService } from './search-results.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  public readonly overlayOpen = signal(false);

  public readonly searchTerm = signal('');

  // resultsService = inject(SearchResultsService);
  router = inject(Router);
  // recentSearchesService = inject(RecentSearchesService);

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
    this.overlayOpen.set(false);
    // this.recentSearchesService.addToRecentSearches(this.searchTerm());
  }

  clearSearch() {
    this.searchTerm.set('');
    this.overlayOpen.set(true);
  }

  openBookDetail(bookId: string) {
    this.router.navigate([`/book/${bookId}`]);
    this.overlayOpen.set(false);
  }
}
