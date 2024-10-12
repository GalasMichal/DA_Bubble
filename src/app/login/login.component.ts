import { Component, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase/firebase.service';
import { LogoComponent } from "../shared/logo/logo.component";
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinkFooterComponent } from '../shared/component/link-footer/link-footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.media.scss'],
  imports: [CommonModule, LogoComponent, RouterModule,ReactiveFormsModule, FormsModule, RouterModule, RouterOutlet, RouterLink, LinkFooterComponent],

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

  async createNewUserWithGoogle() {
    await this.fb.createGoogleUser();
    this.fb.loadAllBackendData()
  }

 async loginWithEmailAndPassword() {
    this.isFormSubmitted = true;
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if (this.loginForm.valid) {
       await this.fb.loginWithEmailAndPassword(email, password).then(() => {
        console.log('user is eingeloggot', this.fb.currentUser()?.uId, 'user ist:', this.fb.currentUser()?.displayName)
        this.fb.loadAllBackendData()
    })} else {
      console.log('Formular ist ungültig');
    }
  }

  isPasswordVisible = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
