import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-edit',
  standalone: true,
  imports: [],
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.scss'
})
export class MessageEditComponent {
  @Input() index: number = 0;

  @Input() editText: string = "";
  @Input() messageId: string = "";
  @Output() edit = new EventEmitter<{ textToEdit: string; messageId: string }>();

  
  editThisMessage(textToEdit: string, messageId: string) {
    this.edit.emit({ textToEdit, messageId})    
  }
}
