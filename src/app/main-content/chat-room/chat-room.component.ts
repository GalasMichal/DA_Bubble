import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';
import { MessageAnswerComponent } from '../../shared/message-answer/message-answer.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../../models/interfaces/message.model';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../shared/component/dialog-global/dialog-global.component';
import { ShowUsersComponent } from '../../shared/show-users/show-users.component';
import { ProfileSingleUserComponent } from '../../shared/profile-single-user/profile-single-user.component';
import { MessageService } from '../../services/messages/message.service';
import { sign } from 'node:crypto';
import { Channel } from '../../models/interfaces/channel.model';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    MessageFieldComponent,
    MessageAnswerComponent,
    CommonModule,
    AvatarComponent,
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  allUserMessages: Message[] = [];
  channelData: Channel | null = null;
  sumRestOfUser: number = 0;
  counter: number = 0;
  textArea: string = ''; // Verbunden mit dem textarea
  textAreaId: string = '';
  textAreaEdited: boolean = false;

  @ViewChild('scrollToBottom') scrollToBottom?: ElementRef;

  userDialog = inject(MatDialog);
  dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  ms = inject(MessageService);
  route = inject(ActivatedRoute);
  stateControl = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  dialogConfirm = inject(MatDialog);
  currentChannel: Signal<Channel | null> = signal<Channel | null>(null);

  currentMessage = computed(() => this.chat.messages());
  channelId: string = '';
  ngOnInit(): void {
    this.channelId = this.route.snapshot.paramMap.get('id') || '';
    this.currentChannel = this.chat.getCurrentChannel();
    this.loadCurrentChannelAfterRefresh();
  }

  ngOnDestroy(): void {
    this.chat.unsubscribeAll?.();
  }

  // async loadSpecificPeopleFromChannel(): Promise<void> {
  //   await this.chat.loadSpecificPeopleFromChannel();
  // }

  loadCurrentChannelAfterRefresh(): void {
    const currentChannel = this.route.snapshot.paramMap.get('id');
    if (currentChannel) {
    }
  }

  isVisible: boolean = false;

  ngAfterViewChecked(): void {
    if (this.stateControl.scrollToBottomGlobal) {
      if (this.scrollToBottom?.nativeElement) {
        this.scrollToBottom.nativeElement.scrollTwileop =
          this.scrollToBottom.nativeElement.scrollHeight;
      }
    }
  }

  onScroll() {
    this.stateControl.scrollToBottomGlobal = false;
    if (this.scrollToBottom?.nativeElement) {
      const container = this.scrollToBottom.nativeElement;
      const scrollPosition = container.scrollTop;
      const containerHeight = container.scrollHeight - container.clientHeight;
      this.isVisible = containerHeight - scrollPosition > 300;
    }
  }

  // Other possibilty to scroll to bottom
  scrollToBottomButton() {
    if (this.scrollToBottom?.nativeElement) {
      this.scrollToBottom.nativeElement.scrollTop =
        this.scrollToBottom.nativeElement.scrollHeight;
    }
  }

  onTextUpdate(event: {
    textToEdit: string;
    channelId: string;
    messageId: string;
  }) {
    this.textArea = event.textToEdit; // Aktualisiere die Variable, wenn Änderungen eintreffen
    this.channelId = event.channelId;
    this.textAreaId = event.messageId;
    this.textAreaEdited = false;

    setTimeout(() => {
      this.textAreaEdited = true;
    });
    this.stateControl.globalEdit = true;
  }

  closeChannelEdit() {
    this.dialogConfirm.closeAll();
  }

  onOpenAddUsers() {
    const isDisabled = this.chat.currentChannelSignal()?.createdBy[0].uId !== this.fb.currentUser()?.uId;
    this.counter++;

    if (isDisabled) {
      this.onCounter();
    } else {
      this.openAddUsers();
    }
  }

  onCounter() {
    if (this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  showDialog(): void {
    this.dialog.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  openAddUsers() {
    this.stateControl.createChannelActiveInput = true;
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container',
    });
  }

  openShowUsers(): void {
    this.dialog.open(ShowUsersComponent, {
      panelClass: 'show-users-container',
    });

    this.showAllChoosenUsers();
  }

  restOfUser(): number {
    return this.currentChannel()!.specificPeople.length - 3;
  }

  openTeam(chat: Object) {
    // const currentChannelID = this.chat.currentChannel;
    // console.log('ID', currentChannelID);

    // const currentChannelName = this.chat.currentChannelData;
    // console.log('Name', currentChannelName);

    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    });
  }

  showId(id: object) {}

  async openProfileUserSingle(userId: string) {
    this.stateControl.scrollToBottomGlobal = false;
    await this.userService.showProfileUserSingle(userId);
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  showAllChoosenUsers(): void {
    this.stateControl.choosenUser = [];
    this.stateControl.choosenUserFirebase = [];
    if (this.userService.userList !== undefined) {
      const listOfAllChoosenUsers = this.userService.userList;
      for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
        const object = listOfAllChoosenUsers[i];
        if (object.uId !== this.currentChannel()!.createdBy[0].uId) {
          this.stateControl.choosenUser.push(object);
          this.stateControl.choosenUserFirebase.push(object.uId);
        }
      }
    }
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
    return filteredUsers
  }
}
