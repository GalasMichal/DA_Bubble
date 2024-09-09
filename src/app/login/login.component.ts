import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './login.component.media.scss'
  ]
})
export class LoginComponent {

}
