import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { InfoBoxComponent } from '../info-box/info-box.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { BackComponent } from '../../shared/component/back/back.component';
import { User } from '../../models/interfaces/user.model';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    ReactiveFormsModule,
    MatDialogModule,
    BackComponent,
  ],

  templateUrl: './register-user.component.html',
  styleUrls: [
    './register-user.component.scss',
    './register-user.component.media.scss',
  ],
})
export class RegisterUserComponent {
  /**
   * Inject the MatDialog service to open the info box dialog
   * Inject the Router service to navigate to the avatar selection page
   * Inject the FirebaseService to create a new user
   */
  readonly dialogAddMembers = inject(MatDialog);
  readonly router = inject(Router);
  public fb = inject(FirebaseService);

  /**
   * Create a new FormGroup with the following form controls:
   */
  myForm: FormGroup; // name - just for now
  isFormSubmitted: boolean = false;
  isPasswordTopVisible: boolean = false;
  isPasswordBottomVisible: boolean = false;

  /**
   * Constructor to initialize the form group with the following form controls:
   * - name: FormControl with validators for required, minLength, and pattern
   *  - required: The name field is required
   *  - minLength: The name field must have at least 3 characters
   *  - pattern: The name field must match the pattern '^[a-zA-Z]+ [a-zA-Z]+( [a-zA-Z]+)*$'
   */
  constructor() {
    this.myForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+( [a-zA-Z]+)*$'),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password1: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
          ),
        ]),
        password2: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
          ),
        ]),
        term: new FormControl(false, [
          Validators.requiredTrue, // Checkbox must be checked (i.e., true) to be valid
        ]),
      },
      { validators: this.passwordMatchValidator } // Validator als Referenz übergeben, ohne Klammern
    );
  }

  /**
   * Method to submit the form data
   * - Set the isFormSubmitted flag to true
   * - Check if the form is valid
   * - If the form is valid, extract the email, password, and displayName from the form
   * - Call the createUser method from the FirebaseService with the email, password, and displayName
   * - If the user is successfully created, update the current user in the FirebaseService
   * - Navigate to the avatar selection page
   */
  async onSubmit() {
    this.isFormSubmitted = true;

    if (this.myForm.valid) {
      const email = this.myForm.get('email')?.value; // Hole den Email-Wert
      const password = this.myForm.get('password1')?.value;
      const displayName = this.myForm.get('name')?.value;

      try {
        const user: User = await this.fb.createUser(
          email,
          password,
          displayName
        );

        if (user) {
          console.log('User successfully registered:', user);
          this.fb.currentUser.update(() => user);
          this.router.navigate(['avatar']); // Navigation nach der Registrierung
        }
      } catch (error) {
        // Hier kannst du eine spezifische Fehlerbehandlung vornehmen
        console.error('Error during user registration:', error);
      }
    } else {
      console.log('Form is invalid, go home! .. or else ..');
    }
  }

  /**
   * Method to open the info box dialog when the user clicks on the info icon
   * containing the information about the password requirements
   */
  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent, {
      panelClass: 'info-container', // Custom class for profile dialog
    });
  }

  /**
   *
   * @param control control to validate the password
   * @returns null if passwords match, otherwise return error object
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
   * Method to toggle the visibility of the password in the password input field
   */
  togglePasswordVisibilityTop(event: Event) {
    event.preventDefault();
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  /**
   * Method to toggle the visibility of the password in the password input field
   */
  togglePasswordVisibilityBottom(event: Event) {
    event.preventDefault();
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;
  }
}
