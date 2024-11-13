import { Component, ElementRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.media.scss'],
  imports: [
     CommonModule,
    //  LogoComponent,
     ReactiveFormsModule,
     FormsModule,
     RouterModule,
     RouterLink,
    // FooterComponent,
  ],
})
export class LoginComponent {
  fb = inject(FirebaseService);
  private router = inject(Router);
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
    this.stateControl.isUserLoggedIn = true;
  }

  async loginWithEmailAndPassword(text: string) {
      this.isFormSubmitted = true;
      const email = this.loginForm.get('userEmail')?.value;
      const password = this.loginForm.get('password')?.value;

    console.log('user data:', email, password);

    if (this.loginForm.valid) {
      this.stateControl.showToast = true;
      this.stateControl.showToastText = text;
      await this.fb.loginWithEmailAndPassword(email, password, text).then(() => {
        console.log(
          'user is eingeloggot',
          this.fb.currentUser()?.uId,
          'user ist:',
          this.fb.currentUser()?.displayName
        );
        this.fb.loadAllBackendData();
        this.stateControl.isUserLoggedIn = true;
      });
    } else {
      console.log('Formular ist ungültig');
    }
  }

  navigateToMainContent() {
    this.fb.loadAllBackendData();
    this.stateControl.isUserLoggedIn = true;
    this.router.navigateByUrl('start/main');
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
