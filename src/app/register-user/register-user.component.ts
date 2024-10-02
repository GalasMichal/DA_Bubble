import { CommonModule } from '@angular/common';
import { Component, effect, inject, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { InfoBoxComponent } from './info-box/info-box.component';
import { FirebaseService } from '../services/firebase/firebase.service';
import { LoginComponent } from '../login/login.component';
import { LogoComponent } from "../shared/logo/logo.component";
import { BackComponent } from '../shared/component/back/back.component';




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
    InfoBoxComponent,
    LoginComponent,
    LogoComponent,
    BackComponent
],

  templateUrl: './register-user.component.html',
  styleUrls: [
    './register-user.component.scss',
    './register-user.component.media.scss',
  ]
})

export class RegisterUserComponent {


  readonly dialogAddMembers = inject(MatDialog);
  readonly router = inject(Router)
  public fb = inject(FirebaseService)

  myForm: FormGroup; // name - just for now
  isFormSubmitted:boolean = false;


  constructor() {
 
    // const upper_req = '(?=.*[A-Z])';
    // const special_char_req = '(?=.*[!@#$%^&*()])';
    // const lower_req = '(?=.*[a-z])';
    // const number_req = '(?=.*[0-9])';
    this.myForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
        // checks if name contains only letters
        Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl('',[
        Validators.required,
        Validators.email]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@\$!%+\-/\*\?&])[A-Za-z0-9@$!%+\-/\*\?&]+$'),
      ]),
      term: new FormControl(false, [
        Validators.requiredTrue // Checkbox must be checked (i.e., true) to be valid
      ])
    })

  }

  async onSubmit() {
    this.isFormSubmitted = true;

    if (this.myForm.valid) {
      const email = this.myForm.get('email')?.value;  // Hole den Email-Wert
      const password = this.myForm.get('password')?.value;
      const displayName = this.myForm.get('name')?.value;

      try {
        const user = await this.fb.createUser(email, password, displayName);
        if (user) {
          console.log('User successfully registered:', user);
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

  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent);
  }

  isPasswordVisible = false;
  
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  

    /*
  age-validator - IF NEEDED
  function ageValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value !== null && control.value < 18) {
      return { 'ageInvalid': true };
    }
    return null;
  }
  this.myForm = new FormGroup({
    age: new FormControl('', [ageValidator])
  });
  */


}
