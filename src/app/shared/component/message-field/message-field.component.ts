
import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { StateControlService } from '../../../services/state-control/state-control.service';

@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [FormsModule, HeaderComponent, PickerComponent, CommonModule, EmojiComponent],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss'
})
export class MessageFieldComponent {

  textArea: string = "";
  isEmojiPickerVisible: boolean = false

  addEmoji(event: any) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

    showEmojiWindow() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.isEmojiPickerVisible = false
  }
}
