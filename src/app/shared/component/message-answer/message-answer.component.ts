import { Component } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [ReactionBarComponent],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss'
})
export class MessageAnswerComponent {

}
