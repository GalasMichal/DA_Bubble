import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoBoxComponent } from '../info-box/info-box.component';
import { CommonModule } from '@angular/common';
import { BackComponent } from '../../shared/component/back/back.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-pwd-reset',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    BackComponent,
  ],
  templateUrl: './pwd-reset.component.html',
  styleUrl: './pwd-reset.component.scss',
})
export class PwdResetComponent {
  /**
   * Inject the services needed for the component
   */
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  readonly dialogAddMembers = inject(MatDialog);
  stateControl = inject(StateControlService);
  router = inject(Router);

  /**
   * Create the form group for the password reset form
   */
  isPasswordTopVisible: boolean = false;
  isPasswordBottomVisible: boolean = false;

  resetForm: FormGroup;

  isFormValid: boolean = false;

  /**
   * Constructor initializes the form group
   */
  constructor() {
    this.resetForm = new FormGroup(
      {
        password1: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
          ),
        ]),
        password2: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
          ),
        ]),
      },
      { validators: this.passwordMatchValidator } // Validator als Referenz übergeben, ohne Klammern
    );
  }

  /**
   * password match validator
   * @param control control to validate
   * @returns return null if passwords match, otherwise return error object
   */
  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password1 = formGroup.get('password1')?.value;
    const password2 = formGroup.get('password2')?.value;
    return password1 === password2 ? null : { passwordMismatch: true };
  }

  /**
   *  password reset
   * @param text The text to send in the email
   */
  pwdReset(text: string) {
    const password = this.resetForm.get('password1')?.value;
    this.fb.confirmPassword(password, text);
    this.isFormValid = true;
  }

  /**
   * Open the info box which contains the password requirements
   */
  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent, {
      panelClass: 'info-container', // Custom class for profile dialog
    });
  }

  /**
   * Toggle the visibility of the password
   */
  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  /**
   * Toggle the visibility of the password
   */
  togglePasswordVisibilityBottom() {
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;
  }
}
