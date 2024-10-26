import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { BackComponent } from '../../shared/component/back/back.component';
import { FooterComponent } from '../footer/footer.component';
import { StorageService } from '../../services/storage/storage.service';
import { UserServiceService } from '../../services/user-service/user-service.service';

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
    LogoComponent,
    BackComponent,
    FooterComponent,
  ],
  templateUrl: './create-avatar.component.html',
  styleUrls: [
    './create-avatar.component.scss',
    './create-avatar.component.media.scss',
  ],
})
export class CreateAvatarComponent {
  db = inject(FirebaseService);
  st = inject(StorageService);
  user = inject(UserServiceService);
  router = inject(Router);
  selectedAvatar: string = 'assets/media/icons/profile-icons/profile-icon.svg';
  file: any;

  profileAvatars: ProfileAvatar[] = [
    { name: 'assets/media/icons/profile-icons/user-2-elias.svg' },
    { name: 'assets/media/icons/profile-icons/user-3-frederick.svg' },
    { name: 'assets/media/icons/profile-icons/user-4-steffen.svg' },
    { name: 'assets/media/icons/profile-icons/user-5-sofia.svg' },
    { name: 'assets/media/icons/profile-icons/user-6-noah.svg' },
  ];

  chooseAvatar(avatarName: string) {
    this.selectedAvatar = avatarName;
  }

  uploadUserAvatar(event: any) {
    const file = event.target.files[0];
    this.readURL(file);
    this.st.uploadMsg.set(file.name);
    this.file = file;
    console.log('file', file);
  }

  readURL(file: any) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedAvatar = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async closeCreateAvatar() {
    if (this.file) {
      const downloadUrl = await this.st.uploadAvatarToStorage(
        this.db.currentUser()!.uId,
        this.file
      );
      if (downloadUrl) {
        this.selectedAvatar = downloadUrl;
      }
    }
    this.user.updateUserAvatar(this.db.currentUser()!.uId, this.selectedAvatar);
    await this.user.updateCurrentUser(this.db.currentUser()!);
    this.router.navigate(['/start/main']);
  }
}
