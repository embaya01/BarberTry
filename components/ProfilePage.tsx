import React from 'react';
import { LogOut, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  savedImageCount: number;
  onLogout: () => void;
  onGoToLibrary: () => void;
  isFirestoreReady: boolean;
}

const formatDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'Date pending';
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  savedImageCount,
  onLogout,
  onGoToLibrary,
  isFirestoreReady,
}) => {
  return (
    <div className="animate-fade-in text-brand-text">
      <section className="flex flex-col items-center text-center pt-10 pb-6">
        <div className="w-24 h-24 rounded-full bg-brand-accent/20 flex items-center justify-center text-3xl font-semibold uppercase mb-4 border border-brand-accent/40">
          {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
        </div>
        <h1 className="text-3xl font-bold">{user.displayName || 'New Member'}</h1>
        <p className="text-brand-text-secondary mt-1">{user.email}</p>
        <p className="text-xs text-brand-text-secondary mt-2">
          Joined {formatDate(user.createdAt)}
        </p>
      </section>

      <section className="bg-brand-gray rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-brand-text-secondary uppercase tracking-wide">
              Saved Looks
            </p>
            <p className="text-3xl font-bold">{savedImageCount}</p>
          </div>
          <button
            onClick={onGoToLibrary}
            className="flex items-center bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            View Library
          </button>
        </div>
        <p className="text-sm text-brand-text-secondary">
          Your saved AI looks sync automatically once Firestore is connected.
        </p>
      </section>

      <section className="bg-brand-gray rounded-2xl p-5 mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary uppercase tracking-wide">
              Firestore Sync
            </p>
            <p className="text-lg font-semibold">
              {isFirestoreReady ? 'Ready' : 'Waiting for config'}
            </p>
          </div>
          {!isFirestoreReady && (
            <ShieldAlert className="w-8 h-8 text-yellow-400" aria-hidden="true" />
          )}
        </div>
        {!isFirestoreReady && (
          <p className="text-sm text-brand-text-secondary">
            We will store your saved looks securely once Firebase credentials are added
            to the environment.
          </p>
        )}
      </section>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center bg-brand-light-gray text-brand-text font-semibold py-3 rounded-xl hover:bg-brand-gray transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
