import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';


@Component({
  selector: 'app-profile-single-user',
  standalone: true,
  imports: [MatDialogContent, AvatarComponent],
  templateUrl: './profile-single-user.component.html',
  styleUrl: './profile-single-user.component.scss'
})
export class ProfileSingleUserComponent {
  readonly dialog = inject(MatDialogRef<ProfileSingleUserComponent>);

  closeUserProfile() {
    this.dialog.close();
  }
}
