import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './login.component.media.scss'
  ]
})
export class LoginComponent {

}
