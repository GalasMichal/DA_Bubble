import { Component, Input } from '@angular/core';
import { MessageFieldComponent } from '../message-field/message-field.component';
import { SearchComponent } from '../../search/search.component';

@Component({
  selector: 'app-message-new',
  standalone: true,
  imports: [MessageFieldComponent, SearchComponent],
  templateUrl: './message-new.component.html',
  styleUrl: './message-new.component.scss'
})
export class MessageNewComponent {
  @Input() placeholderText: string = '';
}
