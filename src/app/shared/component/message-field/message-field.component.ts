
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

  server = inject(StateControlService)

  addEmoji(event: any) {
    this.server.textArea = `${this.server.textArea}${event.emoji.native}`;
    this.server.isEmojiPickerVisible = false;
  }

    showEmojiWindow() {
    this.server.isEmojiPickerVisible = !this.server.isEmojiPickerVisible;
  }

  closeEmojiWindow() {
    this.server.isEmojiPickerVisible = false
  }
}
