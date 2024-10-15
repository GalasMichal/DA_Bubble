
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase/firebase.service';
import { BackComponent } from '../shared/component/back/back.component';
import { FooterComponent } from "../shared/component/footer/footer.component";

interface ProfileAvatar {
  name: string;
  src: string;
}

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, LogoComponent, BackComponent, FooterComponent],
  templateUrl: './create-avatar.component.html',
  styleUrls: [
    './create-avatar.component.scss',
    './create-avatar.component.media.scss'
  ]
})

export class CreateAvatarComponent {
  db = inject(FirebaseService);
   selectedAvatar: string = 'profile-icon'

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

  chooseAvatar(avatarName: string) {
    this.selectedAvatar = avatarName;
  }
}
