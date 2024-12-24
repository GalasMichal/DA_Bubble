import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecentSearchesService {

  constructor() { }

  public readonly recentSearches = signal<string[]>(
    JSON.parse(window.localStorage.getItem('recentSearches') ?? '[]')
  );


  deleteRecentSearch(searchTerm: string) {
    this.recentSearches.set(
      this.recentSearches().filter((s) => s !== searchTerm)
    );
  }

  addToRecentSearches(searchTerm: string) {
    const termInLowerCase = searchTerm.toLowerCase();
    this.recentSearches.set([
      termInLowerCase,
      ...this.recentSearches().filter((s) => s !== termInLowerCase),
    ]);
  }

  saveLocalStorage = effect(() => {
    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentSearches())
    );
  });
}
