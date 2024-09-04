import { Component, inject } from '@angular/core';
import {
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogContent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  readonly dialog = inject(MatDialogRef <EditProfileComponent>)

  closeDialogEdit() {
    this.dialog.close()
  }

  saveDialogEdit() {
    this.closeDialogEdit()
  }

}
