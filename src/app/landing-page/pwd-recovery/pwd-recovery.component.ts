import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { BackComponent } from '../../shared/component/back/back.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { AccSuccessComponent } from '../../shared/component/acc-success/acc-success.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-pwd-recovery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    BackComponent,
    LogoComponent,
    AccSuccessComponent
  ],
  templateUrl: './pwd-recovery.component.html',
  styleUrl: './pwd-recovery.component.scss',
})
export class PwdRecoveryComponent {
  readonly location = inject(Location);
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  stateControl = inject(StateControlService)
  // FormGroup für die Anmeldeform
  recoveryForm: FormGroup;
  isFormValid: boolean = false;

  constructor() {
    // this.recoveryForm = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.email]],
    // });

    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit(text: string) {
    this.isFormValid = true;
    this.stateControl.showSuccess = true
    this.stateControl.showSuccessText = text
    this.stateControl.removeShowSuccess()
  }

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
