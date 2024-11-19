import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StateControlService } from '../../services/state-control/state-control.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BackComponent } from '../../shared/component/back/back.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwd-confirm',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    BackComponent
  ],
  templateUrl: './pwd-confirm.component.html',
  styleUrl: './pwd-confirm.component.scss'
})
export class PwdConfirmComponent {
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
      },
    );
  }
  
  pwdReset(text: string) {
    const password = this.resetForm.get('password1')?.value    
    this.fb.confirmPassword(password, text)
    this.isFormValid = true;
  }

  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  togglePasswordVisibilityBottom() {
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;
  }
}
