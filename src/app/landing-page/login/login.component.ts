import { Component, ElementRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import {
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateControlService } from '../../services/state-control/state-control.service';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
     CommonModule,
     ReactiveFormsModule,
     FormsModule,
     RouterModule,
     RouterLink,
  ],
})
export class LoginComponent {
  fb = inject(FirebaseService);
  stateControl = inject(StateControlService);

  // FormGroup für die Anmeldeform
  loginForm: FormGroup;
  isFormSubmitted: boolean = false;
  isPasswordVisible = false;

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

  async createNewUserWithGoogle() {
    await this.fb.createGoogleUser();
    this.fb.loadAllBackendData();
  }

  async loginWithEmailAndPassword(text: string) {
      this.isFormSubmitted = true;
      const email = this.loginForm.get('userEmail')?.value;
      const password = this.loginForm.get('password')?.value;

    if (this.loginForm.valid) {
      await this.fb.loginWithEmailAndPassword(email, password, text).then(() => {
        this.fb.loadAllBackendData();
      });
    } else {
      console.log('Formular ist ungültig');
    }
  }

  navigateToMainContentAsGuest(event: Event, text: string) {
    event.preventDefault()
    this.fb.signInAsGuest(text)
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
