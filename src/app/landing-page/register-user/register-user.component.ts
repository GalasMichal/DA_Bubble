import { CommonModule } from '@angular/common';
import { Component, effect, inject, Inject } from '@angular/core';
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
import { LoginComponent } from '../login/login.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { BackComponent } from '../../shared/component/back/back.component';
import { FooterComponent } from '../footer/footer.component';
import { User } from '../../models/interfaces/user.model';
import { StateControlService } from '../../services/state-control/state-control.service';

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
  readonly dialogAddMembers = inject(MatDialog);
  readonly router = inject(Router);
  public fb = inject(FirebaseService);

  myForm: FormGroup; // name - just for now
  isFormSubmitted: boolean = false;
  isPasswordTopVisible: boolean = false;
  isPasswordBottomVisible: boolean = false;

  constructor() {
    this.myForm = new FormGroup({
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
          this.router.navigate(['/start/avatar']); // Navigation nach der Registrierung
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
    this.dialogAddMembers.open(InfoBoxComponent, {
      panelClass: 'info-container', // Custom class for profile dialog
    });
  }


  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password1 = formGroup.get('password1')?.value;
    const password2 = formGroup.get('password2')?.value;
  
    // Return null if passwords match, otherwise return error object
    return password1 === password2 ? null : { passwordMismatch: true };
  }

  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  togglePasswordVisibilityBottom() {
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;

  }
}
