import { Component, Input } from '@angular/core';
import { MessageEditComponent } from '../message-edit/message-edit.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [MessageEditComponent, CommonModule ],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {
  showCloud:boolean = false 
  @Input() index: number = 0;

  confirmMessage() {
    console.log('confirmMessage()', this.index);
    
  }

  handsUp() {
    console.log('handsUp()', this.index);
  }

  addEmoji() {
   console.log('addEmoji()', this.index);
  }

  sendPrivateMessage(){
    console.log('sendPrivateMessage()', this.index);
  }

  showEditCloud() {
      this.showCloud = !this.showCloud
  }
}
