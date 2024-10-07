import { Component, inject, Input } from '@angular/core';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { TimeSeparatorComponent } from './time-separator/time-separator.component';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-message-answer',
  standalone: true,
  imports: [CommonModule, ReactionBarComponent, TimeSeparatorComponent, EmojiComponent, PickerComponent, DatePipe],
  templateUrl: './message-answer.component.html',
  styleUrl: './message-answer.component.scss',
})
export class MessageAnswerComponent {

  today: number = Date.now();

  @Input() index: number = 0;

  @Input() userMessage = {
      userName: 'User Name',
      timeStamp: 'time stamp',
      userMessage: 'Welche Version ist aktuell von Angular?',
      profileImageSrc: 'assets/media/icons/profile-icons/user-6-noah.svg',
      profileImageAlt: 'profile-image',
      messageContent: 'Welche Version ist aktuell von Angular?',
      answers: '2 Antworten',
      lastAnswerTimeStamp: 'Time stamp from last answer',
  };

  emojis: { symbol: string, count: number }[] = [];

  onEmojiSelected(emoji: string) {
    // Überprüfe, ob das Emoji bereits existiert
    const existingEmoji = this.emojis.find(e => e.symbol === emoji);
    
    if (existingEmoji) {
      existingEmoji.count++; // Erhöhe den Zähler
    } else {
      this.emojis.push({ symbol: emoji, count: 1 }); // Füge neues Emoji hinzu
    }
    console.log(this.emojis);
  }

  state = inject(StateControlService);
  @Input() hideDetails: boolean = false;

  openThread() {
    this.state.isThreadOpen = true;
  }
}
