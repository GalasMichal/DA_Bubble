import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddMembersComponent } from '../add-members/add-members.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

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
    ReactiveFormsModule,
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent{
  channelForm: FormGroup;
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  db = inject(FirebaseService);

  
  constructor() {
    this.channelForm = new FormGroup({
      channelName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      channelDescription: new FormControl(['']),
    });
  }
  

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
    if(this.channelForm.valid) {
      let channelName: string = this.channelForm.get('channelName')?.value

      let channelDescription = this.channelForm.get('description')?.value
      // this.db.singleGlobalChannel.push(channelName);
    }
  }
}
