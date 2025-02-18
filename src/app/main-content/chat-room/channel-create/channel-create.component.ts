import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Channel } from '../../../models/interfaces/channel.model';
import { InputAddUsersComponent } from '../../../shared/component/input-add-users/input-add-users.component';
import { CloseComponent } from '../../../shared/component/close/close.component';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { StateControlService } from '../../../services/state-control/state-control.service';
import { UserServiceService } from '../../../services/user-service/user-service.service';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputAddUsersComponent,
    CloseComponent,
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent {
  hiddenChannel: boolean = true;
  channelForm: FormGroup;
  selectedOption: string = '';
  isSpecificPeople: boolean = false;
  choosenSpecificPeople: string[] = []
  allMembers: boolean = false;
  allMembersInChannel: string[] = [];

  dialog = inject(MatDialogRef<ChannelCreateComponent>);
  stateServer = inject(StateControlService);
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  chat = inject(ChatRoomService);
  fb = inject(FirebaseService);
  userService = inject(UserServiceService);

  onRadioChange(event: any) {
    this.stateServer.choosenUser = [];
    if (event.target.value === 'specificPeople') {
      this.isSpecificPeople = true;
      this.allMembers = true;
      // add only choosen user
      this.choosenSpecificPeople = this.stateServer.choosenUser.map(user => user.uId)
    } else if (event.target.value === 'allMembers') {
      this.isSpecificPeople = false;
      this.allMembers = true;
      // add all users
      this.choosenSpecificPeople = this.userService.userList.map(user => user.uId)
    }
  }

  isChannelNameValid() {
    return this.channelForm.controls['channelName'].valid;
  }

  constructor() {
    this.channelForm = new FormGroup({
      channelName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      channelDescription: new FormControl(''),
      member: new FormControl(false),
      specificPeople: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  closeDialogAddChannel(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  closeDialogAddMembers(event: Event) {
    event.preventDefault();
    this.dialog.close();
  }

  createChannelModel(event: Event) {
    
    debugger
    const formValues = this.channelForm.value;
    const newChannel: Channel = {
      chanId: '',
      channelName: formValues.channelName,
      channelDescription: formValues.channelDescription || '',
      allMembers: [],
      specificPeople: this.choosenSpecificPeople,
      createdAt: new Date().toISOString(),
      createdBy: [this.fb.currentUser()!],
    };
    this.stateServer.choosenUser = [];
    this.stateServer.createChannelActiveInput = true;
    this.createChannel(event, newChannel);
  }

  createChannel(event: Event, newChannel: Channel) {
    this.chat.createChannel(newChannel);
    this.closeDialogAddMembers(event);
  }
}
