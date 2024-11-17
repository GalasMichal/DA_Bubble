import { Component } from '@angular/core';
import { BackComponent } from '../../shared/component/back/back.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

}
