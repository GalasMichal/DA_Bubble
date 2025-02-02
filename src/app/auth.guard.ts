import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth); // Inject Firebase Auth

  return new Observable<boolean>((observer) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        observer.next(true); // User is logged in
        observer.complete();
      } else {        
        router.navigate(['/login']);
        observer.next(false); // User is not logged in
        observer.complete();
      }
    });
  });
};
