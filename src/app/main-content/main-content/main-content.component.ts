import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, CommonModule, HeaderComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  isFirstDropdownMenuOpen = false ;
  readonly userDialog = inject(MatDialog)

  toogleDropDown1(){
    this.isFirstDropdownMenuOpen = !this.isFirstDropdownMenuOpen;
  }

  openUserProfile() {
    this.userDialog.open(UserProfileComponent, {
      panelClass: 'user-profile-container'
    })
  }
}

