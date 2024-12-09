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
  @Output() edit = new EventEmitter<string>();

  
  editThisMessage(newMessage: string) {
    this.edit.emit(newMessage)
  }
}
