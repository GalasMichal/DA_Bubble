import { Component, inject } from '@angular/core';
import { HeaderDialogComponent } from '../header-dialog/header-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../../main-content/search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderDialogComponent, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(HeaderDialogComponent, {
      panelClass: 'custom-container',
    });
  }
}