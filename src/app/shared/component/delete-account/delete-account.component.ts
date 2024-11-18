import { Component } from '@angular/core';
import { CloseComponent } from "../close/close.component";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

}
