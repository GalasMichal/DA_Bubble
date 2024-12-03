import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { StateControlService } from '../../../services/state-control/state-control.service';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatDialogModule,
],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  stateControl = inject(StateControlService)

  showToastText: string = ''
}
