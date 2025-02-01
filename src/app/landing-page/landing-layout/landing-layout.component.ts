import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLandingComponent } from '../header-landing/header-landing.component';
import { FooterComponent } from '../footer/footer.component';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderLandingComponent, FooterComponent],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss'
})
export class LandingLayoutComponent {
  stateControl = inject(StateControlService)
}
