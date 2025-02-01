import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './landing-page/footer/footer.component';
import { HeaderLandingComponent } from './landing-page/header-landing/header-landing.component';
import { StateControlService } from './services/state-control/state-control.service';
import { ToastComponent } from './shared/component/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ReactiveFormsModule,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dabubble';
  stateControl = inject(StateControlService)
}
