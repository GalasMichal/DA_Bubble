import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-separator',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './time-separator.component.html',
  styleUrl: './time-separator.component.scss'
})
export class TimeSeparatorComponent {
  
  today: number = Date.now();
  
}
