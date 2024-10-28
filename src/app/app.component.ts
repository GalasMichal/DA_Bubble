import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MainContentComponent } from './main-content/main-content/main-content.component';
import { LoginComponent } from './landing-page/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './landing-page/footer/footer.component';
import { HeaderLandingComponent } from './landing-page/header-landing/header-landing.component';
import { StateControlService } from './services/state-control/state-control.service';
import { ToastComponent } from './shared/component/acc-success/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MainContentComponent,
    LoginComponent,
    HeaderComponent,
    ReactiveFormsModule,
    FooterComponent,
    HeaderLandingComponent,
    ToastComponent
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dabubble';
  stateControl = inject(StateControlService)
}
