import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';


@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, LogoComponent],
  templateUrl: './imprint.component.html',
  styleUrls: [
    './imprint.component.scss',
    './imprint.component.media.scss'
  ]
})
export class ImprintComponent {

}
