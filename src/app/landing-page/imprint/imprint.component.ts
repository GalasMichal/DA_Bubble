import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { BackComponent } from '../../shared/component/back/back.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, BackComponent],
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
})
export class ImprintComponent {
  readonly location = inject(Location);

  constructor() {}
  /**
   * Navigates to the previous page.
   */
  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
