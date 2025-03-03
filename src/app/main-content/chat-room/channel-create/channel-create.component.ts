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
  choosenSpecificPeople: string[] = [];
  allMembers: boolean = false;
  allMembersInChannel: string[] = [];

  /**
   * Inject the MatDialogRef service to close the dialog
   * Inject the StateControlService to access the global state
   * Inject the MatDialog service to open the add members dialog
   * Inject the ChatRoomService to access the chat room
   * Inject the FirebaseService to access the firebase
   * Inject the UserServiceService to access the user list
   */
  dialog = inject(MatDialogRef<ChannelCreateComponent>);
  stateServer = inject(StateControlService);
  readonly dialogAddMembers = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<ChannelCreateComponent>);
  chat = inject(ChatRoomService);
  fb = inject(FirebaseService);
  userService = inject(UserServiceService);

  /**
   *  Handle the radio button change event
   * @param event   The event object
   * @returns void
   */
  onRadioChange(event: any) {
    this.stateServer.choosenUser = [];
    if (event.target.value === 'specificPeople') {
      this.handleSpecificPeopleSelection();
    } else if (event.target.value === 'allMembers') {
      this.handleAllMembersSelection();
    }
  }

  /**
   * Handle the specific people selection
   */
  handleSpecificPeopleSelection() {
    this.isSpecificPeople = true;
    this.allMembers = true;
    this.choosenSpecificPeople = this.stateServer.choosenUser.map(
      (user) => user.uId
    );
  }

  /**
   * Handle the all members selection
   */
  handleAllMembersSelection() {
    this.isSpecificPeople = false;
    this.allMembers = true;
    this.choosenSpecificPeople = this.userService.userList.map(
      (user) => user.uId
    );
  }

  /**
   *
   * @returns {boolean}  Returns true if the channel name is valid
   */
  isChannelNameValid(): boolean {
    return this.channelForm.controls['channelName'].valid;
  }

  /**
   * Initialize the channel form
   * validates the channel name and specific people input
   */
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

  /**
   *  Close the dialog
   * @param event  The event object
   */
  closeDialogAddChannel(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }

  /**
   *  Close the dialog
   * @param event The event object
   */
  closeDialogAddMembers(event: Event) {
    event.preventDefault();
    this.dialog.close();
  }

  /**
   *  Create the channel model
   * @param event The event object
   */
  createChannelModel(event: Event) {
    const formValues = this.channelForm.value;
    const newChannel = this.createNewChannelObject(formValues);
    this.stateServer.choosenUser = [];
    this.stateServer.createChannelActiveInput = true;
    this.createChannel(event, newChannel);
  }

  /**
   *  Create a new channel object
   * @param formValues The form values
   * @returns object
   */
  createNewChannelObject(formValues: any): Channel {
    return {
      chanId: '',
      channelName: formValues.channelName,
      channelDescription: formValues.channelDescription || '',
      allMembers: [],
      specificPeople: this.choosenSpecificPeople,
      createdAt: new Date().toISOString(),
      createdBy: [this.fb.currentUser()!],
    };
  }

  /**
   *  Create the channel
   * @param event The event object
   * @param newChannel The new channel object
   */
  createChannel(event: Event, newChannel: Channel) {
    this.chat.createChannel(newChannel);
    this.closeDialogAddMembers(event);
  }
}
