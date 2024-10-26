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
import { AccSuccessComponent } from './shared/component/acc-success/acc-success.component';
import { StateControlService } from './services/state-control/state-control.service';

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
    AccSuccessComponent
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dabubble';
  stateControl = inject(StateControlService)
}
