import { Component, inject } from '@angular/core';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
import { MessageFieldComponent } from '../message-field/message-field.component';

import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from '../close/close.component';

@Component({
  selector: 'app-thread-answer',
  standalone: true,
  imports: [MessageAnswerComponent, MessageFieldComponent, CloseComponent],
  templateUrl: './thread-answer.component.html',
  styleUrl: './thread-answer.component.scss',
})
export class ThreadAnswerComponent {
  state = inject(StateControlService);

  closeThread() {
    this.state.isThreadOpen = false;
  }
}
