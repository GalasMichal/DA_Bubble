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
import { AvatarComponent } from '../../avatar/avatar.component';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AppComponent } from '../../../app.component';
import { CloseComponent } from '../close/close.component';

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
    InputAddUsersComponent, 
    AvatarComponent,
    CloseComponent
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent{
  hiddenChannel: boolean = true;
  channelForm: FormGroup;
  selectedOption: string = '';
  isSpecificPeople: boolean = false;
  allMembers: boolean = false

  dialog = inject(MatDialogRef<ChannelCreateComponent>);
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  db = inject(FirebaseService);

  
  onRadioChange(event: any) {
    if (event.target.value === 'specificPeople') {
      this.isSpecificPeople = true
      this.allMembers = true

    } else if (event.target.value === 'allMembers') {
      this.isSpecificPeople = false
      this.allMembers = true
    }
  }

  isChannelNameValid() {

    return this.channelForm.controls['channelName'].valid;
  }

  isSpecificPeopleValid() {
    return this.channelForm.controls['specificPeople'].valid;
  }

  constructor() { 
    this.channelForm = new FormGroup({
      channelName: new FormControl('', [Validators.required, Validators.minLength(3),]),
      channelDescription: new FormControl(''),
      member: new FormControl(false),
      specificPeople:  new FormControl('', [Validators.required, Validators.minLength(3),]),
    });
  }

  closeDialogAddChannel(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  closeDialogAddMembers(event: Event) {
    event.preventDefault()
    this.dialog.close();
  }

  openAddMembers(event: Event) {
    this.dialogAddMembers.open(AddMembersComponent, {
      panelClass: 'add-members-container',
       // Custom class for profile dialog
    });
    this.closeDialogAddChannel(event);
  }



  createChannelModel(event: Event) {
    // debugger
      const formValues = this.channelForm.value;
      const newChannel: Channel = {
        chanId: '', 
        channelName: formValues.channelName,
        channelDescription: formValues.channelDescription || '',
        allMembers: formValues.member,
        specificPeople: formValues.specificPeople ? formValues.specificPeople.split(',') : [],
        createdAt: new Date().toISOString(),
        createdBy: 'user-id', 
       }
      this.createChannel(event, newChannel)
  }

  createChannel(event: Event, newChannel: Channel) {
    console.log(newChannel);
    this.db.addChannelToFirestore(newChannel);
    this.closeDialogAddMembers(event)
  }
}
