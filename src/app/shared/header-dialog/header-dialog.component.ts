import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent],
  templateUrl: './header-dialog.component.html',
  styleUrl: './header-dialog.component.scss'
})
export class HeaderDialogComponent {

}
