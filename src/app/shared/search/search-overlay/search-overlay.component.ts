import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { RecentSearchesListComponent } from '../recent-searches-list/recent-searches-list.component';
import { QuickResultsListComponent } from '../quick-results-list/quick-results-list.component';
import { SearchBarService } from '../../../services/search/search.service';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [
    MatListModule,
    MatIcon,
    MatDivider,
    MatIconButton,
    RouterModule,
    RecentSearchesListComponent,
    QuickResultsListComponent,
    MatButton,

  ],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss'
})
export class SearchOverlayComponent {
  searchTerm = inject(SearchBarService).searchTerm;
}
