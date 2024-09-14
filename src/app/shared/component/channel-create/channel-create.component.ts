import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddMembersComponent } from '../add-members/add-members.component';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, AddMembersComponent],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent {
  readonly dialogAddMembers = inject(MatDialog);

  constructor(private dialogRef: MatDialogRef<ChannelCreateComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }

  openAddMembers() {
    this.dialogAddMembers.open(AddMembersComponent, {
      panelClass: 'add-members-container', // Custom class for profile dialog
    });
  }
}
