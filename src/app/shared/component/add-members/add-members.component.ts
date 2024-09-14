import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule} from '@angular/material/radio';
import { InputAddUsersComponent } from '../input-add-users/input-add-users.component';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [MatDialogContent, MatRadioModule, InputAddUsersComponent, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss',
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'red' },
}]
})
export class AddMembersComponent {
  dialog = inject(MatDialogRef <AddMembersComponent>)

  closeDialogAddMembers() {
    this.dialog.close();
  }

}
