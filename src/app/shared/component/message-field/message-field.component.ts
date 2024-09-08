import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-message-field',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './message-field.component.html',
  styleUrl: './message-field.component.scss'
})
export class MessageFieldComponent {

}
