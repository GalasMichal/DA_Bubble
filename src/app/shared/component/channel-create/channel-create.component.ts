
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AddMembersComponent } from '../add-members/add-members.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [RouterModule, RouterLink, AddMembersComponent, MatDialogContent, AddMembersComponent],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent {
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  member = inject(UserService)


  closeModal() {
    this.dialogRef.close();
  }

  openAddMembers() {
    this.dialogAddMembers.open(AddMembersComponent, {
      panelClass: 'add-members-container', // Custom class for profile dialog
    });
    this.closeModal()
  }
}
