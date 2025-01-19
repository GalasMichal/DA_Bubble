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
  @Input() channelId: string = ""
  @Input() messageId: string = "";
  @Output() edit = new EventEmitter<{ textToEdit: string; channelId:string; messageId: string }>();

  
  editThisMessage(textToEdit: string, channelId:string, messageId: string) {
    console.log(textToEdit);
    this.edit.emit({ textToEdit, channelId, messageId})    
  }
}
