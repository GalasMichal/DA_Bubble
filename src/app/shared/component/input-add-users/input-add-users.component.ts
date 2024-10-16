import { Component, inject } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { UserServiceService } from '../../../services/user-service/user-service.service';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss'
})
export class InputAddUsersComponent {
  userService = inject(UserServiceService)
  choosenUser:string[] = []

  addUser() {
    console.log(this.userService);
    
  }

}

