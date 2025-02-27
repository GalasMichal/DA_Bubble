import { Injectable, signal } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * signal for preview status
   */
  uploadMsg = signal('');
  /**
   * signal for upload status
   */
  uploadMsg2 = signal('');

  /**
   * firebase storage initialisation
   */
  private storage = getStorage();

  /**
   * function to upload file to firebase storage
   * task to upload file means the upload progress
   * @param folder
   * @param fileName
   * @param file
   * @returns
   */
  uploadFileToStorage(
    folder: string,
    fileName: string,
    file: File
  ): Promise<string> {
    const filePath = `${folder}/${fileName}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadMsg2.set(`Upload: ${progress.toFixed(2)}%`);
        },
        (error) => {
          this.uploadMsg2.set('Fehler beim Upload!');
          reject(error);
        },
        () => {
          getDownloadURL(fileRef).then(
            (url) => {
              this.uploadMsg2.set('Upload erfolgreich!');
              resolve(url);
            },
            (error) => {
              this.uploadMsg2.set('Fehler beim Abrufen der URL!');
              reject(error);
            }
          );
        }
      );
    });
  }

  /**
   * generate preview of selected image
   * @param file the selected file
   */
  generatePreview(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.uploadMsg.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
