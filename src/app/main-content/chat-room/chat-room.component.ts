import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild, AfterViewChecked,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';
import { MessageAnswerComponent } from '../../shared/message-answer/message-answer.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../shared/component/dialog-global/dialog-global.component';
import { ShowUsersComponent } from '../../shared/show-users/show-users.component';
import { MessageService } from '../../services/messages/message.service';
import { Channel } from '../../models/interfaces/channel.model';
import { LoaderComponent } from '../../shared/component/loader/loader.component';

@Component({
    selector: 'app-chat-room',
    imports: [
        MessageFieldComponent,
        MessageAnswerComponent,
        CommonModule,
        AvatarComponent,
    ],
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  allUserMessages: Message[] = [];
  channelData: Channel | null = null;
  sumRestOfUser = 0;
  counter = 0;

    // Variable to edit a message
  textArea = ''; // Verbunden mit dem textarea
  channelId = '';
  textAreaId = '';
  textAreaEdited = false;

  @ViewChild('scrollToBottom') scrollToBottom?: ElementRef;
  /**
   * Inject the MatDialog service to open the user dialog
   * Inject the ChatRoomService to access the current channel and messages
   * Inject the MessageService to access the messages
   * Inject the ActivatedRoute to access the current route
   * Inject the Router to navigate to different routes
   * Inject the StateControlService to access the global state
   * Inject the UserServiceService to access the user list
   * Inject the FirebaseService to access the current user
   * Inject the MatDialog service to open the confirm dialog
   */
  userDialog = inject(MatDialog);
  dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  ms = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  stateControl = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  dialogConfirm = inject(MatDialog);

  currentChannel = computed(() => this.chat.currentChannelSignal());
  currentMessage = computed(() => this.chat.messages());

  private readonly destroy$ = new Subject<void>();

  /**
   * Kanal aus der URL — bei jedem Wechsel ( dieselbe Komponente ) neu laden, Listener tauschen.
   */
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(async (params) => {
      const id = params.get('id') || '';
      if (!id) return;
      this.channelId = id;
      const channel = this.chat.channels().find((c) => c.chanId === id);
      if (channel) {
        await this.chat.setCurrentChannel(channel);
      } else {
        await this.chat.loadCurrentChannelAfterRefresh(id);
        await this.chat.subscribeToFirestoreMessages(id);
      }
    });
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chat.unsubscribeAll();
  }

  isVisible = false;

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
   * Scrolls to the bottom of the chat window when the view is initialized
   */
  onScroll() {
    this.stateControl.scrollToBottomGlobal = false;
    if (this.scrollToBottom?.nativeElement) {
      const container = this.scrollToBottom.nativeElement;
      const scrollPosition = container.scrollTop;
      const containerHeight = container.scrollHeight - container.clientHeight;
      this.isVisible = containerHeight - scrollPosition > 300;
    }
  }

  /**
   * Scrolls to the bottom of the chat window when the button is clicked
   */
  scrollToBottomButton() {
    if (this.scrollToBottom?.nativeElement) {
      this.scrollToBottom.nativeElement.scrollTop =
        this.scrollToBottom.nativeElement.scrollHeight;
    }
  }

  /**
   *
   * @param event - The event object that contains the text to edit, the channel ID, and the message ID
   */
  onTextUpdate(event: {
    textToEdit: string;
    channelId: string;
    messageId: string;
  }) {
    this.textArea = event.textToEdit;
    this.channelId = event.channelId;
    this.textAreaId = event.messageId;
    this.textAreaEdited = false;

    setTimeout(() => {
      this.textAreaEdited = true;
    });
  }

  /**
   *  Closes the edit dialog
   */
  closeChannelEdit() {
    this.dialogConfirm.closeAll();
  }

  /**
   *  Opens the edit dialog
   */
  onOpenAddUsers() {
    const isDisabled =
      this.chat.currentChannelSignal()?.createdBy[0].uId !==
      this.fb.currentUser()?.uId;
    this.counter++;

    if (isDisabled) {
      this.onCounter();
    } else {
      this.openAddUsers();
    }
  }

  /**
   * avoids the opening of the dialog when the counter is less than 2
   */
  onCounter() {
    if (this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  /**
   * Opens the dialog
   */
  showDialog(): void {
    this.dialog.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  /**
   * Opens the dialog to add users to the channel
   */
  openAddUsers() {
    this.stateControl.createChannelActiveInput = true;
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container',
    });
  }

  /**
   *  Opens the dialog to show all users in the channel
   */
  openShowUsers(): void {
    this.dialog.open(ShowUsersComponent, {
      panelClass: 'show-users-container',
    });
  }

  /**
   *  shows the number of users in the channel
   * @returns
   */
  restOfUser(): number {
    return this.currentChannel()!.specificPeople.length - 3;
  }

  /**
   *  Opens the dialog to edit the channel
   * @param chat - The chat object that contains the channel ID
   */
  openTeam(chat: object) {
    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    });
  }

  /**
   * Opens a dialog displaying the full profile of a user.
   *
   * @param userId - The unique identifier of the user whose profile will be displayed.
   */
  async openDialogProfile(userId: string) {
    await this.userService.openProfileUserSingle(userId);
  }

  /**
   * Filters and returns a list of users who are specifically chosen in the current channel.
   *
   * This function retrieves the list of user IDs from the current channel's `specificPeople` array
   * and filters the `userService.userList` to include only users whose IDs match.
   * You receive arra with obejct from users.
   * @returns {Array} An array of user objects that are part of the selected users in the channel.
   */
  filterAllUsersInChannel() {
    const showAllChoosenUsers = this.currentChannel()?.specificPeople; // Array of user IDs
    const allUsers = this.userService.userList; // Array of User objects

    const filteredUsers = allUsers.filter((user) =>
      showAllChoosenUsers?.includes(user.uId)
    );
    return filteredUsers;
  }
}
