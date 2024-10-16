import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-edit',
  standalone: true,
  imports: [],
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.scss'
})
export class MessageEditComponent {
  @Input() index: number = 0;
  
  editThisMessage() {
    console.log('editThisMessage()', this.index);
  }
}
