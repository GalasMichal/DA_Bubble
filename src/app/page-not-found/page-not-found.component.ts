import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { LogoComponent } from "../shared/logo/logo.component";

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

}
