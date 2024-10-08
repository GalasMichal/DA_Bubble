import { Component, inject } from '@angular/core';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';
import { MessageAnswerComponent } from '../../shared/component/message-answer/message-answer.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChannelEditComponent } from '../../shared/component/channel-edit/channel-edit.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../models/interfaces/channel.model';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    AddUsersComponent,
    MessageFieldComponent,
    MessageAnswerComponent,
    EmojiComponent,
    ChannelEditComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent {
  usersInChat = [
    'assets/media/icons/profile-icons/user-1-elise.svg',
    'assets/media/icons/profile-icons/user-2-elias.svg',
    'assets/media/icons/profile-icons/user-4-steffen.svg',
  ];
  dialog = inject(MatDialog);
  channelData: Channel | null = null;
  chat = inject(ChatRoomService);
  route = inject(ActivatedRoute);
  unsubscribe: any;

  ngOnInit(): void {
    // Hole die ID aus den Routenparametern
    // const channelId = this.route.snapshot.paramMap.get('channelId');
    this.channelData = this.chat.currentChannelData;
    // if (channelId) {
    //   // Rufe die Funktion auf, um den Kanal zu öffnen
    //   this.chat.openChatById(channelId);
    //   this.channelData = this.chat.currentChannelData;
    //   console.log(this.channelData);
    // }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe(); // Unsubscribe bei der Zerstörung
    }
  }

  openAddUsers() {
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container', // Custom class for profile dialog
    });
  }

  openTeam() {
    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    })
  }



  allUserMessages = [
    {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
    {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
    {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
    {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
    {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
    },
  ];
}
