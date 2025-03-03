import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuSideLeftComponent } from '../menu-side-left/menu-side-left/menu-side-left.component';
import { ThreadAnswerComponent } from '../../shared/component/thread-answer/thread-answer.component';
import { StateControlService } from '../../services/state-control/state-control.service';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router, RouterModule } from '@angular/router';
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
  /**
   * inject the StateControlService to access the global state
   * inject the UserServiceService to access the user list
   * inject the ChatRoomService to access the chat room
   * inject the FirebaseService to access the firebase
   * inject the Router to navigate to different routes
   * inject the Auth to access the authentication service
   */
  stateServer: StateControlService = inject(StateControlService);
  user = inject(UserServiceService);
  chat = inject(ChatRoomService);
  public db = inject(FirebaseService);
  router = inject(Router);
  private auth = inject(Auth);

  /**
   * currentChannel is a computed property that returns the current channel from the chat service
   */
  currentChannel = computed(() => this.chat.currentChannelSignal());
  constructor() {
    this.stateServer.isUserLoggedIn = true;
  }

  /**
   * onAuthStateChanged is a function that listens for changes in the user's authentication state.
   * If the user is authenticated, the function will get the user by their uid and get the channels from indexedDB.
   * If the user is not authenticated, the function will navigate to the home page.
   */
  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.db.getUserByUid(user.uid);
        this.chat.getChannelsFromIndexedDB();
        this.chat.subscribeToFirestoreChannels();
      } else {
        this.router.navigate(['']);
      }
    });
  }

  /**
   * Unsubscribe all the subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.chat.unsubscribeAll();
  }
}
