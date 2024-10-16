import { Component } from '@angular/core';
import { MessageFieldComponent } from '../message-field/message-field.component';

@Component({
  selector: 'app-message-new',
  standalone: true,
  imports: [MessageFieldComponent],
  templateUrl: './message-new.component.html',
  styleUrl: './message-new.component.scss'
})
export class MessageNewComponent {

}
