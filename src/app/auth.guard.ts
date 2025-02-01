import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './services/firebase/firebase.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const fb = inject(FirebaseService)

    const userToken = localStorage.getItem('authToken');
    
    if (userToken) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }

};
