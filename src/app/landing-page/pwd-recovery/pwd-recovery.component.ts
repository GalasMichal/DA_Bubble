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
import { StateControlService } from '../../services/state-control/state-control.service';
import { ToastComponent } from '../../shared/component/toast/toast.component';

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
    ToastComponent
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
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  sendEmail(event: Event, text: string) {
    event.preventDefault();

    const email = this.recoveryForm.get("email")?.value
    console.log(email);
    
    this.fb.resetEmail(email)
    this.isFormValid = true;
    this.stateControl.showArrow = true
    this.stateControl.showToast = true
    this.stateControl.showToastText = text
    this.stateControl.removeShowToast()
  }


  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
