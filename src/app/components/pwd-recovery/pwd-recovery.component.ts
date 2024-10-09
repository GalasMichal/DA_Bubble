
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwd-recovery',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pwd-recovery.component.html',
  styleUrl: './pwd-recovery.component.scss'
})
export class PwdRecoveryComponent {

  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);

  // FormGroup für die Anmeldeform
  recoveryForm: FormGroup;

  isFormValid: boolean = false;

  constructor() {
    // this.recoveryForm = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.email]],
    // });

    this.recoveryForm = new FormGroup({
      email: new FormControl('',[
        Validators.required,
        Validators.email]),
    })
  }

  onSubmit() {
    this.isFormValid = true;
  }
}

