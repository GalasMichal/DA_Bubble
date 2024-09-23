
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoBoxComponent } from '../../register-user/info-box/info-box.component';

@Component({
  selector: 'app-pwd-reset',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pwd-reset.component.html',
  styleUrl: './pwd-reset.component.scss'
})
export class PwdResetComponent {

  fb = inject(FirebaseService);
  formBuilder = inject(FormBuilder);
  readonly dialogAddMembers = inject(MatDialog);

  resetForm: FormGroup;

  isFormValid: boolean = false;

  constructor() {

    this.resetForm = new FormGroup({
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@\$!%+\-/\*\?&])[A-Za-z0-9@$!%+\-/\*\?&]+$'),
      ]),
    })

  }

  onSubmit() {
    this.isFormValid = true;
  }

  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent);
  }
}
