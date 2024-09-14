// import { CommonModule } from '@angular/common';
// import { Component, Inject } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { Router, RouterLink, RouterModule } from '@angular/router';
// import { InfoBoxComponent } from './info-box/info-box.component';



// @Component({
//   selector: 'app-register-user',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     FormsModule, 
//     RouterModule, 
//     RouterLink, 
//     ReactiveFormsModule,
//     MatDialogModule
//   ],
//   templateUrl: './register-user.component.html',
//   styleUrls: [
//     './register-user.component.scss',
//     './register-user.component.media.scss',
//   ]
// })

// export class RegisterUserComponent {
  
//   // public fb = Inject(FormBuilder);
//   // public router = Inject(Router);
//   // public dialog = Inject(MatDialog);

//   myForm: FormGroup; // name - just for now


//   constructor(public fb: FormBuilder, public dialog: MatDialog, public router: Router) {
    
//     /*
//     age-validator - IF NEEDED
//     function ageValidator(control: FormControl): { [key: string]: boolean } | null {
//       if (control.value !== null && control.value < 18) {
//         return { 'ageInvalid': true }; 
//       }
//       return null;
//     }
//     this.myForm = new FormGroup({
//       age: new FormControl('', [ageValidator])
//     });
//     */

//     const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%+-/*?&])[A-Za-z\\d@$!%*?&]{8,}$';
//     const antiSqlPattern = '^[^\'";]*$';
//     const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

//     /*
//     IMPORTANTE
//       -> pwd - reg-ex:
//         at least one uppercase letter,
//         at least one lowercase letter,
//         at least one number,
//         at least one special character,
//         a minimum length of 8 characters.
//       -> anti-sql - reg-ex:
//         no ' or " or ;   // to be checked - may be edited
//     */
   

//     this.myForm = this.fb.group({
//       name: new FormControl('', [
//         Validators.required,
//         Validators.minLength(5),
//         Validators.pattern('^[a-zA-Z ]*$')
//       ]),
//       email: new FormControl('', [
//         Validators.required,
//         Validators.email,
//         // Validators.pattern(emailPattern) // not needed due to intern check..?
//       ]),
//       password: new FormControl('', [
//         Validators.required,
//         Validators.minLength(8), // for this case, norm:18+
//         Validators.pattern(passwordPattern),
//       ]),
//       terms: new FormControl(false, [
//         Validators.requiredTrue // is checkbox marked or not
//       ])
//     });

//     // another way of writing that : (causes problems when more than 1 formGroup)
//     // this.myForm = this.fb.group({ // fb - FormBuilder angular intern shortcut
//     //   name: ['', Validators.required, Validators.minLength(5)],
//     //   email: new FormControl('', [Validators.required, Validators.email]),
//     //   password: ['', [Validators.required, Validators.minLength(8)]],
//     //   terms: [false, Validators.requiredTrue]
//     // });
//   }

//   onSubmit() {
//     console.log('Submit button clicked.');
    
//     // console.log('Form Status:', this.myForm.status);
//     // console.log('Password Control Status:', this.myForm.controls['password'].status);
//     // console.log('Password Control Errors:', this.myForm.controls['password'].errors);
  

//     if (this.myForm.valid) {
//       console.log('current (valid) form is: ', this.myForm.value);
//       this.router.navigate(['avatar']);
//     } else {
//       console.log('Form is invalid, go home! .. or else ..');
//     }
//   }

//   openInfoBox() {
//     this.dialog.open(InfoBoxComponent);
//   }

  
// }
