import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { BackComponent } from '../../shared/component/back/back.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { ToastComponent } from '../../shared/component/toast/toast.component';
import { CloseComponent } from '../../shared/component/close/close.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateAvatarComponent } from '../create-avatar/create-avatar.component';

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
    ToastComponent,
    CloseComponent,
  ],
  templateUrl: './pwd-recovery.component.html',
  styleUrl: './pwd-recovery.component.scss',
})
export class PwdRecoveryComponent {
  dialog = inject(MatDialogRef<CreateAvatarComponent>, { optional: true });
  dialogRef = inject(MatDialog);

  readonly location = inject(Location);
  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  stateControl = inject(StateControlService);
  // FormGroup für die Anmeldeform
  recoveryForm: FormGroup;
  isFormValid: boolean = false;
  router = inject(Router);

  constructor() {
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  sendEmail(event: Event, text: string) {
    event.preventDefault();
    const email = this.recoveryForm.get('email')?.value;
    this.fb.sendEmailToUser(email, text);
    this.isFormValid = true;
    this.stateControl.isUserLoggedIn = false;
    this.dialogRef.closeAll();
    this.router.navigate(['/start/confirmation']);
  }

  closePwdRecovery(event: Event) {
    event.preventDefault();
    if (this.dialog) {
      this.dialog.close();
    }
  }
}
