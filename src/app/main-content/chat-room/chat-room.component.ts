import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
// import { log } from 'console';
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
    AvatarComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent {
  allUserMessages: Message[] = [];

  stateServer = inject(StateControlService);

  usersInChat = [
    'assets/media/icons/profile-icons/user-1-elise.svg',
    'assets/media/icons/profile-icons/user-2-elias.svg',
    'assets/media/icons/profile-icons/user-4-steffen.svg',
  ];
  dialog = inject(MatDialog);
  dialogConfirm = inject(MatDialog);
  readonly userDialog = inject(MatDialog);
  channelData: Channel | null = null;
  chat = inject(ChatRoomService);
  route = inject(ActivatedRoute);
  stateControl = inject(StateControlService)
  userService = inject(UserServiceService);
  fb = inject(FirebaseService);
  sumrestOfUser: number = 0;
  counter: number = 0;
  
  textArea: string = ""; // Variable, die mit dem textarea verbunden ist
  textAreaId: string = "";
  channelId: string = "";
  textAreaEdited: boolean = false;
  @ViewChild('scrollToBottom') scrollToBottom?: ElementRef;
    

  ngAfterViewChecked(): void {
    if (this.scrollToBottom?.nativeElement) {
      this.scrollToBottom.nativeElement.scrollTop = 
        this.scrollToBottom.nativeElement.scrollHeight;
    }
  }
    
  onTextUpdate(event: { textToEdit: string, channelId:string, messageId: string }) {
    this.textArea = event.textToEdit; // Aktualisiere die Variable, wenn Änderungen eintreffen
    this.channelId = event.channelId;
    this.textAreaId = event.messageId;
    this.textAreaEdited = false;
    
    setTimeout(() => {
    this.textAreaEdited = true;
    },);
    this.stateServer.globalEdit = true
  }


  closeChannelEdit() {
    this.dialogConfirm.closeAll()
  }

  onOpenAddUsers() {
    const isDisabled = this.chat.currentChannelData.createdBy[0].uId !== this.fb.currentUser()?.uId
    this.counter++;

    if (isDisabled) {
      this.onCounter()
    } else {
      this.openAddUsers();
    }
  }
  

  onCounter() {
    if(this.counter >= 2) {
      this.showDialog();
      this.counter = 0;
    }
  }

  showDialog() {
    this.dialogConfirm.open(DialogGlobalComponent, {
      panelClass: 'dialog-global-container',
    });
  }

  ngOnDestroy(): void {

  this.chat.unsubscribeAll?.();

  }

  openAddUsers() {
    this.stateServer.createChannelActiveInput = true
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container', // Custom class for profile dialog
    });
  }

  openShowUsres() {
    // this.stateServer.createChannelActiveInput = true
    this.dialog.open(ShowUsersComponent, {
      panelClass: 'show-users-container', // Custom class for profile dialog
    });

    this.showAllChoosenUsers()
  }

  restOfUser() {
    return this.chat.currentUserChannelsSpecificPeopleObject.length - 3;
  }

  openTeam(chat: Object) {
    const currentChannelID = this.chat.currentChannel
    // console.log('ID', currentChannelID);

    const currentChannelName = this.chat.currentChannelData
    // console.log('Name', currentChannelName);

    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    });
  }

  showId(id: object) {
    // console.log('ThreatID:', id);
  }

  async openProfileUserSingle(userId: string) {
    await this.userService.showProfileUserSingle(userId)
    this.userDialog.open(ProfileSingleUserComponent, {
      panelClass: 'profile-single-user-container',
    });
  }

  showAllChoosenUsers() {
    this.stateServer.choosenUser = [];
    this.stateServer.choosenUserFirbase = []

    if (this.chat.currentChannelData !== undefined){
      const listOfAllChoosenUsers= this.chat.currentUserChannelsSpecificPeopleObject;
      for (let i = 0; i < listOfAllChoosenUsers.length; i++) {
        const object = listOfAllChoosenUsers[i];
        if (object.uId !== this.chat.currentChannelData.createdBy[0].uId) {
          this.stateServer.choosenUser.push(object)
          this.stateServer.choosenUserFirbase.push(object.uId);
        }

      }
    }
  }
}
