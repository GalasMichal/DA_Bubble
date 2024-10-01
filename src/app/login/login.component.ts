import { Component, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase/firebase.service';
import { LogoComponent } from "../shared/logo/logo.component";
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.media.scss'],
  imports: [CommonModule, LogoComponent, RouterModule,ReactiveFormsModule, FormsModule, RouterModule, RouterOutlet, RouterLink],

})
export class LoginComponent {
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  private router = inject(Router);

  // FormGroup für die Anmeldeform
  loginForm: FormGroup;
  isFormSubmitted:boolean = false;



  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@\$!%+\-/\*\?&])[A-Za-z0-9@$!%+\-/\*\?&]+$'),
      ]),
    });
  }

  createNewUserWithGoogle() {
    console.log('Google Anmeldung gestartet');
    return this.fb.createGoogleUser();
  }

  loginWithEmailAndPassword() {
    this.isFormSubmitted = true;
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if (this.loginForm.valid) {
        this.fb.loginWithEmailAndPassword(email, password).then(() => {
          // Weiterleitung nach erfolgreicher Anmeldung
          this.router.navigate(['/avatar']);
    })} else {
      console.log('Formular ist ungültig');
    }
  }

  isPasswordVisible = false;
  
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}

