import { Component, inject } from '@angular/core';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from "../../component/close/close.component";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-image',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './message-image.component.html',
  styleUrl: './message-image.component.scss'
})
export class MessageImageComponent {
 stateControl = inject(StateControlService)

 readonly dialogRef = inject(MatDialogRef<MessageImageComponent>);

 closeDialog() {
  this.dialogRef.close();
 }
}
