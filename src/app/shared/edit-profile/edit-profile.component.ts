import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '../avatar/avatar.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { doc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { UserServiceService } from '../../services/user-service/user-service.service';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    AvatarComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  readonly dialog = inject(MatDialogRef<EditProfileComponent>);
  fb = inject(FirebaseService);
  firestore = inject(Firestore);
  user = inject(UserServiceService);
  userForm: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      userName: new FormControl(this.fb.currentUser()?.displayName, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z0-9.-][A-Za-z0-9 .-]*$')
      ]),
      userEmail: new FormControl(this.fb.currentUser()?.email, [Validators.required, Validators.email]),
    });
  }

  closeDialogEdit() {
    this.dialog.close();
  }

  saveDialogEdit() {
    const uId = this.fb.currentUser()?.uId;
    let newNameNewEmail;
    let inputNameValue = this.userForm.get('userName')?.value;
    let inputEmailValue = this.userForm.get('userEmail')?.value;

    if (uId) {
      newNameNewEmail = doc(this.firestore, 'users', uId);
    }

    if (newNameNewEmail) {

      updateDoc(newNameNewEmail, {
        displayName: inputNameValue,
        email: inputEmailValue,
      });

      this.user.updateCurrentUser(this.fb.currentUser()!);
      this.user.updateCurrentUserToFirebase(inputNameValue, inputEmailValue);
    }

    this.closeDialogEdit();
  }


}
