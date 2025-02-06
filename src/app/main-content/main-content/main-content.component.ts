import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuSideLeftComponent } from '../menu-side-left/menu-side-left/menu-side-left.component';
import { ThreadAnswerComponent } from '../../shared/component/thread-answer/thread-answer.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MenuSideLeftComponent,
    ThreadAnswerComponent,
    RouterModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent implements OnInit {
  stateServer: StateControlService = inject(StateControlService);
  user = inject(UserServiceService);
  chat = inject(ChatRoomService);
  public db = inject(FirebaseService);
  router = inject(Router);
  private auth = inject(Auth);
  userService = inject(UserServiceService);

  constructor() {
    this.stateServer.isUserLoggedIn = true;
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // Warte auf die Benutzerinformationen, bevor du fortfährst
        console.log('user', user);
        await this.db.getUserByUid(user.uid);
        console.log('currentUser', this.db.currentUser()); // Jetzt kannst du sicher auf den Benutzer zugreifen

        // Lade Kanäle und beginne mit den Echtzeit-Updates
        this.chat.loadChannelsFromDB(); // Lade Kanäle aus IndexedDB
        this.chat.subscribeToChannelUpdates(); // Abonniere Echtzeit-Updates von Firestore
        console.log('Channels aus DB', this.chat.channels());
      } else {
        // Falls kein Benutzer angemeldet ist, navigiere zum Login-Bildschirm
        this.router.navigate(['']);
      }
    });
  }

  ngOnDestroy(): void {
    this.chat.unsubscribeAll();
  }
}
