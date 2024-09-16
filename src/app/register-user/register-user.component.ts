import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { InfoBoxComponent } from './info-box/info-box.component';


@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    RouterLink, 
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './register-user.component.html',
  styleUrls: [
    './register-user.component.scss',
    './register-user.component.media.scss',
  ]
})

export class RegisterUserComponent {
  
  // public router = Inject(Router);
  // public dialog = Inject(MatDialog);
  /* 
  In Angular, the @Inject decorator is used to inject a token into a component or service. However, you are using it to assign a value to a property.
  */

  myForm: FormGroup; // name - just for now
  isFormSubmitted:boolean = false;

  constructor(private dialog: MatDialog, public router: Router) {

    // const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%+-/*?&])[A-Za-z\\d@$!%*?&]$';
  
    this.myForm = new FormGroup({
      name: new FormControl('',[
        Validators.required, 
        Validators.minLength(4), 
        Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl('',[
        Validators.required, 
        Validators.email]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*+\\-/*?&])[A-Za-z\\d@$!%*+\\-/*?&]{8,}$')
      ]),
      terms: new FormControl(false, [
        Validators.requiredTrue
      ]),
    })
    

    /*
    IMPORTANTE
      -> pwd - reg-ex:
        at least one uppercase letter,
        at least one lowercase letter,
        at least one number,
        at least one special character,
        a minimum length of 8 characters.
      -> anti-sql - reg-ex:
        no ' or " or ;   // to be checked - may be edited
    */

  }

  onSubmit() {
    // werden später gelöscht - 
    // console.log('Submit button clicked.');
    // const isFormValid = this.myForm.valid;
    // console.log('form is valid: ',isFormValid);
    // debugger;
    
    // console.log('Form Status:', this.myForm.status);
    // console.log('Password Control Status:', this.myForm.controls['password'].status);
    // console.log('Password Control Errors:', this.myForm.controls['password'].errors);
    
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
    this.dialog.open(InfoBoxComponent);
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
