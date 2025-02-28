import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { UserServiceService } from '../../services/user-service/user-service.service';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';

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
  dialogConfirm = inject(MatDialog);
  fb = inject(FirebaseService);
  user = inject(UserServiceService);
  userForm: FormGroup;

  /**
   * Initializes the EditProfileComponent.
   * Sets up the userForm with FormControls for userName and userEmail.
   * The userName FormControl is initialized with the current user's display name
   * and validated to be required, have a minimum length of 3, and match the specified pattern.
   * The userEmail FormControl is initialized with the current user's email and validated to be required and a valid email format.
   */
  constructor() {
    this.userForm = new FormGroup({
      userName: new FormControl(this.fb.currentUser()?.displayName, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z0-9.-][A-Za-z0-9 .-]*$'),
      ]),
      userEmail: new FormControl(this.fb.currentUser()?.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  /**
   * Closes the Edit Profile dialog without saving any changes.
   */
  closeDialogEdit() {
    this.dialog.close();
  }

  /**
   * Updates the current user's display name and email in the Firestore database,
   * and then updates the current user in the Firebase Authentication service.
   * Finally, it fetches the user by their UID and opens a confirmation dialog.
   */
  saveDialogEdit() {
    const uId = this.fb.currentUser()?.uId;
    let newNameNewEmail;
    let inputNameValue = this.userForm.get('userName')?.value;
    let inputEmailValue = this.userForm.get('userEmail')?.value;
    if (uId) {
      newNameNewEmail = doc(this.fb.firestore, 'users', uId);
    }
    if (newNameNewEmail) {
      updateDoc(newNameNewEmail, {
        displayName: inputNameValue,
        email: inputEmailValue,
      });
      this.user.updateCurrentUserToFirebase(inputNameValue, inputEmailValue);
      this.fb.getUserByUid(uId!);
    }
    this.showDialog();
  }

  /**
   * Opens a confirmation dialog indicating that the profile has been successfully edited.
   * This dialog uses a custom panel class for styling.
   */
  showDialog() {
    this.dialogConfirm.open(DialogEditProfileComponent, {
      panelClass: 'dialog-edit-profile-container',
    });
  }
}
