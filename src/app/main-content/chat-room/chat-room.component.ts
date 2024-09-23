
import { Component, inject } from '@angular/core';
import { AddUsersComponent } from '../../shared/add-users/add-users.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageFieldComponent } from '../../shared/component/message-field/message-field.component';
import { MessageAnswerComponent } from '../../shared/component/message-answer/message-answer.component';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [AddUsersComponent, MessageFieldComponent, MessageAnswerComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})

export class ChatRoomComponent {
  usersInChat = ['assets/media/icons/profile-icons/user-1-elise.svg', 'assets/media/icons/profile-icons/user-2-elias.svg', 'assets/media/icons/profile-icons/user-4-steffen.svg'];
  dialog = inject(MatDialog)

  openAddUsers() {
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container', // Custom class for profile dialog
    });
  }

  allUserMessages = [ 
      {
        userDetails: {
          userName: "User Name",
          timeStamp: "time stamp",
        },
        userMessage: "Welche Version ist aktuell von Angular?",
        profileImage: {
          src: "assets/media/icons/profile-icons/user-6-noah.svg",
          alt: "profile-image",
        },
        messageContent: "Welche Version ist aktuell von Angular?",
        answerDetails: {
          answers: "2 Antworten",
          lastAnswerTimeStamp: "Time stamp from last answer",
        },
      },
      {
        userDetails: {
          userName: "User Name",
          timeStamp: "time stamp",
        },
        userMessage: "Welche Version ist aktuell von Angular?",
        profileImage: {
          src: "assets/media/icons/profile-icons/user-6-noah.svg",
          alt: "profile-image",
        },
        messageContent: "Welche Version ist aktuell von Angular?",
        answerDetails: {
          answers: "2 Antworten",
          lastAnswerTimeStamp: "Time stamp from last answer",
        },
      },
      {
        userDetails: {
          userName: "User Name",
          timeStamp: "time stamp",
        },
        userMessage: "Welche Version ist aktuell von Angular?",
        profileImage: {
          src: "assets/media/icons/profile-icons/user-6-noah.svg",
          alt: "profile-image",
        },
        messageContent: "Welche Version ist aktuell von Angular?",
        answerDetails: {
          answers: "2 Antworten",
          lastAnswerTimeStamp: "Time stamp from last answer",
        },
      },
      {
        userDetails: {
          userName: "User Name",
          timeStamp: "time stamp",
        },
        userMessage: "Welche Version ist aktuell von Angular?",
        profileImage: {
          src: "assets/media/icons/profile-icons/user-6-noah.svg",
          alt: "profile-image",
        },
        messageContent: "Welche Version ist aktuell von Angular?",
        answerDetails: {
          answers: "2 Antworten",
          lastAnswerTimeStamp: "Time stamp from last answer",
        },
      },
      {
        userDetails: {
          userName: "User Name",
          timeStamp: "time stamp",
        },
        userMessage: "Welche Version ist aktuell von Angular?",
        profileImage: {
          src: "assets/media/icons/profile-icons/user-6-noah.svg",
          alt: "profile-image",
        },
        messageContent: "Welche Version ist aktuell von Angular?",
        answerDetails: {
          answers: "2 Antworten",
          lastAnswerTimeStamp: "Time stamp from last answer",
        },
      }
  ];

}
