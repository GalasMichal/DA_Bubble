import { Component, inject } from '@angular/core';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { CloseComponent } from "../close/close.component";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-image',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './show-image.component.html',
  styleUrl: './show-image.component.scss'
})
export class ShowImageComponent {
 stateControl = inject(StateControlService)

 readonly dialogRef = inject(MatDialogRef<ShowImageComponent>);

 closeDialog() {
  this.dialogRef.close();
 }
}
