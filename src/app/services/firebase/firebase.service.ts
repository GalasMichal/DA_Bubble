import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  constructor() { }

  // Methode zum Erstellen eines neuen Benutzers
  createUser(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Erfolgreiche Anmeldung
        const user = userCredential.user;
        console.log('User created:', user);
        return user;
      })
      .catch((error) => {
        // Fehlerbehandlung
        console.error('Error creating user:', error);
        throw error;
      });
  }
}
