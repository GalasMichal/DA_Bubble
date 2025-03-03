import { Component, inject, OnInit, signal } from '@angular/core';
import { FirebaseService } from './services/firebase/firebase.service';
import { StateControlService } from './services/state-control/state-control.service';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserServiceService } from './services/user-service/user-service.service';
import { LoaderComponent } from './shared/component/loader/loader.component';
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ReactiveFormsModule,
    LoaderComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'dabubble';
  stateControl = inject(StateControlService);
  loading = signal(true);
  userService = inject(UserServiceService);

  /**
   * Listens for changes in the user's authentication state.
   * When the user is logged in, the method will get the user by their uid and load the current message.
   * If the user is not logged out, the method will navigate to the home page.
   *
   * @returns {Observable<FirebaseUser | null>} An observable that tracks the authentication state.
   */
  ngOnInit() {
    this.getCurrentUser().subscribe((user) => {
      this.loading.set(false);
    });
  }

  /**
   * Returns an observable of the currently authenticated user.
   * The observable emits:
   * - A `FirebaseUser` object when a user is logged in.
   * - `null` when the user is logged out.
   *
   * @returns {Observable<FirebaseUser | null>} An observable that tracks the authentication state.
   */
  getCurrentUser(): Observable<FirebaseUser | null> {
    return this.userService.getCurrentUser();
  }
}
