import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss'
})
export class ChannelCreateComponent {

}
