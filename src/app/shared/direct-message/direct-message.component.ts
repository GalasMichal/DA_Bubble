import { Component, inject, Input, OnInit } from '@angular/core';
import { MessageFieldComponent } from '../component/message-field/message-field.component';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSingleUserComponent } from '../profile-single-user/profile-single-user.component';
import { Message } from '../../models/interfaces/message.model';
import { MessageService } from '../../services/messages/message.service';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';
import { User } from '../../models/interfaces/user.model';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [
    MessageFieldComponent,
    MessageAnswerComponent,
    AvatarComponent,
    CommonModule,
  ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit {
  ms = inject(MessageService);
  chat = inject(ChatRoomService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  user = inject(UserServiceService);
  fb = inject(FirebaseService);
  userService = inject(UserServiceService);
  readonly userDialog = inject(MatDialog);
  messages: Message[] = [];
  currentChatId: string = ''; // ID des aktuellen Chats

  ngOnInit(): void {
    this.loadCurrentMessageAfterRefresh();
  }

  async openProfileUserSingle(userId: string) {
    await this.userService.showProfileUserSingle(userId);
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }
  ngOnDestroy(): void {
    this.chat.messages.set([]);
  }

  loadCurrentMessageAfterRefresh(): void {
    const messageId = this.route.snapshot.paramMap.get('id');
    if (messageId) {
      this.ms.loadMessagesFromChat(messageId);

      this.userService.messageReceiver;
    }
  }
}
