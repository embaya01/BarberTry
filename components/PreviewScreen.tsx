
import React, { useState } from 'react';
import { HaircutStyle } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, Scissors, AlertTriangle, BookmarkPlus } from 'lucide-react';

interface PreviewScreenProps {
  originalImage: string;
  generatedImage: string | null;
  style: HaircutStyle;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onShowBarberCard: () => void;
  onTryAgain: () => void;
  onSaveToLibrary: () => void;
  isSavingToLibrary: boolean;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({
  originalImage,
  generatedImage,
  style,
  isLoading,
  error,
  onBack,
  onShowBarberCard,
  onTryAgain,
  onSaveToLibrary,
  isSavingToLibrary,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center text-brand-text-secondary hover:text-brand-text transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Styles
        </button>
      </div>
      
      <div className="text-center mb-4">
          <h2 className="text-3xl font-bold">{style.name}</h2>
          <p className="text-brand-text-secondary">Here's your virtual try-on.</p>
      </div>

      {!isLoading && !error && generatedImage && (
         <div className="flex self-center bg-brand-gray p-1 rounded-full text-sm mb-4">
              <button 
                  onClick={() => setShowOriginal(true)} 
                  className={`px-4 py-1.5 rounded-full transition ${showOriginal ? 'bg-brand-accent text-white' : 'text-gray-300'}`}>
                  Before
              </button>
              <button 
                  onClick={() => setShowOriginal(false)} 
                  className={`px-4 py-1.5 rounded-full transition ${!showOriginal ? 'bg-brand-accent text-white' : 'text-gray-300'}`}>
                  After
              </button>
          </div>
      )}

      <div className="aspect-square bg-brand-gray rounded-lg overflow-hidden relative mb-4 flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && (
          <div className="p-4 text-center text-red-300">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p className="font-semibold mb-2">Generation Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
            generatedImage ? (
                <img 
                    src={showOriginal ? originalImage : generatedImage} 
                    alt={showOriginal ? "Original" : style.name}
                    className="w-full h-full object-cover" 
                />
            ) : null
        )}
      </div>

      {error && !isLoading && (
        <button
          onClick={onTryAgain}
          className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Try Again
        </button>
      )}

      {!isLoading && !error && generatedImage && (
        <div className="mt-4 space-y-3">
          <button
            onClick={onShowBarberCard}
            className="w-full flex items-center justify-center bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
          >
            <Scissors className="w-5 h-5 mr-2" />
            Show this to your barber
          </button>
          <button
            onClick={onSaveToLibrary}
            disabled={isSavingToLibrary}
            className="w-full flex items-center justify-center bg-brand-light-gray text-brand-text font-bold py-3 px-6 rounded-lg hover:bg-brand-gray transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <BookmarkPlus className="w-5 h-5 mr-2" />
            {isSavingToLibrary ? 'Saving...' : 'Save to Library'}
          </button>
        </div>
      )}

    </div>
  );
};

export default PreviewScreen;
