import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../material/material.module';


@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, RouterLink, MaterialModule],
  templateUrl: './register-user.component.html',
  styleUrls: [
    './register-user.component.scss',
    './register-user.component.media.scss',
  ]
})
export class RegisterUserComponent {

}
