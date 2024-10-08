import { Component, inject } from '@angular/core';
import { CloseComponent } from '../close/close.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss'
})
export class ChannelEditComponent {
  readonly dialog = inject(MatDialogRef <ChannelEditComponent>)

  closeChannelEdit() {
    this.dialog.close()
  }

}
