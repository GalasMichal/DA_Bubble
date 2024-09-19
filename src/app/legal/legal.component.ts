
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../shared/logo/logo.component';


@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [RouterModule, RouterLink, LogoComponent],
  templateUrl: './legal.component.html',
  styleUrls: [
    './legal.component.scss',
    './legal.component.media.scss'
  ]
})
export class LegalComponent {

}
