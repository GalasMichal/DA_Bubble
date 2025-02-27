import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../services/state-control/state-control.service';

import { CommonModule, DatePipe } from '@angular/common';
import { Message } from '../../models/interfaces/message.model';
import { doc, updateDoc } from 'firebase/firestore';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { Firestore } from '@angular/fire/firestore';
import { ReactionCloudComponent } from '../component/reaction-cloud/reaction-cloud.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileSingleUserComponent } from '../profile-single-user/profile-single-user.component';
import { ShowImageComponent } from '../component/show-image/show-image.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [
    CommonModule,
    TimeSeparatorComponent,
    DatePipe,
    ReactionCloudComponent,
    PickerComponent,
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
  dialog = inject(MatDialog);
  showCloud: boolean = false;
  isEmojiPickerVisibleMessage: boolean[] = [false];
  newEmoji: string = "";

  currentChannel = computed(() => this.chat.currentChannelSignal());

  meUser: boolean = false;

  @Input() hideDetails: boolean = false;
  @Input() index: number = 0;
  @Input() threadAnswerOpen: boolean = false;
  @Input() userMessage: Message | null = null;
  @Input() answer: Message | null = null;
  @Output() editMessage = new EventEmitter<{
    textToEdit: string;
    channelId: string;
    messageId: string;
  }>();

  currentMessage: Message | null = null;

  emojis: { symbol: string; count: number }[] = [];

  addEmoji(event: any) {
    this.state.scrollToBottomGlobal = false;
    // Das ausgewählte Emoji wird in der aktuellen Komponente in newEmoji gespeichert
    this.newEmoji = `${this.newEmoji}${event.emoji.native}`; 

    // Das ausgewählte Emoji wird an die Elternkomponente weitergeleitet
    const emoji = event.emoji.native; // Nimm an, dass das Emoji im "native"-Feld ist
    this.onEmojiSelected(emoji);  // Emitiere das Emoji an die Elternkomponente
  }
 
  onEmojiSelected(emoji: string) {
    this.increaseCounter(emoji);
    this.updateReactionsInFirestore();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Prüfen, ob answer oder userMessage aktualisiert wurde
    if (changes['answer'] || changes['userMessage']) {
      this.updateCurrentMessage();
    }
  }

  editThisMessage(
    textToEdit: string,
    channelId: string,
    messageId: string = ''
  ) {
    this.editMessage.emit({ textToEdit, channelId, messageId });
    
    if(this.state.isDirectMessage) {
      this.state.editDirectMessage = true;
      this.state.globalEditModul = true;
    } else {
      this.state.globalEdit = true;
      this.state.globalEditModul = true;
    }
  }

  async ngOnInit() {
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
    this.state.isThreadOpen = false;
    // this.chat.currentMessageId = userMessage.threadId;
    // await this.chat.getAnswersFromMessage();
    this.state.isThreadOpen = true;
    this.state.responsiveChat = false;
    this.userService.setThreadMessage(userMessage); // Nachricht setzen
    this.updateCurrentMessage();
  }

  // Methode zum Aktualisieren der Reaktionen in Firestore
  async updateReactionsInFirestore() {
    const channelId = this.currentChannel()!.chanId;
    const messageId = this.userMessage!.messageId!;

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
    await this.userService.showProfileUserSingle(userId);
    this.dialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  increaseCounter(emoji: string | undefined) {
    if (!emoji) return; // Exit if emoji is undefined.

    const currentUser = this.fb.currentUser(); // Get current user.
    // Find the existing reaction object (current emoji the user reacted to).
    const existingEmoji = this.userMessage?.reactions.find((e) =>
      e.users.some((user) => user.uId === currentUser!.uId)
    );

    if (existingEmoji) {
      // Remove user from the existing emoji's users list.
      existingEmoji.users = existingEmoji.users.filter(
        (user) => user.uId !== currentUser!.uId
      );
      existingEmoji.count--;

      // If no users are left, remove the reaction completely.
      if (existingEmoji.count === 0) {
        this.userMessage!.reactions = this.userMessage!.reactions.filter(
          (e) => e !== existingEmoji
        );
      }
    }

    // Add reaction to the new emoji (if it's different from the current one).
    const newEmoji = this.userMessage?.reactions.find(
      (e) => e.symbol === emoji
    );

    if (newEmoji) {
      newEmoji.count++;
      newEmoji.users.push({
        userName: currentUser!.displayName,
        uId: currentUser!.uId,
      });
    } else {
      this.userMessage?.reactions.push({
        symbol: emoji,
        count: 1,
        users: [{ userName: currentUser!.displayName, uId: currentUser!.uId }],
      });
    }
  }

  getUsersForEmoji(emoji: string | undefined) {
    const currentUser = this.fb.currentUser(); // Get current user.
    // Filtern der Reaktionen, um nur die Benutzer des angegebenen Emojis zu erhalten
    const usersForEmoji = this.userMessage!.reactions.filter(
      (e) => e.symbol === emoji
    ) // Filtern nach dem Emoji
      .flatMap((e) => e.users); // Benutzer aus der gefundenen Reaktion extrahieren

    const allUsers = usersForEmoji.map((user) => user.userName);
    const currentUserEmoji = allUsers.includes(currentUser?.displayName);

    if (currentUserEmoji && allUsers.length === 1) {
      return 'Du hast reagiert';
    } else if (currentUserEmoji && allUsers.length > 1) {
      return 'Du und andere Personen haben reagiert';
    } else {
      return `${allUsers[0]} hat reagiert`;
    }
  }

  openDialogWithImage(image: string | undefined) {
    if (!image) {
      return;
    }
    this.state.messageImage = image;
    this.dialog.open(ShowImageComponent, {
      panelClass: 'image-container',
    });
  }

  showEmojiWindow(index: number) {
    this.state.scrollToBottomGlobal = false;
    this.isEmojiPickerVisibleMessage[index] =
      !this.isEmojiPickerVisibleMessage[index];
  }

  showEditCloud() {
    this.showCloud = !this.showCloud;
  }
}
