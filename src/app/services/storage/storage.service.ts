import { Injectable, signal } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Neue Imports für Firebase v9+


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  uploadMsg = signal(''); // Signal für Upload-Status

  // Firebase Storage-Service injizieren
  private storage = getStorage(); // Firebase Storage initialisieren

  // Funktion zum Hochladen von Dateien
  uploadFileToStorage(folder: string, fileName: string, file: File): Promise<string> {
    const filePath = `${folder}/${fileName}/${file.name}`;
    const fileRef = ref(this.storage, filePath); // Firebase-Referenz für die Datei
    const task = uploadBytesResumable(fileRef, file); // Upload-Aufgabe

    return new Promise((resolve, reject) => {
      task.on('state_changed',
        (snapshot) => {
          // Hier kannst du den Fortschritt des Uploads verfolgen, wenn gewünscht
        },
        (error) => {
          this.uploadMsg.set('Fehler beim Upload!'); // Fehler-Status setzen
          reject(error); // Fehler zurückgeben
        },
        () => {
          // Nachdem der Upload abgeschlossen ist, hole die URL der Datei
          getDownloadURL(fileRef).then(
            (url) => {
              this.uploadMsg.set('Upload erfolgreich!'); // Signal setzen
              resolve(url); // URL zurückgeben
            },
            (error) => {
              this.uploadMsg.set('Fehler beim Abrufen der URL!'); // Fehler-Status setzen
              reject(error); // Fehler zurückgeben
            }
          );
        }
      );
    });
  }
}
