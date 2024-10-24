import { Component } from '@angular/core';
import { LogoComponent } from '../../shared/logo/logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-landing',
  standalone: true,
  imports: [LogoComponent, RouterLink],
  templateUrl: './header-landing.component.html',
  styleUrl: './header-landing.component.scss'
})
export class HeaderLandingComponent {

}
