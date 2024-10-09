import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component, Input } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import { Message } from '../../../../models/interfaces/message.model';

registerLocaleData(localeDe);

@Component({
  selector: 'app-time-separator',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './time-separator.component.html',
  styleUrl: './time-separator.component.scss',
})
export class TimeSeparatorComponent {
  @Input()
  userDate!: Message;

  // today: number = Date.now();

}
