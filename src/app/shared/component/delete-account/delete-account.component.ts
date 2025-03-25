import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CloseComponent } from '../close/close.component';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CloseComponent,
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
})
export class DeleteAccountComponent {
  fb = inject(FirebaseService);
  stateControl = inject(StateControlService);
  formBuilder = inject(FormBuilder);
  isPasswordTopVisible: boolean = false;
  dialogRef = inject (MatDialogRef<DeleteAccountComponent>)
  deleteForm: FormGroup;

  isFormValid: boolean = false;

  /**
   * Creates a new instance of the DeleteAccountComponent.
   * @param dialogRef Reference to the MatDialogRef of type DeleteAccountComponent
   */
  constructor() {
    this.deleteForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Confirms the deletion of the account with the given password.
   * @param text The text to display in the toast message.
   */
  confirmPasswort(text: string) {
    const password = this.deleteForm.get('password')?.value;
    this.isFormValid = true;
    this.dialogRef.close(password);
  }

  /**
   * Closes the delete account dialog without deleting the account.
   */
  closeDeleteAccount(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  /**
   * Toggles the visibility of the password input field.
   * If the password is currently visible, it will be hidden, and vice versa.
   */
  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }
}
