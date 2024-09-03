import { Component, ComponentFactoryResolver, inject, ViewChild, ViewContainerRef } from '@angular/core';




import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { LogoComponent } from '../../logo/logo.component';
import { CreateAvatarComponent } from '../../create-avatar/create-avatar.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LogoComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  readonly userDialog = inject(MatDialog)

  isMenuOpen= true;
  isFirstDropdownMenuOpen = false ;
  isSecondDropdownMenuOpen = true;


  toogleDropDown1(){
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  toogleDropDown2(){
    this.isSecondDropdownMenuOpen = !this.isSecondDropdownMenuOpen
  }

  openUserProfile() {
    this.userDialog.open(UserProfileComponent, {
      panelClass: 'user-profile-container'
    })
  }

}

