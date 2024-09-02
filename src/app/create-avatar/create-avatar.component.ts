import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, LogoComponent],
  templateUrl: './create-avatar.component.html',
  styleUrls: [
    './create-avatar.component.scss',
    './create-avatar.component.media.scss'
  ]
})

export class CreateAvatarComponent {

}
