import { Component, ElementRef, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';
import { MessageAnswerComponent } from '../../shared/message-answer/message-answer.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../models/interfaces/channel.model';
import { Message } from '../../models/interfaces/message.model';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { ProfileSingleUserComponent } from '../../shared/profile-single-user/profile-single-user.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../shared/component/dialog-global/dialog-global.component';
import { ShowUsersComponent } from '../../shared/show-users/show-users.component';

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
  channelId: string = '';
  textAreaEdited: boolean = false;

  @ViewChild('scrollToBottom') scrollToBottom?: ElementRef;

  dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  route = inject(ActivatedRoute);
  stateControl = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);

  ngOnInit(): void {
    this.loadSpecificPeopleFromChannel();
  }

  ngOnDestroy(): void {
    this.chat.unsubscribeAll?.();
  }

  async loadSpecificPeopleFromChannel(): Promise<void> {
    await this.chat.loadSpecificPeopleFromChannel();
  }

  onTextUpdate(event: { textToEdit: string; channelId: string; messageId: string }): void {
    this.textArea = event.textToEdit;
    this.channelId = event.channelId;
    this.textAreaId = event.messageId;
    this.textAreaEdited = false;

    setTimeout(() => {
      this.textAreaEdited = true;
    });
    this.stateControl.globalEdit = true;
  }

  closeChannelEdit(): void {
    this.dialog.closeAll();
  }

  onOpenAddUsers(): void {
    const isDisabled = this.chat.currentChannelData?.createdBy[0]?.uId !== this.fb.currentUser()?.uId;
    this.counter++;

    if (isDisabled) {
      this.handleCounter();
    } else {
      this.openAddUsers();
    }
  }

  handleCounter(): void {
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

  openAddUsers(): void {
    this.stateControl.createChannelActiveInput = true;
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container',
    });
  }

  openShowUsers(): void {
    this.dialog.open(ShowUsersComponent, {
      panelClass: 'show-users-container',
    });
    this.showAllChosenUsers();
  }

  restOfUser(): number {
    return this.chat.currentUserChannelsSpecificPeopleObject.length - 3;
  }

  openTeam(): void {
    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    });
  }

  async openProfileUserSingle(userId: string): Promise<void> {
    await this.userService.showProfileUserSingle(userId);
    this.dialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  showAllChosenUsers(): void {
    this.stateControl.choosenUser = [];
    this.stateControl.choosenUserFirebase = [];

    if (this.chat.currentChannelData) {
      const listOfAllChosenUsers = this.chat.currentUserChannelsSpecificPeopleObject;
      listOfAllChosenUsers.forEach((user) => {
        if (user.uId !== this.chat.currentChannelData?.createdBy[0]?.uId) {
          this.stateControl.choosenUser.push(user);
          this.stateControl.choosenUserFirebase.push(user.uId);
        }
      });
    }
  }
}
