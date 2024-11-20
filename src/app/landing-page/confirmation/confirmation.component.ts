import { Component, inject } from '@angular/core';
import { BackComponent } from '../../shared/component/back/back.component';
import { RouterLink } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [BackComponent, RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

  stateControl = inject(StateControlService)

}
