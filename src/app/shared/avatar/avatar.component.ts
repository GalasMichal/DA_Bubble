import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  db = inject(FirebaseService);


}
