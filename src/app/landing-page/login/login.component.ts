import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
})
export class LoginComponent {
  /**
   * Injects the FirebaseService and StateControlService.
   */
  fb = inject(FirebaseService);
  stateControl = inject(StateControlService);

  /**
   * The login form.
   */
  loginForm: FormGroup;
  isFormSubmitted: boolean = false;
  isPasswordVisible = false;

  /**
   * Initializes the login form.
   */
  constructor() {
    this.loginForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
        ),
      ]),
    });
  }

  /**
   * Creates a new user with Google.
   */
  async createNewUserWithGoogle() {
    await this.fb.createGoogleUser();
    this.fb.loadAllBackendData();
  }

  /**
   * Creates a new user with Email and Password. After the user is created, the backend data is loaded.
   */
  async loginWithEmailAndPassword(text: string) {
    this.isFormSubmitted = true;
    const email = this.loginForm.get('userEmail')?.value;
    const password = this.loginForm.get('password')?.value;

    if (this.loginForm.valid) {
      await this.fb
        .loginWithEmailAndPassword(email, password, text)
        .then(() => {
          this.fb.loadAllBackendData();
        });
    } else {
      console.log('Formular ist ungültig');
    }
  }

  /**
   *
   * @param event means the event that is triggered
   * @param text text to display in the toast message
   */
  navigateToMainContentAsGuest(event: Event, text: string) {
    event.preventDefault();
    this.fb.signInAsGuest(text);
  }

  /**
   * Toggles the password visibility.
   * If the password is visible, it is hidden and vice versa.
   */
  togglePasswordVisibility(event: Event) {
    event.preventDefault()
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
