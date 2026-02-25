import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const firebaseConfig: Partial<FirebaseConfig> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys: Array<keyof FirebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

export const isFirebaseConfigured = missingKeys.length === 0;

let cachedApp: FirebaseApp | null = null;

const ensureFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured) {
    throw new Error(
      `Firebase is not fully configured. Missing: ${missingKeys.join(', ')}`,
    );
  }

  if (cachedApp) {
    return cachedApp;
  }

  if (!getApps().length) {
    cachedApp = initializeApp(firebaseConfig as FirebaseConfig);
  } else {
    cachedApp = getApp();
  }

  return cachedApp;
};

export const getFirebaseAuth = (): Auth => {
  return getAuth(ensureFirebaseApp());
};

export const getFirestoreDb = (): Firestore => {
  return getFirestore(ensureFirebaseApp());
};

export const getFirebaseConfigStatus = () => ({
  isReady: isFirebaseConfigured,
  missingKeys,
});
