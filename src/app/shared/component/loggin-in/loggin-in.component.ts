import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-loggin-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './loggin-in.component.html',
  styleUrl: './loggin-in.component.scss'
})
export class LogginInComponent {

}
