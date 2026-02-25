import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { SavedImage } from '../types';
import { getFirestoreDb, isFirebaseConfigured } from './firebase';

export interface SaveGeneratedImageInput {
  styleName: string;
  generatedImageUrl: string;
  promptSummary?: string;
}

const FALLBACK_STORAGE_KEY = 'barbertry:savedImages';

const hasBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readFallbackStore = (): Record<string, SavedImage[]> => {
  if (!hasBrowserStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(FALLBACK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, SavedImage[]>) : {};
  } catch (error) {
    console.warn('Failed to read saved images from localStorage', error);
    return {};
  }
};

const writeFallbackStore = (store: Record<string, SavedImage[]>) => {
  if (!hasBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn('Failed to persist saved images locally', error);
  }
};

const generateLocalId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local_${Math.random().toString(36).slice(2, 11)}`;
};

export const saveGeneratedImageRecord = async (
  userId: string,
  payload: SaveGeneratedImageInput,
): Promise<SavedImage> => {
  if (!userId) {
    throw new Error('A valid userId is required to save an image.');
  }

  const savedAt = new Date().toISOString();

  if (isFirebaseConfigured) {
    const db = getFirestoreDb();
    const docRef = await addDoc(collection(db, 'savedImages'), {
      ...payload,
      userId,
      savedAt,
    });

    return {
      id: docRef.id,
      userId,
      ...payload,
      savedAt,
    };
  }

  const fallbackStore = readFallbackStore();
  const nextRecord: SavedImage = {
    id: generateLocalId(),
    userId,
    ...payload,
    savedAt,
  };

  fallbackStore[userId] = [
    nextRecord,
    ...(fallbackStore[userId] ? fallbackStore[userId] : []),
  ];
  writeFallbackStore(fallbackStore);

  return nextRecord;
};

export const fetchSavedImages = async (userId: string): Promise<SavedImage[]> => {
  if (!userId) {
    return [];
  }

  if (isFirebaseConfigured) {
    const db = getFirestoreDb();
    const savedImagesQuery = query(
      collection(db, 'savedImages'),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc'),
    );
    const snapshot = await getDocs(savedImagesQuery);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<SavedImage, 'id'>;
      return {
        id: doc.id,
        ...data,
      };
    });
  }

  const fallbackStore = readFallbackStore();
  return fallbackStore[userId] ?? [];
};
