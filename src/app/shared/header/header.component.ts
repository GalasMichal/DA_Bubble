import { Component, inject } from '@angular/core';
import { HeaderDialogComponent } from '../header-dialog/header-dialog.component';
import { MatDialog } from '@angular/material/dialog';
<<<<<<< HEAD
import { SearchComponent } from '../../main-content/search/search.component';
=======
import { LogoComponent } from '../../logo/logo.component';
>>>>>>> developer

@Component({
  selector: 'app-header',
  standalone: true,
<<<<<<< HEAD
  imports: [HeaderDialogComponent, SearchComponent],
=======
  imports: [HeaderDialogComponent, LogoComponent],
>>>>>>> developer
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