import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { FirebaseService } from '../../services/firebase/firebase.service';
import { DialogGlobalComponent } from '../../shared/component/dialog-global/dialog-global.component';
import { ShowUsersComponent } from '../../shared/show-users/show-users.component';
import { LoaderComponent } from '../../shared/component/loader/loader.component';
import { ProfileSingleUserComponent } from '../../shared/profile-single-user/profile-single-user.component';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    MessageFieldComponent,
    MessageAnswerComponent,
    CommonModule,
    AvatarComponent,
    LoaderComponent,
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

  userDialog = inject(MatDialog);
  dialog = inject(MatDialog);
  chat = inject(ChatRoomService);
  route = inject(ActivatedRoute);
  stateControl = inject(StateControlService);
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  dialogConfirm = inject(MatDialog);

  ngOnInit(): void {
    this.loadSpecificPeopleFromChannel();
  }

  ngOnDestroy(): void {
    this.chat.unsubscribeAll?.();
  }

  async loadSpecificPeopleFromChannel(): Promise<void> {
    await this.chat.loadSpecificPeopleFromChannel();
  }


  isVisible: boolean = false;


  ngAfterViewChecked(): void {
    if (this.stateControl.scrollToBottomGlobal) {
      if (this.scrollToBottom?.nativeElement) {
        this.scrollToBottom.nativeElement.scrollTop =
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
      this.scrollToBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
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
    const isDisabled =
      this.chat.currentChannelData.createdBy[0].uId !==
      this.fb.currentUser()?.uId;
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
    return this.chat.currentUserChannelsSpecificPeopleObject.length - 3;
  }

  openTeam(chat: Object) {
    const currentChannelID = this.chat.currentChannel;
    // console.log('ID', currentChannelID);

    const currentChannelName = this.chat.currentChannelData;
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

    if (this.chat.currentChannelData !== undefined) {
      const listOfAllChoosenUsers =
        this.chat.currentUserChannelsSpecificPeopleObject;
      for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
        const object = listOfAllChoosenUsers[i];
        if (object.uId !== this.chat.currentChannelData.createdBy[0].uId) {
          this.stateControl.choosenUser.push(object);
          this.stateControl.choosenUserFirebase.push(object.uId);
        }
      }
    }
  }
}
