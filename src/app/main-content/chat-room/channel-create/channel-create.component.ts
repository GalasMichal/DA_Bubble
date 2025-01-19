import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

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
import { User } from '../../../models/interfaces/user.model';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogContent,
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
    this.stateServer.choosenUserFirebase = [];
    if (event.target.value === 'specificPeople') {
      this.isSpecificPeople = true;
      this.allMembers = true;
    } else if (event.target.value === 'allMembers') {
      this.isSpecificPeople = false;
      this.allMembers = true;
      this.allMembersInChannel = this.userService.userListUid;
      this.stateServer.choosenUserFirebase = this.userService.userListUid;
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
    const formValues = this.channelForm.value;
    const newChannel: Channel = {
      chanId: '',
      channelName: formValues.channelName,
      channelDescription: formValues.channelDescription || '',
      allMembers: this.allMembersInChannel,
      specificPeople: this.stateServer.choosenUserFirebase,
      createdAt: new Date().toISOString(),
      createdBy: [this.fb.currentUser()!],
    };
    this.stateServer.choosenUserFirebase.push(this.fb.currentUser()!.uId);
    this.stateServer.choosenUser = [];
    this.stateServer.createChannelActiveInput = true;
    this.createChannel(event, newChannel);
  }

  createChannel(event: Event, newChannel: Channel) {
    this.chat.addChannelToFirestore(newChannel);
    this.closeDialogAddMembers(event);
  }
}
