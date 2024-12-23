import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { SearchBarService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    OverlayModule,
    NgClass,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchBarService = inject(SearchBarService);
  searchTerm = this.searchBarService.searchTerm;
  overlayOpen = this.searchBarService.overlayOpen;

  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  clickedOutside(event: MouseEvent) {
    if (this.searchInput().nativeElement != (event.target as HTMLElement)) {
      this.overlayOpen.set(false);
    }
  }

  clearSearch() {
    this.searchBarService.clearSearch();
  }

  search() {
    if (!this.searchTerm()) {
      return;
    }

    this.searchBarService.search();
  }
}
