import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/avatar/avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelCreateComponent } from '../../../shared/component/channel-create/channel-create.component';
import { FirebaseService } from '../../../services/firebase/firebase.service';
import { ChatRoomService } from '../../../services/chat-room/chat-room.service';


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

  ngOnInit() {
    this.chat.subChannelList();
  }

  ngOnDestroy(): void {
    this.chat.unsubscribe();
  }


 async toogleDropDown1(){
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;

  }
  openChannelList(){

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
    this.chat.openChatById(chanId)

  }


}
