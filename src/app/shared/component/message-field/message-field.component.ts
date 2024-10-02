
import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [HeaderComponent, PickerComponent, CommonModule, EmojiComponent],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss'
})
export class MessageFieldComponent {

  showEmoji: boolean = false

  addEmoji($event: Event) {

  }

  showEmojiWindow() {
    this.showEmoji = !this.showEmoji;
  }
}
