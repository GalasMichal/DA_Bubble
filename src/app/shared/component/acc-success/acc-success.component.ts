import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { StateControlService } from '../../../services/state-control/state-control.service';


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

  stateControl = inject(StateControlService)

  showSuccessText: string = ''
}
