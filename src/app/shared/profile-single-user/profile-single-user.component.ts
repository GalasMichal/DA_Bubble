import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { MessageService } from '../../services/messages/message.service';
import { Router } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';
import { User } from '../../models/interfaces/user.model';
import { ShowImageComponent } from '../component/show-image/show-image.component';

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

  /**
   * Closes the user profile dialog.
   */
  closeUserProfile() {
    this.dialogImage.closeAll();
  }

  /**
   * Opens a direct message with the given user.
   * @param user The user to open a direct message with.
   */
  async openMessage(user: User) {
    this.stateControl.isThreadOpen = false;
    this.userService.messageReceiver = user;
    this.stateControl.responsiveChat = true;
    this.stateControl.responsiveArrow = true;
    this.stateControl.responsiveMenu = true;
    const existingChatId = await this.ms.checkPrivateChatExists(user.uId);

    if (existingChatId) {
      this.router.navigate(['main/messages', existingChatId]);
      this.ms.loadMessagesFromChat(existingChatId);
    } else {
      this.router.navigate(['main/messages']);
    }
    this.closeUserProfile();
  }

  /**
   * Opens a dialog displaying the given image.
   * If the image URL is undefined, the dialog is not opened.
   * @param image - The URL of the image to display.
   */
  openDialogWithImage(image: string | undefined) {
    this.stateControl.messageImage = image;
    this.dialogImage.open(ShowImageComponent, {
      panelClass: 'image-container',
    });
  }
}
