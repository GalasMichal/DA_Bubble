import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCreateComponent } from '../../../shared/component/channel-create/channel-create.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-menu-side-left',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './menu-side-left.component.html',
  styleUrl: './menu-side-left.component.scss',
})
export class MenuSideLeftComponent {
  isFirstDropdownMenuOpen = false ;
  isSecondDropdownMenuOpen = true;
  member = inject(UserService)



  toogleDropDown1(){
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  toogleDropDown2(){
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen
  }


  constructor(private dialog: MatDialog) {}
  addChannel (){
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    })
  }
}
