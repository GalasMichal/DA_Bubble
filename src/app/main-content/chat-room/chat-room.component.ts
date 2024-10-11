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
import { Message } from '../../models/interfaces/message.model';
import { Subscription } from 'rxjs';
import { MessageNewComponent } from '../../shared/component/message-new/message-new.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    AddUsersComponent,
    MessageFieldComponent,
    MessageAnswerComponent,
    EmojiComponent,
    ChannelEditComponent,
    MessageNewComponent,
    CommonModule
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent {
  allUserMessages: Message[] = [];
  private messageSub: Subscription | undefined;

  usersInChat = [
    'assets/media/icons/profile-icons/user-1-elise.svg',
    'assets/media/icons/profile-icons/user-2-elias.svg',
    'assets/media/icons/profile-icons/user-4-steffen.svg',
  ];
  dialog = inject(MatDialog);
  channelData: Channel | null = null;
  chat = inject(ChatRoomService);
  route = inject(ActivatedRoute);

  ngOnInit() {

  }
  constructor  () {

  }

  ngOnDestroy(): void {
    if (this.chat.unsubscribe) {
      this.chat.unsubscribe(); // Unsubscribe bei der Zerstörung
    }
    if (this.messageSub) {
      this.messageSub.unsubscribe(); // Unsubscribe bei der Zerstörung
    }
    if(this.chat.unsub) { // Unsubscribe bei der Zerstörung
      this.chat.unsub();
    }

    
  }

  openAddUsers() {
    this.dialog.open(AddUsersComponent, {
      panelClass: 'add-users-container', // Custom class for profile dialog
    });
  }

  openTeam(chat: Object) {
    // const currentChannelID = this.chat.currentChannel
    // console.log('ID', currentChannelID);

    // const currentChannelName = this.chat.currentChannelData
    // console.log('Name', currentChannelName);
    

    this.dialog.open(ChannelEditComponent, {
      panelClass: 'team-container',
    })
  }

  showId(id: object) {
    console.log('ThreatID:', id);
    
  }
}
