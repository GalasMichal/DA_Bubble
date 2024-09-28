import { Component, inject } from '@angular/core';
import {
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, MatDialogContent, AvatarComponent, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  readonly dialog = inject(MatDialogRef <EditProfileComponent>)

  userForm: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      userName: new FormControl('',[Validators.required, Validators.minLength(3)]),
      userEmail: new FormControl('',[Validators.required, Validators.email])
    })
  }

  closeDialogEdit() {
    console.log(this.userForm.valid);

    this.dialog.close()
  }

  saveDialogEdit() {
    console.log(this.userForm.value);
    this.userForm.reset();
  }
}
