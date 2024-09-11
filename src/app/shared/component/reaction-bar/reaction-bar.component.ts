import { Component } from '@angular/core';
import { MessageEditComponent } from '../message-edit/message-edit.component';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [MessageEditComponent],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {

}
