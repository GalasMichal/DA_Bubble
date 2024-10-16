import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatDialogContent, AvatarComponent ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  readonly dialog = inject(MatDialogRef <UserProfileComponent>)

  closeUserProfile() {
    this.dialog.close()
  }

}
