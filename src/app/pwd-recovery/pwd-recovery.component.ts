import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pwd-recovery',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './pwd-recovery.component.html',
  styleUrl: './pwd-recovery.component.scss'
})
export class PwdRecoveryComponent {

}
