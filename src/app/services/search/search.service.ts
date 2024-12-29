import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public readonly searchTerm = signal('');

  router = inject(Router);

  constructor() { }

  clearSearch() {
    this.searchTerm.set('');
  }

  search() {
    // this.router.navigate([`/search/${this.searchTerm()}`]);
    // this.recentSearchesService.addToRecentSearches(this.searchTerm());
  }
}
