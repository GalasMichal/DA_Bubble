
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { InfoBoxComponent } from './info-box/info-box.component';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    RouterLink,
    ReactiveFormsModule,
    MatDialogModule,
    InfoBoxComponent
],
  templateUrl: './register-user.component.html',
  styleUrls: [
    './register-user.component.scss',
    './register-user.component.media.scss',
  ]
})

export class RegisterUserComponent {

  readonly dialogAddMembers = inject(MatDialog);
  readonly router = inject(Router);

  myForm: FormGroup; // name - just for now
  isFormSubmitted:boolean = false;

  constructor() {

    // const upper_req = '(?=.*[A-Z])';
    // const special_char_req = '(?=.*[!@#$%^&*()])';
    // const lower_req = '(?=.*[a-z])';
    // const number_req = '(?=.*[0-9])';
  
    this.myForm = new FormGroup({
      name: new FormControl('',[
        Validators.required, 
        Validators.minLength(4), 
        // checks if name contains only letters
        Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl('',[
        Validators.required, 
        Validators.email]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@\$!%+\-/\*\?&])[A-Za-z0-9@$!%+\-/\*\?&]+$'),
      ]),
      terms: new FormControl(false, [
        // checks, if checkbox is checked - default is set to not-checked
        Validators.requiredTrue
      ]),
    })
  }

  onSubmit() {
    // needed - requirement-check
    this.isFormSubmitted = true;
    
    if (this.myForm.valid) {
      // TODO: später auskommentieren !
      console.log('current (valid) form is: ', this.myForm.value);
      this.router.navigate(['avatar']);
    } else {
      // TODO: was zu tun?
      console.log('Form is invalid, go home! .. or else ..');
    }
  }

  openInfoBox() {
    this.dialogAddMembers.open(InfoBoxComponent);
  }

    /*
  age-validator - IF NEEDED
  function ageValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value !== null && control.value < 18) {
      return { 'ageInvalid': true }; 
    }
    return null;
  }
  this.myForm = new FormGroup({
    age: new FormControl('', [ageValidator])
  });
  */

  
}
