
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { CommonModule } from '@angular/common';

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
  profileAvatars: string[] = [
    "user-1-elise",
    "user-2-elias",
    "user-3-frederick",
    "user-4-steffen",
    "user-5-sofia",
    "user-6-noah"
  ];
}
