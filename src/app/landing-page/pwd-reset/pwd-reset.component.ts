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
import { FooterComponent } from '../footer/footer.component';
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
    FooterComponent,
    BackComponent
  ],
  templateUrl: './pwd-reset.component.html',
  styleUrl: './pwd-reset.component.scss',
})
export class PwdResetComponent {
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  readonly dialogAddMembers = inject(MatDialog);
  stateControl = inject(StateControlService)
  router = inject(Router);
  isPasswordTopVisible:boolean = false;
  isPasswordBottomVisible: boolean = false;

  resetForm: FormGroup;

  isFormValid: boolean = false;

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
        ])
      },
      { validators: this.passwordMatchValidator } // Validator als Referenz übergeben, ohne Klammern
    );
  }
  
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password1 = formGroup.get('password1')?.value;
    const password2 = formGroup.get('password2')?.value;
  
    // Return null if passwords match, otherwise return error object
    return password1 === password2 ? null : { passwordMismatch: true };
  }

  onSubmit(text: string) {
    this.isFormValid = true;
    this.stateControl.showToast = true
    this.stateControl.showToastText = text
    this.stateControl.removeShowToast()
    setTimeout(() => {
      this.router.navigate(['start']);
      }, 2200);
  }

  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent, {
      panelClass: 'info-container', // Custom class for profile dialog
    });
  }

  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  togglePasswordVisibilityBottom() {
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;
  }
}
