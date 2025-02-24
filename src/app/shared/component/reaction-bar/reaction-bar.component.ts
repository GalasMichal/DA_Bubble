import { Component, ElementRef, EventEmitter, Inject, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { Message } from '../../../models/interfaces/message.model';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [CommonModule, PickerComponent],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {
  stateControl = inject(StateControlService)
  firestore = inject(Firestore);
  fb = inject(FirebaseService);
  showCloud:boolean = false 
  newEmoji: string = "";

  @Input() index: number = 0;
  @Input() editText: string = "";
  @Input() channelId: string = ""
  @Input() messageId?: string = "";
  @Input() createdById: string = "";


  @Output() editMessage = new EventEmitter<{ textToEdit: string; channelId:string; messageId: string }>();
  @Output() emojiSelected = new EventEmitter<string>();
  isEmojiPickerVisibleMessage: boolean[] = [false];
 
  meUser: boolean = false;
  currentMessage: Message | null = null;
  

  ngOnInit() {
      if (this.createdById === this.fb.currentUser()?.uId) {
        this.meUser = true;
      }
      console.log();
      
  }

  editThisMessage(textToEdit: string, channelId:string, messageId: string = "" ) {
    this.editMessage.emit({textToEdit, channelId, messageId });
      
  }

  addEmoji(event: any) {
    this.stateControl.scrollToBottomGlobal = false;
    // Das ausgewählte Emoji wird in der aktuellen Komponente in newEmoji gespeichert
    this.newEmoji = `${this.newEmoji}${event.emoji.native}`; 

    // Das ausgewählte Emoji wird an die Elternkomponente weitergeleitet
    const emoji = event.emoji.native; // Nimm an, dass das Emoji im "native"-Feld ist
    this.emojiSelected.emit(emoji);  // Emitiere das Emoji an die Elternkomponente
 
  }
 
 
  showEmojiWindow(index: number) { 
    this.stateControl.scrollToBottomGlobal = false;
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
      console.log('TEST')
      this.showCloud = !this.showCloud
  }
}
