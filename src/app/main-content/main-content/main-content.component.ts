import {
  Component,
  computed,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
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
import { LocalDbSyncService } from '../../services/local-db-sync/local-db-sync.service';

@Component({
    selector: 'app-main-content',
    imports: [
        CommonModule,
        HeaderComponent,
        MenuSideLeftComponent,
        ThreadAnswerComponent,
        RouterModule,
    ],
    templateUrl: './main-content.component.html',
    styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit, OnDestroy {
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
  private localDbSync = inject(LocalDbSyncService);
  public db = inject(FirebaseService);
  router = inject(Router);
  private auth = inject(Auth);
  private readonly injector = inject(Injector);

  /**
   * currentChannel is a computed property that returns the current channel from the chat service
   */
  currentChannel = computed(() => this.chat.currentChannelSignal());
  constructor() {
    this.stateServer.isUserLoggedIn = true;
  }

  /**
   * onAuthStateChanged: Profil laden, lokale ChatDB mit Firestore abgleichen (Fehler loggen, UI bleibt nutzbar), Listener.
   */
  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          try {
            await this.db.getUserByUid(user.uid);
            await this.localDbSync.runLocalChatStorageSyncAfterLogin();
          } catch (e) {
            console.error('MainContent: Profil oder Chat-DB-Sync fehlgeschlagen', e);
          }
          this.chat.subscribeToFirestoreChannels();
        } else {
          this.router.navigate(['']);
        }
      });
    });
  }

  /**
   * Unsubscribe all the subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.chat.unsubscribeAll();
  }
}
