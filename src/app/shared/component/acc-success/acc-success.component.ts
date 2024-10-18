import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-acc-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatDialogModule,
],
  templateUrl: './acc-success.component.html',
  styleUrl: './acc-success.component.scss'
})
export class AccSuccessComponent {

}
