import { Component, inject } from '@angular/core';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-message-image',
  standalone: true,
  imports: [],
  templateUrl: './message-image.component.html',
  styleUrl: './message-image.component.scss'
})
export class MessageImageComponent {
 stateControl = inject(StateControlService)
 
}
