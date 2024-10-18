import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './email-sent.component.html',
  styleUrl: './email-sent.component.scss'
})
export class EmailSentComponent {

}
