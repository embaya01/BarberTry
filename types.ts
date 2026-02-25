
export enum AppState {
  ONBOARDING,
  UPLOAD,
  GALLERY,
  PREVIEW,
  BARBER_CARD,
}

export interface HaircutStyle {
  id: string;
  name: string;
  thumbnailUrl: string;
  prompt: string;
}

export type NavTab = 'home' | 'library' | 'generate' | 'notifications' | 'profile';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface SavedImage {
  id: string;
  userId: string;
  styleName: string;
  generatedImageUrl: string;
  promptSummary?: string;
  savedAt: string;
}

export type AuthRedirectIntent = 'save-image' | 'view-library' | null;
