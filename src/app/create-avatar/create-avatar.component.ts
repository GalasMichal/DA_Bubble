
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { CommonModule } from '@angular/common';

interface ProfileAvatar {
  name: string;
  src: string;
}

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

  baseSrc = "../../../assets/media/icons/profile-icons/";
  
  profileAvatars: ProfileAvatar[] = [
    { name: "user-1-elise" },
    { name: "user-2-elias" },
    { name: "user-3-frederick" },
    { name: "user-4-steffen" },
    { name: "user-5-sofia" },
    { name: "user-6-noah" }
  ].map(avatar => ({
    ...avatar,
    src: `${this.baseSrc}${avatar.name}.svg`
  }));
}
