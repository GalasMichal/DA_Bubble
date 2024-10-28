import { Component, inject } from '@angular/core';
import { MessageFieldComponent } from '../component/message-field/message-field.component';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [ MessageFieldComponent,
    MessageAnswerComponent,
    EmojiComponent,],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  chat = inject(ChatRoomService);
  router = inject(Router);
}
