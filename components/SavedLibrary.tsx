import React from 'react';
import { Bookmark, Calendar } from 'lucide-react';
import { SavedImage } from '../types';

interface SavedLibraryProps {
  savedImages: SavedImage[];
  onBackToGenerate: () => void;
  onSelectSavedImage: (savedImage: SavedImage) => void;
}

const EmptyLibrary: React.FC<{ onBackToGenerate: () => void }> = ({
  onBackToGenerate,
}) => (
  <div className="flex flex-col items-center text-center pt-16 animate-fade-in">
    <Bookmark className="w-14 h-14 text-brand-text-secondary mb-4" />
    <h2 className="text-2xl font-bold text-brand-text mb-2">No saved looks yet</h2>
    <p className="text-brand-text-secondary mb-6">
      Generate a style you like and tap &quot;Save to Library&quot; to collect it here.
    </p>
    <button
      onClick={onBackToGenerate}
      className="bg-brand-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
    >
      Create a look
    </button>
  </div>
);

const SavedLibrary: React.FC<SavedLibraryProps> = ({
  savedImages,
  onBackToGenerate,
  onSelectSavedImage,
}) => {
  if (!savedImages.length) {
    return <EmptyLibrary onBackToGenerate={onBackToGenerate} />;
  }

  return (
    <div className="pb-24 animate-fade-in">
      <div className="grid grid-cols-3 gap-3">
        {savedImages.map((savedImage) => (
          <button
            key={savedImage.id}
            onClick={() => onSelectSavedImage(savedImage)}
            className="relative group rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <img
              src={savedImage.generatedImageUrl}
              alt={savedImage.styleName}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs font-semibold">
              <span className="truncate">{savedImage.styleName}</span>
              <span className="inline-flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(savedImage.savedAt).getDate()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SavedLibrary;
