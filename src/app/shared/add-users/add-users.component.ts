import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})
export class AddUsersComponent {
  readonly dialog = inject(MatDialogRef <AddUsersComponent>)

  closeAddUsers() {
    this.dialog.close()
  }
}
