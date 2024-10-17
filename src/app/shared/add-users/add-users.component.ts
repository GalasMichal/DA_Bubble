import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import { InputAddUsersComponent } from '../component/input-add-users/input-add-users.component';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [MatDialogContent, AvatarComponent, InputAddUsersComponent],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})
export class AddUsersComponent {
  readonly dialog = inject(MatDialogRef <AddUsersComponent>)
  activeButton: boolean = false

  closeAddUsers() {
    this.dialog.close()
  }
  onButtonChanged(value: boolean) {
    this.activeButton = value;
  }
}
