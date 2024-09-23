import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { InputAddUsersComponent } from '../input-add-users/input-add-users.component';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    InputAddUsersComponent
],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss',
})
export class AddMembersComponent {
  // dialog = inject(MatDialogRef<AddMembersComponent>);

  // selectedOption: string = '';
  // specificPeople: boolean = false;
  // allMembers: boolean = false
 

  // closeDialogAddMembers() {
  //   this.dialog.close();
  // }

  // choosenOption() {
  //   if (this.selectedOption === 'specificPeople') {
  //     this.specificPeople = true;
  //   } else {
  //     this.specificPeople = false
  //     this.allMembers = true
  //   }
  // }
}
