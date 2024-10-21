import { Component, inject, input, Input } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { User } from '../../models/interfaces/user.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  db = inject(FirebaseService);
  @Input() userList: boolean = false;
  @Input() user: User = {
    uId: '',
    email: '',
    status: false,
    displayName: '',
    channels: [],
    avatarUrl: '',
  };



}
