import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pwd-reset',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './pwd-reset.component.html',
  styleUrl: './pwd-reset.component.scss'
})
export class PwdResetComponent {

}
