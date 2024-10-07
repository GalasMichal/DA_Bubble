import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { LogoComponent } from "../shared/logo/logo.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    LogoComponent,
    LoginComponent,
    LogoComponent
],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  readonly location = inject(Location);

  constructor() {}

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
