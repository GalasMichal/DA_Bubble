import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateControlService {
  isThreadOpen = false;

  choosenUser: { userName: string; uId: string }[] = [];

  constructor() {
   }
}
