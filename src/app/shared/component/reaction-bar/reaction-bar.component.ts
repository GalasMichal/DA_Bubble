import { Component, ElementRef, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { MessageEditComponent } from '../message-edit/message-edit.component';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [MessageEditComponent, CommonModule, EmojiComponent, PickerComponent],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {
  state = inject(StateControlService)
  showCloud:boolean = false 
  newEmoji: string = "";

  @Input() index: number = 0;
  @Output() emojiSelected = new EventEmitter<string>();
  isEmojiPickerVisibleMessage: boolean[] = [false];

  addEmoji(event: any) {
    // Das ausgewählte Emoji wird in der aktuellen Komponente in newEmoji gespeichert
    this.newEmoji = `${this.newEmoji}${event.emoji.native}`; 

    // Das ausgewählte Emoji wird an die Elternkomponente weitergeleitet
    const emoji = event.emoji.native; // Nimm an, dass das Emoji im "native"-Feld ist
    this.emojiSelected.emit(emoji);  // Emitiere das Emoji an die Elternkomponente
  }
 
 
  showEmojiWindow(index: number) {    
    this.isEmojiPickerVisibleMessage[index] = !this.isEmojiPickerVisibleMessage[index]
  }

  confirmMessage() {
    console.log('confirmMessage()', this.index);
  }

  handsUp() {
    console.log('handsUp()', this.index);
  }


  sendPrivateMessage(){
    console.log('sendPrivateMessage()', this.index);
  }

  showEditCloud() {
      this.showCloud = !this.showCloud
  }
}
