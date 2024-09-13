import { Component, inject } from '@angular/core';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
import { MessageFieldComponent } from '../message-field/message-field.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-thread-answer',
  standalone: true,
  imports: [MessageAnswerComponent, MessageFieldComponent],
  templateUrl: './thread-answer.component.html',
  styleUrl: './thread-answer.component.scss'
})
export class ThreadAnswerComponent {
  user = inject(UserService)

  closeThread(){
    this.user.isThreadOpen = false
  }

}
