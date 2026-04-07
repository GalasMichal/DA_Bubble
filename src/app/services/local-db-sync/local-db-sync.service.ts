import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, getDoc } from '@angular/fire/firestore';
import { openDB } from 'idb';
import { FirebaseService } from '../firebase/firebase.service';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { Message } from '../../models/interfaces/message.model';
import { User } from '../../models/interfaces/user.model';

const CHAT_DB = 'ChatDB';
const CHAT_DB_VERSION = 1;
/** Verhindert doppelte Läufe (authGuard + Main onAuthStateChanged innerhalb weniger Sekunden). */
const SYNC_DEDUP_MS = 4000;

/**
 * Hält IndexedDB (ChatDB, idb) mit Firestore abgleichbar.
 * {@link runLocalChatStorageSyncAfterLogin} soll nach {@link FirebaseService.getUserByUid} laufen (z. B. authGuard + Main).
 */
@Injectable({
  providedIn: 'root',
})
export class LocalDbSyncService {
  private readonly firebase = inject(FirebaseService);
  private readonly chat = inject(ChatRoomService);
  private readonly auth = inject(Auth);
  private readonly injector = inject(Injector);

  private fbCtx<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }
  private lastSyncForUid: { uid: string; at: number } | null = null;

  /** Wie ChatRoomService: Profil-UID oder Auth-UID (Profil kann kurz fehlen). */
  private effectiveUid(): string | null {
    return (
      this.firebase.currentUser()?.uId ?? this.auth.currentUser?.uid ?? null
    );
  }

  private readonly dbPromise = openDB(CHAT_DB, CHAT_DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('channels')) {
        db.createObjectStore('channels', { keyPath: 'chanId' });
      }
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'messageId' });
      }
      if (!db.objectStoreNames.contains('directMessages')) {
        db.createObjectStore('directMessages', { keyPath: 'chatId' });
      }
      if (!db.objectStoreNames.contains('messageReceivers')) {
        db.createObjectStore('messageReceivers', { keyPath: 'uId' });
      }
    },
  });

  /**
   * Kanal-Liste aus Firestore + Bereinigung verwaister Nachrichten/DMs/Empfänger.
   * Läuft bei jedem Login / jedem Aufruf von `/main` (authGuard + Main-Component; kurze Deduplizierung).
   */
  async runLocalChatStorageSyncAfterLogin(): Promise<void> {
    const uid = this.effectiveUid();
    if (!uid) return;

    const now = Date.now();
    if (
      this.lastSyncForUid?.uid === uid &&
      now - this.lastSyncForUid.at < SYNC_DEDUP_MS
    ) {
      return;
    }

    await this.chat.reconcileChannelsWithFirestore();
    await this.pruneStaleIndexedDbAgainstFirestore();
    this.lastSyncForUid = { uid, at: now };
  }

  /**
   * Entfernt lokale Einträge ohne passendes Firestore-Dokument (Nachrichten, DMs, Empfänger).
   */
  async pruneStaleIndexedDbAgainstFirestore(): Promise<void> {
    if (!this.effectiveUid()) return;

    const fs = this.firebase.firestore;
    const db = await this.dbPromise;

    const allMessages = await db.getAll('messages');
    for (const msg of allMessages as Message[]) {
      const mid = msg.messageId;
      const cid = msg.chatId;
      if (!mid || !cid) {
        if (mid) await db.delete('messages', mid);
        continue;
      }
      const mref = doc(fs, 'channels', cid, 'messages', mid);
      const msnap = await this.fbCtx(() => getDoc(mref));
      if (!msnap.exists()) {
        await db.delete('messages', mid);
      }
    }

    if (db.objectStoreNames.contains('directMessages')) {
      const directRows = await db.getAll('directMessages');
      for (const row of directRows as Message[]) {
        const chatId = row.chatId;
        if (!chatId) continue;
        const pref = doc(fs, 'privateMessages', chatId);
        const psnap = await this.fbCtx(() => getDoc(pref));
        if (!psnap.exists()) {
          await db.delete('directMessages', chatId);
        }
      }
    }

    if (db.objectStoreNames.contains('messageReceivers')) {
      const receivers = await db.getAll('messageReceivers');
      for (const u of receivers as User[]) {
        if (!u.uId) continue;
        const uref = doc(fs, 'users', u.uId);
        const usnap = await this.fbCtx(() => getDoc(uref));
        if (!usnap.exists()) {
          await db.delete('messageReceivers', u.uId);
        }
      }
    }
  }
}
