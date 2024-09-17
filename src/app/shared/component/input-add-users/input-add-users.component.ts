import { Component } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';

@Component({
  selector: 'app-input-add-users',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './input-add-users.component.html',
  styleUrl: './input-add-users.component.scss'
})
export class InputAddUsersComponent {

}
