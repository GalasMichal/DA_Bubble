
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [RouterLink, RouterModule, LogoComponent],
  templateUrl: './create-avatar.component.html',
  styleUrls: [
    './create-avatar.component.scss',
    './create-avatar.component.media.scss'
  ]
})

export class CreateAvatarComponent {

}
