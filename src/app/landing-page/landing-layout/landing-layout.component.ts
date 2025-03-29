import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderLandingComponent } from '../header-landing/header-landing.component';
import { FooterComponent } from '../footer/footer.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { ToastComponent } from '../../shared/component/toast/toast.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, ToastComponent, RouterOutlet, HeaderLandingComponent, FooterComponent, RouterLink],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.scss'
})
export class LandingLayoutComponent {
  stateControl = inject(StateControlService)


  showIntro: boolean = false;

  constructor() {
    const showIntro = JSON.parse(localStorage.getItem("showIntro") || "null");
    if(!showIntro) {
      localStorage.setItem("showIntro", "true");
    } else {
      this.showIntro = showIntro
    }
  }
}
