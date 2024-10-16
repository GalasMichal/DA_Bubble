import { Component, inject } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { CloseComponent } from '../close/close.component';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent, CloseComponent],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss'
})
export class InputAddUsersComponent {
  userService = inject(UserServiceService)
  choosenUser:string[] = []

  addUser(user: string) {
    this.choosenUser.push(user)
    console.log(this.choosenUser);
  }
}

