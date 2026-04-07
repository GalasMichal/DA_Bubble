/**
 * Einmalige Bereinigung im CLOUD-Projekt (nicht „lokal“ auf der Festplatte):
 * löscht Gast-Dokumente in Cloud Firestore (Collection `users`) und die
 * zugehörigen anonymen Nutzer in Firebase Authentication.
 *
 * Das ist dieselbe Firestore-Datenbank wie in der Firebase Console unter
 * „Firestore Database“ — du kannst Gäste dort auch manuell markieren und löschen,
 * wenn du kein Skript nutzen willst.
 *
 * Das Skript wird nur auf deinem Rechner ausgeführt, die Lösch-APIs wirken aber
 * remote im Projekt (wie die Console).
 *
 * Voraussetzung: Service-Account mit Rechten für Auth + Firestore, z. B.:
 *   set GOOGLE_APPLICATION_CREDENTIALS=C:\pfad\service-account.json
 *   npm run purge:guests
 *
 * Alternativ: gcloud auth application-default login (wenn das Default-Projekt stimmt)
 */

const admin = require('firebase-admin');

function init() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
}

function isAnonymousAuthUser(userRecord) {
  return userRecord.providerData.some((p) => p.providerId === 'anonymous');
}

async function purgeFirestoreGuests(db, auth) {
  const seen = new Set();
  const queries = [
    db.collection('users').where('isGuest', '==', true),
    db.collection('users').where('email', '==', 'guest@gast.com'),
  ];
  for (const q of queries) {
    const snap = await q.get();
    for (const doc of snap.docs) {
      const uid = doc.id;
      if (seen.has(uid)) continue;
      seen.add(uid);
      try {
        await auth.deleteUser(uid);
        console.log('Auth gelöscht:', uid);
      } catch (e) {
        if (e.code !== 'auth/user-not-found') {
          console.error('Auth', uid, e.message);
        }
      }
      try {
        await doc.ref.delete();
        console.log('Firestore gelöscht:', uid);
      } catch (e) {
        console.error('Firestore', uid, e.message);
      }
    }
  }
}

async function purgeOrphanAnonymousAuth(auth) {
  let nextPageToken;
  do {
    const list = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of list.users) {
      if (!isAnonymousAuthUser(userRecord)) continue;
      try {
        await auth.deleteUser(userRecord.uid);
        console.log('Anonymer Auth-User gelöscht:', userRecord.uid);
      } catch (e) {
        console.error('Auth anonym', userRecord.uid, e.message);
      }
    }
    nextPageToken = list.pageToken;
  } while (nextPageToken);
}

async function main() {
  init();
  const db = admin.firestore();
  const auth = admin.auth();
  console.log('Lösche Gast-Dokumente + zugehörige Auth-User …');
  await purgeFirestoreGuests(db, auth);
  console.log('Lösche verbleibende anonyme Auth-User (ohne passendes Dokument) …');
  await purgeOrphanAnonymousAuth(auth);
  console.log('Fertig.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
