import { Component, inject, Input } from '@angular/core';
import { MessageFieldComponent } from '../component/message-field/message-field.component';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { Router } from '@angular/router';
import { AvatarComponent } from "../avatar/avatar.component";
import { User } from '../../models/interfaces/user.model';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [MessageFieldComponent,
    MessageAnswerComponent,
    EmojiComponent, AvatarComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  chat = inject(ChatRoomService);
  router = inject(Router);
  user = inject(UserServiceService);
  fb = inject(FirebaseService)
}
