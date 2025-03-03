import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { StateControlService } from '../../services/state-control/state-control.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  stateControl = inject(StateControlService);

  /**
   * Handles the display and hiding of the side menu and
   * the responsive chat thread when the logo is clicked.
   * If the thread is open it will close the thread and
   * open the chat instead. If nothing is open it will
   * close everything. If the chat is open it will close
   * the chat and open the menu.
   */
  showMenu() {
    if (this.stateControl.isThreadOpen) {
      this.stateControl.responsiveChat = true;
      this.stateControl.isThreadOpen = false;
    } else {
      this.stateControl.responsiveArrow = false;
      this.stateControl.responsiveMenu = false;
      this.stateControl.responsiveChat = false;
    }
  }
}
