import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@Component({
  selector: 'app-time-separator',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './time-separator.component.html',
  styleUrl: './time-separator.component.scss',
})
export class TimeSeparatorComponent {
  
  today: number = Date.now();
  
}
