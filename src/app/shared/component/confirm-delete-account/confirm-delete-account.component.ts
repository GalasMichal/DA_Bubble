import { Component, inject } from '@angular/core';
import { BackComponent } from '../back/back.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CloseComponent } from '../close/close.component';

@Component({
  selector: 'app-confirm-delete-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CloseComponent
  ],
  templateUrl: './confirm-delete-account.component.html',
  styleUrl: './confirm-delete-account.component.scss'
})
export class ConfirmDeleteAccountComponent {
  readonly dialog = inject(MatDialogRef<ConfirmDeleteAccountComponent>);
  stateControl = inject(StateControlService)
  fb = inject(FirebaseService);

 constructor(public confirmDialogRef: MatDialogRef<ConfirmDeleteAccountComponent>){

 }
  closeDelete() {
      this.dialog.close()
  }

  confirmDeleteAccount() {
    const result = true
    this.confirmDialogRef.close(result)
  }

}
