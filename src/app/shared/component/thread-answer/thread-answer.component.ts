import { Component, computed, inject, Input } from '@angular/core';
import { MessageAnswerComponent } from '../../message-answer/message-answer.component';
import { MessageFieldComponent } from '../message-field/message-field.component';

import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from '../close/close.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Message } from '../../../models/interfaces/message.model';
import { PrivateChat } from '../../../models/interfaces/privateChat.class';
import { Channel } from '../../../models/interfaces/channel.model';

@Component({
  selector: 'app-thread-answer',
  standalone: true,
  imports: [MessageAnswerComponent, MessageFieldComponent, CloseComponent],
  templateUrl: './thread-answer.component.html',
  styleUrl: './thread-answer.component.scss',
})
export class ThreadAnswerComponent {
  state = inject(StateControlService);
  user = inject(UserServiceService);
  chat = inject(ChatRoomService)

  @Input() currentChat: Channel | null = null


  constructor() {

   }
   ngOnInit(): void {

   }
  closeThread() {
    this.state.isThreadOpen = false;
  }

  getUserMessage() {
    
  }
}
