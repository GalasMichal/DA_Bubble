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
    LoaderComponent
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'dabubble';
  stateControl = inject(StateControlService)
  loading = signal(true);
  userService = inject(UserServiceService)

  ngOnInit() {
    this.getCurrentUser().subscribe(user => {
      this.loading.set(false);
    });
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return this.userService.getCurrentUser(); // Use the method from FirebaseService
  }
}
