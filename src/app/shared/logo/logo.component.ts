import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
    stateServer = inject(StateControlService);  

    showMenu() {      
      if(this.stateServer.isThreadOpen) {
        this.stateServer.responsiveChat = true;
        this.stateServer.isThreadOpen = false;
      } else {
        this.stateServer.responsiveArrow = false;
        this.stateServer.responsiveMenu = false;
        this.stateServer.responsiveChat = false;
      }
    }
}
