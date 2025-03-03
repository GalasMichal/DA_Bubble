import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CommonModule, Location } from '@angular/common';

import { BackComponent } from '../../shared/component/back/back.component';

import { StateControlService } from '../../services/state-control/state-control.service';

import { CloseComponent } from '../../shared/component/close/close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateAvatarComponent } from '../create-avatar/create-avatar.component';

@Component({
  selector: 'app-pwd-recovery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    BackComponent,
    CloseComponent,
  ],
  templateUrl: './pwd-recovery.component.html',
  styleUrl: './pwd-recovery.component.scss',
})
export class PwdRecoveryComponent {
  /**
   * Inject the services needed for the component
   */
  dialog = inject(MatDialogRef<CreateAvatarComponent>, { optional: true });
  dialogRef = inject(MatDialog);
  router = inject(Router);
  readonly location = inject(Location);
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  stateControl = inject(StateControlService);
  /**
   * Create the form group for the password recovery form
   */
  recoveryForm: FormGroup;
  isFormValid: boolean = false;

  /**
   * Constructor initializes the form group
   */
  constructor() {
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**
   * Send an email to the user with the password recovery link
   * @param event The event that triggered the function
   * @param text The text to send in the email
   */
  sendEmail(event: Event, text: string) {
    event.preventDefault();
    const email = this.recoveryForm.get('email')?.value;
    this.fb.sendEmailToUser(email, text);
    this.isFormValid = true;
    this.stateControl.isUserLoggedIn = false;
    this.dialogRef.closeAll();
    this.router.navigate(['confirmation']);
  }

  /**
   *
   * @param event The event that triggered the function
   * Close the password recovery dialog
   */
  closePwdRecovery(event: Event) {
    event.preventDefault();
    if (this.dialog) {
      this.dialog.close();
    }
  }
}
