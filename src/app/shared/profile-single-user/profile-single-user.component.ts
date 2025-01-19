import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { MessageService } from '../../services/messages/message.service';
import { Router } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';
import { User } from '../../models/interfaces/user.model';
import { MessageImageComponent } from '../message-answer/message-image/message-image.component';

@Component({
  selector: 'app-profile-single-user',
  standalone: true,
  imports: [],
  templateUrl: './profile-single-user.component.html',
  styleUrl: './profile-single-user.component.scss',
})
export class ProfileSingleUserComponent {
  readonly dialog = inject(MatDialogRef<ProfileSingleUserComponent>);
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService);
  ms = inject(MessageService);
  router = inject(Router);
  stateControl = inject(StateControlService);
  dialogImage = inject(MatDialog);

  closeUserProfile() {
    this.dialog.close();
  }

  async openMessage(user: User) {
    this.stateControl.isThreadOpen = false;
    this.userService.messageReceiver = user;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;

    // Prüfen, ob ein privater Chat bereits existiert
    const existingChatId = await this.ms.checkPrivateChatExists(user.uId);
    console.log('chatID', existingChatId);

    if (existingChatId) {
      // Wenn der Chat existiert, zur spezifischen Nachricht navigieren
      this.router.navigate(['/start/main/messages', existingChatId]);
      this.ms.loadMessagesFromChat(existingChatId);
    } else {
      this.router.navigate(['/start/main/messages']);
    }
    this.closeUserProfile();
  }

  openDialogWithImage(image: string | undefined) {
    this.stateControl.messageImage = image;
    this.dialogImage.open(MessageImageComponent, {
      panelClass: 'image-container',
    });
  }
}
