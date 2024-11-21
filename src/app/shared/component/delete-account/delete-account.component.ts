import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BackComponent } from '../back/back.component';
import { CloseComponent } from "../close/close.component";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CloseComponent
],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
  fb = inject(FirebaseService);
  stateControl = inject(StateControlService)
  formBuilder = inject(FormBuilder);
  isPasswordTopVisible:boolean = false;

  deleteForm: FormGroup;

  isFormValid: boolean = false;

  constructor(public dialogRef: MatDialogRef<DeleteAccountComponent>) {
    this.deleteForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
        ]),
      },
    );
  }
  
  confirmPasswort(text: string) {
    const password = this.deleteForm.get('password')?.value 
    this.isFormValid = true;
    this.dialogRef.close(password)
  }
  
  closeDeleteAccount() {
    this.dialogRef.close()
  }

  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }

}
