import { Component, inject, Input } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [ReactionBarComponent, TimeSeparatorComponent],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss'
})
export class MessageAnswerComponent {
  user = inject(UserService);
  @Input() hideDetails: boolean = false;

  openThread(){
    this.user.isThreadOpen = true;
  }
}
