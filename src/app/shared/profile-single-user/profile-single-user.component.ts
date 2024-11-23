import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../services/user-service/user-service.service';


@Component({
  selector: 'app-profile-single-user',
  standalone: true,
  imports: [MatDialogContent, AvatarComponent],
  templateUrl: './profile-single-user.component.html',
  styleUrl: './profile-single-user.component.scss'
})
export class ProfileSingleUserComponent {
  readonly dialog = inject(MatDialogRef<ProfileSingleUserComponent>);
  chat = inject(ChatRoomService);
  userService = inject(UserServiceService)


  closeUserProfile() {
    this.dialog.close();
  }
}
