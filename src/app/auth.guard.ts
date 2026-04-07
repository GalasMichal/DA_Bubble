import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Nur Auth prüfen. Firestore/IndexedDB-Sync läuft in MainContentComponent (try/catch),
 * damit Regel-/Netzwerkfehler keine leere Seite erzeugen.
 */
export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  const user = await firstValueFrom(authState(auth).pipe(take(1)));
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
