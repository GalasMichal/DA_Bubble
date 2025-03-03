import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { BackComponent } from '../../shared/component/back/back.component';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, BackComponent],
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss', './legal.component.media.scss'],
})
export class LegalComponent {
  readonly location = inject(Location);

  constructor() {}
  /**
   * Go back to the previous page
   */
  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
