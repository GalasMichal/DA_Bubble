import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-menu-side-left',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './menu-side-left.component.html',
  styleUrl: './menu-side-left.component.scss'
})
export class MenuSideLeftComponent {
  
}
