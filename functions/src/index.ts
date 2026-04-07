import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();

const db = getFirestore();
const auth = getAuth();

/** Ordner mit User-Uploads (App: StorageService, create-avatar). Nicht anfassen: exampleAvatars/ */
const STORAGE_PURGE_PREFIXES = ['avatars/', 'chats/', 'directMessages/'] as const;

/**
 * Gleiche ID wie Angular `environment.mainChannelId` / Firestore `channels/{id}` (Willkommen).
 */
function getMainChannelId(): string {
  return (process.env.MAIN_CHANNEL_ID ?? '').trim() || '55dO4OXETme2oZEiCPZH';
}

function getDemoTtlMs(): number {
  const h = Number(process.env.DEMO_TTL_HOURS ?? '24');
  const hours = Number.isFinite(h) && h > 0 ? h : 24;
  return hours * 60 * 60 * 1000;
}

function getExemptUids(): Set<string> {
  const raw = process.env.DEMO_EXEMPT_UIDS ?? '';
  return new Set(
    raw
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

/** Alle Kanäle außer Willkommen inkl. Subcollections (z. B. messages). */
async function deleteAllChannelsExceptWelcome(): Promise<void> {
  const mainId = getMainChannelId();
  if (!mainId || mainId.startsWith('YOUR_')) {
    console.warn(
      'MAIN_CHANNEL_ID fehlt oder Platzhalter — Kanäle werden nicht bereinigt.'
    );
    return;
  }

  const snap = await db.collection('channels').get();
  for (const doc of snap.docs) {
    if (doc.id === mainId) continue;
    try {
      await db.recursiveDelete(doc.ref);
    } catch (e) {
      console.error('dailyDemoCleanup channel recursiveDelete', doc.id, e);
    }
  }
}

/** Alle privaten Chats inkl. Nachrichten-Unterkollektionen. */
async function deleteAllPrivateMessages(): Promise<void> {
  const snap = await db.collection('privateMessages').get();
  for (const doc of snap.docs) {
    try {
      await db.recursiveDelete(doc.ref);
    } catch (e) {
      console.error('dailyDemoCleanup privateMessages recursiveDelete', doc.id, e);
    }
  }
}

/**
 * Löscht alle Dateien unter avatars/, chats/, directMessages/.
 * exampleAvatars/ (Standardbilder) wird nicht gelistet und bleibt erhalten — Ordner gibt es in GCS nur mit Objekten.
 */
async function purgeDemoStorageKeepingExampleAvatars(): Promise<void> {
  const bucket = getStorage().bucket();
  for (const prefix of STORAGE_PURGE_PREFIXES) {
    const [files] = await bucket.getFiles({ prefix, autoPaginate: true });
    for (const file of files) {
      if (file.name.startsWith('exampleAvatars/')) continue;
      try {
        await file.delete();
      } catch (e) {
        console.error('dailyDemoCleanup storage', file.name, e);
      }
    }
  }
}

/** Auth + Firestore users/{uid} für Demo-Konten nach TTL (Ausnahmen: DEMO_EXEMPT_UIDS). */
async function purgeExpiredDemoUsers(): Promise<void> {
  const ttlMs = getDemoTtlMs();
  const exempt = getExemptUids();
  const cutoff = Date.now() - ttlMs;

  let nextPageToken: string | undefined;
  do {
    const list = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of list.users) {
      const uid = userRecord.uid;
      if (exempt.has(uid)) continue;

      const created = new Date(userRecord.metadata.creationTime).getTime();
      if (created >= cutoff) continue;

      try {
        await auth.deleteUser(uid);
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code;
        if (code !== 'auth/user-not-found') {
          console.error('dailyDemoCleanup auth', uid, e);
        }
      }
      try {
        await db.collection('users').doc(uid).delete();
      } catch (e) {
        console.error('dailyDemoCleanup users doc', uid, e);
      }
    }
    nextPageToken = list.pageToken;
  } while (nextPageToken);
}

/**
 * Einmal täglich: Firestore (Willkommen-Kanal, keine privaten Chats),
 * Storage (avatars/chats/directMessages, ohne exampleAvatars),
 * dann abgelaufene Demo-Auth-Nutzer.
 *
 * Env: MAIN_CHANNEL_ID, DEMO_EXEMPT_UIDS, DEMO_TTL_HOURS (siehe functions/.env.example)
 */
export const dailyDemoCleanup = onSchedule(
  {
    schedule: '0 3 * * *',
    timeZone: 'Europe/Berlin',
    region: 'europe-west1',
    memory: '512MiB',
    timeoutSeconds: 540,
  },
  async () => {
    await deleteAllChannelsExceptWelcome();
    await deleteAllPrivateMessages();
    await purgeDemoStorageKeepingExampleAvatars();
    await purgeExpiredDemoUsers();
  }
);
