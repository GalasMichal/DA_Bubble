import { Component, inject, Input } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [CommonModule, ReactionBarComponent, TimeSeparatorComponent, EmojiComponent, PickerComponent],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss',
})
export class MessageAnswerComponent {
  @Input() index: number = 0;
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
