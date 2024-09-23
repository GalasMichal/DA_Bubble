
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, LogoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login.component.media.scss'],
})
export class LoginComponent {
  fb = inject(FirebaseService);

  createNewUserWithGoogle() {
    console.log('button clicked');
    return this.fb.createGoogleUser();
  }
}
