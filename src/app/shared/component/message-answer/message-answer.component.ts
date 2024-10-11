import { Component, inject, Input } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Message } from '../../../models/interfaces/message.model';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../../models/interfaces/user.model';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [
    CommonModule,
    ReactionBarComponent,
    TimeSeparatorComponent,
    EmojiComponent,
    PickerComponent,
    DatePipe,
  ],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss',
})
export class MessageAnswerComponent {
  chat = inject(ChatRoomService);
  firestore = inject(Firestore);
  today: number = Date.now();
  state = inject(StateControlService);

  @Input() hideDetails: boolean = false;
  @Input() index: number = 0;

  @Input() userMessage: Message = {
    text: '',
    chatId: '',
    timestamp: Timestamp.now(),
    messageSendBy: {
      uId: '',
      email: '',
      status: false,
      displayName: '',
      avatarUrl: '',
      channels: []
    },
    reactions: [],
    threadId: '',
    answerCount: 0,
    lastAnswer: '',
    editCount: 0,
    lastEdit: '',
    storageData: '',
    taggedUser: [],
  };

  

  emojis: { symbol: string; count: number }[] = [];

  onEmojiSelected(emoji: string) {
    // Überprüfe, ob das Emoji bereits existiert
    const existingReaction = this.userMessage.reactions.find(
      (e) => e.symbol === emoji
    );

    if (existingReaction) {
      existingReaction.count++; // Erhöhe den Zähler
    } else {
      this.userMessage.reactions.push({ symbol: emoji, count: 1 });
    }

    this.updateReactionsInFirestore();
  }

  constructor() {

  }

  ngOnInit() {
    // if(this.userId) {
    //   this.getUserFromAnswer(this.userId);
    // }

  }

  // getUserFromAnswer(userId: string) {
  //   if (userId) {
  //     this.user = this.chat.userList.find((user) => user.uId === userId);
  //     console.log('User:', this.user);
  //   }
  // }

  openThread() {
    this.state.isThreadOpen = true;
  }

  // Methode zum Aktualisieren der Reaktionen in Firestore
  async updateReactionsInFirestore() {
    const channelId = this.chat.currentChannelData.chanId;
    const messageId = this.userMessage.threadId;

    const messageDocRef = doc(
      this.firestore,
      'channels',
      channelId,
      'messages',
      messageId
    );

    // Aktualisiere die Reaktionen im Firestore-Dokument
    await updateDoc(messageDocRef, { reactions: this.userMessage.reactions });

    console.log('Reaktionen erfolgreich aktualisiert');
  }
}
