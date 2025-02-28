import { Component, inject, Input } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { User } from '../../models/interfaces/user.model';
import { UserServiceService } from '../../services/user-service/user-service.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  db = inject(FirebaseService);
  userService = inject(UserServiceService);

  @Input() userList: boolean = false;
  @Input() user: User = {
    uId: '',
    email: '',
    status: false,
    displayName: '',
    channels: [],
    avatarUrl: '',
  };

  @Input() userMessageReceiver: User | undefined = undefined;
}
