import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [ReactionBarComponent, TimeSeparatorComponent],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss',
})
export class MessageAnswerComponent {
  @Input() userMessage = {
    userDetails: {
      userName: 'User Name',
      timeStamp: 'time stamp',
    },
    userMessage: 'Welche Version ist aktuell von Angular?',
    profileImage: {
      src: 'assets/media/icons/profile-icons/user-6-noah.svg',
      alt: 'profile-image',
    },
    messageContent: 'Welche Version ist aktuell von Angular?',
    answerDetails: {
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
  };

  state = inject(StateControlService);
  @Input() hideDetails: boolean = false;

  openThread() {
    this.state.isThreadOpen = true;
  }
}
