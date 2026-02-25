
import React, { useMemo, useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (profile: UserProfile) => void;
  redirectMessage?: string;
}

const LOCAL_PROFILE_KEY = 'barbertry:lastProfile';

const saveProfileLocally = (profile: UserProfile) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('Unable to store profile locally', error);
  }
};

const deriveNameFromEmail = (email: string) => {
  if (!email.includes('@')) {
    return 'Guest Styler';
  }
  return email.split('@')[0];
};

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, redirectMessage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const ctaLabel = useMemo(() => (isLogin ? 'Log In' : 'Sign Up'), [isLogin]);
  const helperLabel = isLogin ? "Don't have an account?" : 'Already have an account?';
  const toggleLabel = isLogin ? 'Sign Up' : 'Log In';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }
    const profile: UserProfile = {
      id: `local-${normalizedEmail}`,
      displayName: isLogin ? deriveNameFromEmail(normalizedEmail) : fullName.trim() || deriveNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      avatarUrl: null,
    };
    saveProfileLocally(profile);
    onLoginSuccess(profile);
    setPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in pt-8">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-brand-text mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-brand-text-secondary mb-6">
          {redirectMessage
            ? redirectMessage
            : isLogin
              ? 'Log in to access personalized features.'
              : 'Sign up to save your favorite styles.'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full bg-brand-gray border border-brand-light-gray rounded-lg py-3 pl-12 pr-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-brand-gray border border-brand-light-gray rounded-lg py-3 pl-12 pr-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div className="relative">
             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-brand-gray border border-brand-light-gray rounded-lg py-3 pl-12 pr-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            {ctaLabel}
          </button>
        </form>

        <p className="text-brand-text-secondary mt-4 text-sm">
          {helperLabel}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-brand-accent hover:underline ml-1"
            type="button"
          >
            {toggleLabel}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
