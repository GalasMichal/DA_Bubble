import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddMembersComponent } from '../add-members/add-members.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RouterLink,
    AddMembersComponent,
    MatDialogContent,
    AddMembersComponent,
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent {
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  fb = inject(FirebaseService);

  channel = {
    channelName: '',
    channelDescription: '',
  };


  closeModal() {
    this.dialogRef.close();
  }

  openAddMembers() {
    this.dialogAddMembers.open(AddMembersComponent, {
      panelClass: 'add-members-container', // Custom class for profile dialog
    });
    this.closeModal();
  }

  creatNewChannel() {
    this.openAddMembers();
    console.log(this.channel);
    this.fb.addChannelToFirestore(this.channel)

  }
}
