import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BackComponent } from '../back/back.component';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    BackComponent
  ],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  fb = inject(FirebaseService);
  stateControl = inject(StateControlService)

  formBuilder = inject(FormBuilder);
  readonly dialogAddMembers = inject(MatDialog);
  isPasswordTopVisible:boolean = false;
  readonly dialogDeleteAccount = inject(MatDialog);

  resetForm: FormGroup;

  isFormValid: boolean = false;

  constructor() {
    this.resetForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
          ),
        ]),
      },
    );
  }
  
  confirmPasswort(text: string) {
    const password = this.resetForm.get('password')?.value 
    this.isFormValid = true;
    this.stateControl.saveGlobaPassword = password;
    debugger
    this.deleteAccountConfirmPopUp()
  }

  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

  deleteAccountConfirmPopUp() {
    this.dialogDeleteAccount.open(DeleteAccountComponent, {
      panelClass: 'confirm-delete-container', // Custom class for profile dialog
    });
  }
}
