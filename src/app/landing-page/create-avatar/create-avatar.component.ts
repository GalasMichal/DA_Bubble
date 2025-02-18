import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { BackComponent } from '../../shared/component/back/back.component';
import { FooterComponent } from '../footer/footer.component';
import { StorageService } from '../../services/storage/storage.service';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { StateControlService } from '../../services/state-control/state-control.service';
import { CloseComponent } from '../../shared/component/close/close.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface ProfileAvatar {
  name: string;
}

@Component({
  selector: 'app-create-avatar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    BackComponent,
    CloseComponent,
    MatDialogModule,
  ],
  templateUrl: './create-avatar.component.html',
  styleUrls: [
    './create-avatar.component.scss',
  ],
})
export class CreateAvatarComponent {
  dialog = inject(MatDialogRef<CreateAvatarComponent>, { optional: true });
  db = inject(FirebaseService);
  st = inject(StorageService);
  user = inject(UserServiceService);
  router = inject(Router);
  stateControl = inject(StateControlService);
  selectedAvatar: string = 'assets/media/icons/profile-icons/profile-icon.svg';
  file: any;
  isSelected: boolean = false;

  profileAvatars: ProfileAvatar[] = [
    { name: 'assets/media/icons/profile-icons/user-1-elise.svg' },
    { name: 'assets/media/icons/profile-icons/user-2-elias.svg' },
    { name: 'assets/media/icons/profile-icons/user-3-frederick.svg' },
    { name: 'assets/media/icons/profile-icons/user-4-steffen.svg' },
    { name: 'assets/media/icons/profile-icons/user-5-sofia.svg' },
    { name: 'assets/media/icons/profile-icons/user-6-noah.svg' },
  ];

  chooseAvatar(avatarName: string) {
    this.selectedAvatar = avatarName;
    this.isSelected = true;
  }

  uploadUserAvatar(event: any) {
    const file = event.target.files[0];
    this.readURL(file);
    this.st.uploadMsg.set(file.name); // Set the file name to uploadMsg signal
    this.file = file;
    console.log('file', file);
    this.isSelected = true;
  }

  readURL(file: any) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedAvatar = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async closeCreateAvatar(text: string) {
    if (this.file) {
      // Use the universal upload function from the StorageService
      const downloadUrl = await this.st.uploadFileToStorage(
        'avatars', // The folder in Firebase Storage
        this.db.currentUser()!.uId, // The user ID as the file name or path
        this.file // The file to upload
      );
      if (downloadUrl) {
        this.selectedAvatar = downloadUrl; // Set the selected avatar to the uploaded URL
      }
    } else {
      // If no file was selected, use the default avatar
      this.selectedAvatar = 'assets/media/icons/profile-icons/profile-icon.svg';
    }

    // Update the user's avatar in Firestore
    this.user.updateUserAvatar(this.db.currentUser()!.uId, this.selectedAvatar);
    await this.db.getUserByUid(this.db.currentUser()!.uId); // Refresh user data

    // Show a toast message and navigate
    this.showToast(text);
    this.closeEditAvatar();
  }

  showToast(text: string) {
    this.stateControl.showToast = true;
    this.stateControl.showToastText.set(text);
    this.stateControl.removeShowToast();
    setTimeout(() => {
      this.router.navigate(['main']);
    }, 2200);
  }

  closeEditAvatar() {
    if (this.dialog) {
      this.dialog.close();
    }
  }
}
