import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './login.component.media.scss'
  ]
})
export class LoginComponent {

}
