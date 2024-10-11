import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCreateComponent } from '../../../shared/component/channel-create/channel-create.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';
import { UserServiceService } from '../../../services/user-service/user-service.service';
import { Router } from '@angular/router';


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
  dialog = inject(MatDialog);
  db = inject(FirebaseService)
  chat = inject(ChatRoomService)
  userService = inject(UserServiceService)
  router = inject(Router);

  ngOnInit() {
    this.chat.subChannelList();
    this.userService.subUserList();
  }

  ngOnDestroy(): void {
    this.chat.unsubscribe();
    this.userService.unsubscribe()
  }


 async toogleDropDown1(){
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }


  toogleDropDown2(){
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen
  }

  addChannel (){
    this.dialog.open(ChannelCreateComponent, {
      panelClass: 'channel-create-container',
    })
  }

  openChannel(chanId : string) {
    this.chat.openChatById(chanId);
  }

  writeMessage() {
    this.router.navigate(['/start/main']);
  }

}
