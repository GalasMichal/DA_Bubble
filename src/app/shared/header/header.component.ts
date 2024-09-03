import { Component, inject } from '@angular/core';
import { HeaderDialogComponent } from '../header-dialog/header-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoComponent } from '../../logo/logo.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderDialogComponent, LogoComponent, SearchComponent],
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