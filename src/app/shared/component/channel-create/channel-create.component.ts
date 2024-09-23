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

import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Channel } from './../../../models/interfaces/channel.model'
import { InputAddUsersComponent } from '../input-add-users/input-add-users.component';

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
    InputAddUsersComponent
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent{
  hiddenChannel: boolean = true;
  channelForm: FormGroup;
  dialog = inject(MatDialogRef<ChannelCreateComponent>);
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  db = inject(FirebaseService);
  
  // channelName: string | '';
  
  constructor() { 
    this.channelForm = new FormGroup({
      channelName: new FormControl('', [Validators.required, Validators.minLength(3),]),
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
      
      const channelData: Channel = {
        channelName: this.channelForm.get('channelName')?.value,
        channelDescription: this.channelForm.get('channelDescription')?.value  
      }
      // this.db.singleGlobalChannel.push(channelData);
      // console.log(this.db.singleGlobalChannel);
      
  
    }
  }



  selectedOption: string = '';
  specificPeople: boolean = false;
  allMembers: boolean = false
 

  closeDialogAddMembers() {
    this.dialog.close();
  }

  choosenOption() {
    if (this.selectedOption === 'specificPeople') {
      this.specificPeople = true;
    } else {
      this.specificPeople = false
      this.allMembers = true
    }
  }
}
