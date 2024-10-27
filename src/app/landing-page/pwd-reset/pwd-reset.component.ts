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
    this.resetForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%+-/*?&])[A-Za-z0-9@$!%+-/*?&]+$'
        ),
      ]),
    });
  }

  onSubmit(text: string) {
    this.isFormValid = true;
    this.stateControl.showSuccess = true
    this.stateControl.showSuccessText = text
    this.stateControl.removeShowSuccess()
    setTimeout(() => {
      this.router.navigate(['start']);
      }, 2200);
  }

  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent);
  }


  togglePasswordVisibilityTop() {
    this.isPasswordTopVisible = !this.isPasswordTopVisible;
  }


  togglePasswordVisibilityBottom() {
    this.isPasswordBottomVisible = !this.isPasswordBottomVisible;
  }
}
