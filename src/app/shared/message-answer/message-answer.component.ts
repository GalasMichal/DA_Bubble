import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ReactionBarComponent } from '../component/reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

import { CommonModule, DatePipe } from '@angular/common';
import { Message } from '../../models/interfaces/message.model';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../models/interfaces/user.model';
import { ReactionCloudComponent } from '../component/reaction-cloud/reaction-cloud.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSingleUserComponent } from '../profile-single-user/profile-single-user.component';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [
    CommonModule,
    ReactionBarComponent,
    TimeSeparatorComponent,
    // EmojiComponent,
    // PickerComponent,
    DatePipe,
    ReactionCloudComponent,
  ],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss',
})
export class MessageAnswerComponent {
  chat = inject(ChatRoomService);
  firestore = inject(Firestore);
  fb = inject(FirebaseService);
  today: number = Date.now();
  state = inject(StateControlService);
  userService = inject(UserServiceService);
  readonly userDialog = inject(MatDialog);

  meUser: boolean = false;

  @Input() hideDetails: boolean = false;
  @Input() index: number = 0;
  @Input() threadAnswerOpen: boolean = false;
  @Input() userMessage: Message | null = null;
  @Input() answer: Message | null = null;

  currentMessage: Message | null = null;

  emojis: { symbol: string; count: number }[] = [];

  onEmojiSelected(emoji: string) {
   
    const currentUser = this.fb.currentUser();

    // Überprüfe, ob das Emoji bereits existiert
    const existingReaction = this.userMessage?.reactions.find(
      (e) => e.symbol === emoji
    );

    if (existingReaction) {
      existingReaction.count++; // Erhöhe den Zähler
    } else {
      this.userMessage?.reactions.push({
        symbol: emoji,
        count: 1,
        users: [
          { userName: currentUser?.displayName, uId: currentUser?.uId },
        ],
      });
    }

    this.updateReactionsInFirestore();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Prüfen, ob answer oder userMessage aktualisiert wurde
    if (changes['answer'] || changes['userMessage']) {
      this.updateCurrentMessage();
    }
  }

  constructor() {}

 async ngOnInit() {
   await this.chat.getAnswersFromMessage()
    this.updateCurrentMessage();


    // Prüfen, ob der aktuelle Benutzer die Nachricht gesendet hat
    if (this.currentMessage?.messageSendBy.uId === this.fb.currentUser()?.uId) {
      this.meUser = true;
    }
  }

  updateCurrentMessage() {
    // Priorisiere answer, falls vorhanden
    this.currentMessage = this.answer || this.userMessage;
  }

 async openThread(userMessage: Message) {
    // this.state.isThreadOpen = false;
    this.chat.currentMessageId = userMessage.threadId;
    await this.chat.getAnswersFromMessage();
    this.state.isThreadOpen = true;
    this.userService.setThreadMessage(userMessage); // Nachricht setzen
    this.updateCurrentMessage();
  }

  // Methode zum Aktualisieren der Reaktionen in Firestore
  async updateReactionsInFirestore() {
    const channelId = this.chat.currentChannelData.chanId;
    const messageId = this.userMessage!.threadId;

    const messageDocRef = doc(
      this.firestore,
      'channels',
      channelId,
      'messages',
      messageId
    );

    // Aktualisiere die Reaktionen im Firestore-Dokument
    await updateDoc(messageDocRef, { reactions: this.userMessage?.reactions });
  }

  async openProfileUserSingle(userId: string) {
    await this.userService.showProfileUserSingle(userId)
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  increaseCounter(emoji: string | undefined) {
    if (!emoji) return; // Exit if emoji is undefined.

    const currentUser = this.fb.currentUser(); // Get current user.
  
    // Find the existing reaction object (current emoji the user reacted to).
    const existingEmoji = this.userMessage?.reactions.find(
      (e) => e.users.some(user => user.uId === currentUser!.uId)      
    );
  
    if (existingEmoji) {
      // Remove user from the existing emoji's users list.
      existingEmoji.users = existingEmoji.users.filter(user => user.uId !== currentUser!.uId);
      existingEmoji.count--;
  
      // If no users are left, remove the reaction completely.
      if (existingEmoji.count === 0) {
        this.userMessage!.reactions = this.userMessage!.reactions.filter(e => e !== existingEmoji);
      }
    }
  
    // Add reaction to the new emoji (if it's different from the current one).
    const newEmoji = this.userMessage?.reactions.find(e => e.symbol === emoji);
  
    if (newEmoji) {
      newEmoji.count++;
      newEmoji.users.push({ userName: currentUser!.displayName, uId: currentUser!.uId });
    } else {
      this.userMessage?.reactions.push({
        symbol: emoji,
        count: 1,
        users: [{ userName: currentUser!.displayName, uId: currentUser!.uId }],
      });
    }
    
  }
}
