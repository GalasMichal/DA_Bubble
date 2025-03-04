import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MessageFieldComponent } from '../component/message-field/message-field.component';
import { MessageAnswerComponent } from '../message-answer/message-answer.component';
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
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

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
  stateControl = inject(StateControlService);
  readonly userDialog = inject(MatDialog);
  messages: Message[] = [];
  currentChatId: string = '';
  private auth = inject(Auth);

  @ViewChild('scrollToBottom') scrollToBottom?: ElementRef;

  textArea: string = '';
  channelId: string = '';
  textAreaId: string = '';
  textAreaEdited: boolean = false;

    /**
   * Scrolls to the bottom of the chat window when the view is checked
   */
    ngAfterViewChecked(): void {  
      if (this.stateControl.scrollToBottomGlobal) {
        if (this.scrollToBottom?.nativeElement) {
          this.scrollToBottom.nativeElement.scrollTop =
            this.scrollToBottom.nativeElement.scrollHeight;
        }
      }
    }

  /**
   * Loads the current message after a refresh of the page.
   * The method listens for changes in the user's authentication state.
   * If the user is authenticated, the method will get the user by their uid and load the current message.
   * If the user is not authenticated, the method will navigate to the home page.
   */
  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.fb.getUserByUid(user.uid);
        this.loadCurrentMessageAfterRefresh();
      }
    });
  }

  /**
   * Opens a dialog displaying the full profile of a user.
   *
   * @param userId - The unique identifier of the user whose profile will be displayed.
   */
  async openProfileUserSingle(userId: string) {
    await this.userService.showProfileUserSingle(userId);
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.chat.messages.set([]);
    this.ms.unsubscribeMessages?.();
  }
  /**
   * Loads the current message after a page refresh by retrieving the chat ID from the route parameters.
   * If a valid chat ID is found, it checks whether a private chat exists for this ID.
   * If the chat exists, it loads the message receiver from the local database and navigates to the chat.
   * If not, it navigates to the main messages page and logs a warning.
   * Handles errors that occur during the process by logging them to the console.
   */
  async loadCurrentMessageAfterRefresh(): Promise<void> {
    this.route.paramMap.subscribe((params) => {
      this.currentChatId = params.get('id') || '';
    });
    if (!this.currentChatId) {
      return;
    }
    try {
      const existingChatId = await this.ms.checkPrivateChatExists(
        this.currentChatId
      );
      if (!existingChatId) {
        await this.ms.loadMessageReceiverFromIndexDB();
        this.router.navigate(['main/messages']);
        return;
      }
      await this.ms.loadMessageReceiverFromIndexDB();
      this.router.navigate(['main/messages', this.currentChatId]);
      await this.ms.loadMessagesFromChat(this.currentChatId);
    } catch (error) {}
  }
}
