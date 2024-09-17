import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { User } from '../../models/interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);


  //Signal für user
  public userSignal = signal<User | null>(null);


  constructor() { }

  // Methode zum Erstellen eines neuen Benutzers
  createUser(email: string, password: string, displayName: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;

        // Setze den displayName nach der erfolgreichen Registrierung
        return updateProfile(firebaseUser, {
          displayName: displayName
        }).then(() => {
          // Benutzerprofil aktualisiert
          const user: User = {
            uId: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',  // Nun wird der displayName korrekt gesetzt
          };
          console.log('Registrierter User ist', user);

          this.userSignal.set(user);
          return user;
        });
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error('Error creating user:', error);
        throw error;
      });
  }
}
