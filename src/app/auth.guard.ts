import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return authState(auth).pipe(
    take(1), // Take only the first emitted value (prevents infinite subscription)
    map(user => {
      if (user) {
        return true; // Allow access if user is authenticated
      } else {
        router.navigate(['/login']); // Redirect to login
        return false;
      }
    })
  );
};