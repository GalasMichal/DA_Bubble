import { Component } from '@angular/core';
import { CloseComponent } from '../close/close.component';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss'
})
export class ChannelEditComponent {

}
