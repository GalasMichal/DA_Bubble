import { Component, inject } from '@angular/core';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from "../close/close.component";
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-message-image',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './show-image.component.html',
  styleUrl: './show-image.component.scss'
})
export class MessageImageComponent {
 stateControl = inject(StateControlService)

 readonly dialogRef = inject(MatDialogRef<MessageImageComponent>);

 closeDialog() {
  this.dialogRef.close();
 }
}
