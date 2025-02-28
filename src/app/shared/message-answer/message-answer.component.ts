import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
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
import { MessageService } from '../../services/messages/message.service';

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
  ms = inject(MessageService);
  showCloud: boolean = false;
  isEmojiPickerVisibleMessage: boolean[] = [false];
  newEmoji: string = '';

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

  /**
   * Adds the selected emoji to the component's state and notifies the parent component.
   * Updates the `newEmoji` property with the selected emoji.
   * Emits the selected emoji to the parent component by calling `onEmojiSelected`.
   *
   * @param event - The event object containing the selected emoji, expected in the `native` field.
   */
  addEmoji(event: any) {
    this.state.scrollToBottomGlobal = false;
    this.newEmoji = `${this.newEmoji}${event.emoji.native}`;
    const emoji = event.emoji.native;
    this.onEmojiSelected(emoji);
  }

  /**
   * Notifies the parent component about a selected emoji.
   * Calls {@link increaseCounter} to update the emoji count in the component's state.
   * Then calls {@link updateReactionsInFirestore} to update the reactions in Firestore.
   * @param emoji - The selected emoji.
   */
  onEmojiSelected(emoji: string) {
    this.increaseCounter(emoji);
    this.updateReactionsInFirestore();
  }

  /**
   * Lifecycle hook to detect changes of the @Input() properties `answer` and `userMessage`.
   * If either of these properties has changed, the `updateCurrentMessage` method is called to
   * update the local state of the component.
   * @param changes - Object containing the changed input properties with their previous and
   * current values.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Prüfen, ob answer oder userMessage aktualisiert wurde
    if (changes['answer'] || changes['userMessage']) {
      this.updateCurrentMessage();
    }
  }

  /**
   * Sets the provided message as the current message to be edited in the MessageService.
   * Logs the current message to the console for debugging purposes.
   *
   * @param message - The message object to be set for editing.
   */
  editThisMessage(message: Message) {
    this.ms.currentMessageToEdit.set(message);
    console.log(
      'wyslalem wiadomosc do servisu',
      this.ms.currentMessageToEdit()
    );
    this.editstatus();
  }

  editstatus() {
    if(this.state.isDirectMessage) {
      this.state.editDirectMessage = true;
      this.state.globalEditModul = true;
    } else {
      this.state.globalEdit = true;
      this.state.globalEditModul = true;
    }
  }

  /**
   * Initializes the component by updating the current message and determining if the current user is the sender.
   * Calls {@link updateCurrentMessage} to set the current message from inputs.
   * Checks if the current message sender's user ID matches the current user's ID.
   * If they match, sets the `meUser` flag to true, indicating the message was sent by the current user.
   */
  async ngOnInit() {
    this.updateCurrentMessage();
    if (this.currentMessage?.messageSendBy.uId === this.fb.currentUser()?.uId) {
      this.meUser = true;
    }
  }

  /**
   * Updates the current message by prioritizing the answer over the user message, if the answer is available.
   * If the answer is not available, the user message is used instead.
   */
  updateCurrentMessage() {
    this.currentMessage = this.answer || this.userMessage;
  }

  /**
   * Opens the thread of the provided message and updates the component state accordingly.
   * Resets the state flags `isThreadOpen` and `responsiveChat` to false and true, respectively.
   * Sets the provided message as the current thread message using the UserService.
   * Calls {@link updateCurrentMessage} to update the local message state.
   * @param userMessage - The message object to open the thread for.
   */
  async openThread(userMessage: Message) {
    this.state.isThreadOpen = false;
    this.state.isThreadOpen = true;
    this.state.responsiveChat = false;
    this.userService.setThreadMessage(userMessage);
    this.updateCurrentMessage();
  }

  /**
   * Updates the reactions of the current message in the Firestore document.
   * @param none
   * @returns none
   */
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
    await updateDoc(messageDocRef, { reactions: this.userMessage?.reactions });
  }

  /**
   * Opens a dialog displaying the full profile of a user.
   * Retrieves user data from the UserService and then displays the profile
   * using a dialog component.
   * @param userId - The unique identifier of the user whose profile will be displayed.
   */
  async openProfileUserSingle(userId: string) {
    await this.userService.showProfileUserSingle(userId);
    this.dialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  /**
   * Increases the counter of the provided emoji in the user message's reactions.
   * If the emoji is the same as the current one, it removes the user from the existing
   * emoji's users list and decrements the count. If no users are left, it removes the
   * reaction completely.
   * If the emoji is different from the current one, it adds a new reaction with the
   * provided emoji and increments the count.
   * @param emoji - The emoji to increase the counter for.
   */
  increaseCounter(emoji: string | undefined) {
    if (!emoji) return;
    const currentUser = this.fb.currentUser();
    const existingEmoji = this.userMessage?.reactions.find((e) =>
      e.users.some((user) => user.uId === currentUser!.uId)
    );
    if (existingEmoji) {
      existingEmoji.users = existingEmoji.users.filter(
        (user) => user.uId !== currentUser!.uId
      );
      existingEmoji.count--;
      if (existingEmoji.count === 0) {
        this.userMessage!.reactions = this.userMessage!.reactions.filter(
          (e) => e !== existingEmoji
        );
      }
    }
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

  /**
   * Gets the users that have reacted with the given emoji.
   * If the current user is in the list, it returns a string like "Du hast reagiert"
   * or "Du und andere Personen haben reagiert".
   * If the current user is not in the list, it returns a string like "Name hat reagiert"
   * @param emoji - The emoji to get the users for.
   * @returns A string with the users that have reacted with the given emoji.
   */
  getUsersForEmoji(emoji: string | undefined) {
    const currentUser = this.fb.currentUser();
    const usersForEmoji = this.userMessage!.reactions.filter(
      (e) => e.symbol === emoji
    ).flatMap((e) => e.users);

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

  /**
   * Opens a dialog displaying an image.
   * If an image URL is provided, it sets the image in the state and opens a dialog
   * to show the image using the `ShowImageComponent`.
   * @param image - The URL of the image to display. If undefined, the dialog is not opened.
   */
  openDialogWithImage(image: string | undefined) {
    if (!image) {
      return;
    }
    this.state.messageImage = image;
    this.dialog.open(ShowImageComponent, {
      panelClass: 'image-container',
    });
  }

  /**
   * Toggles the visibility of the emoji picker window for a specific index.
   * Sets the global scroll-to-bottom flag to false to prevent automatic scrolling
   * when the emoji picker visibility changes.
   *
   * @param index - The index of the message for which the emoji picker visibility is toggled.
   */
  showEmojiWindow(index: number) {
    this.state.scrollToBottomGlobal = false;
    this.isEmojiPickerVisibleMessage[index] =
      !this.isEmojiPickerVisibleMessage[index];
  }

  /**
   * Toggles the visibility of the cloud of users that are currently in the channel.
   * This cloud is used to display the users that are currently in the channel.
   */
  showEditCloud() {
    this.showCloud = !this.showCloud;
  }
}
