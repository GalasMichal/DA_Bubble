
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';


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

  readonly location = inject(Location);

  constructor() {}

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}

