import { Component, inject } from '@angular/core';
import { CloseComponent } from "../close/close.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CloseComponent],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
    readonly dialog = inject(MatDialogRef<DeleteAccountComponent>);
    stateControl = inject(StateControlService)
    fb = inject(FirebaseService);


    closeDelete() {
        this.dialog.close()
    }

    confirmDeleteAccount() {
    const password = this.stateControl.saveGlobaPassword;
      this.fb.confirmDeleteAccountWithPassword(password)
    }

}
