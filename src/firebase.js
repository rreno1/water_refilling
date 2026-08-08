/**
 * AQUAPURE Firebase Client Configuration Wrapper
 * Ritz Framework Compliant
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { 
  getFunctions, 
  connectFunctionsEmulator,
  httpsCallable 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js';

// Official Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvX858CqRMmXnkwi5Ts0Lyl8pZsvRxRzQ",
  authDomain: "water-refilling-ec7db.firebaseapp.com",
  projectId: "water-refilling-ec7db",
  storageBucket: "water-refilling-ec7db.firebasestorage.app",
  messagingSenderId: "1048847104085",
  appId: "1:1048847104085:web:a1a6474586d1d083ba3cdc",
  measurementId: "G-LDECG7H1V4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'asia-southeast1');

// Local Emulator Suite Support (Enabled if URL param ?emulator=true or explicit dev env)
const useEmulator = window.location.search.includes('emulator=true');
if (useEmulator) {
  console.log('[Firebase] Connecting to local Firebase emulators...');
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (e) {
    console.warn('[Firebase] Emulator connection notice:', e.message);
  }
}

export {
  app,
  auth,
  db,
  functions,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  serverTimestamp,
  httpsCallable
};
