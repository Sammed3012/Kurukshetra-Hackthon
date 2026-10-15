import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK safely
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

export const db = app ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : ({} as any);
export const auth = app ? getAuth(app) : ({} as any);

// Validate Connection to Firestore safely
async function testConnection() {
  if (!db || typeof db.type === 'undefined') return;
  try {
    await getDocFromServer(doc(db, '_internal_', 'connection_test'));
    console.log("Firebase connection established successfully.");
  } catch (error) {
    // Ignore expected offline / missing doc errors
  }
}

testConnection().catch(() => {});

export default app;
