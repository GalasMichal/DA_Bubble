import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})

export class ChatRoomComponent {
  usersInChat = ['assets/media/icons/profile-icons/user-1-elise.svg', 'assets/media/icons/profile-icons/user-2-elias.svg', 'assets/media/icons/profile-icons/user-4-steffen.svg'];


}
