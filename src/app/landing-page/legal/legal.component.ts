import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { BackComponent } from '../../shared/component/back/back.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    LogoComponent,
    BackComponent,
    FooterComponent,
  ],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss', './legal.component.media.scss'],
})
export class LegalComponent {
  readonly location = inject(Location);

  constructor() {}

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
