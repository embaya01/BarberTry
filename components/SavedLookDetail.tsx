import React, { useState } from 'react';
import { ArrowLeft, Calendar, Download, Loader } from 'lucide-react';
import { SavedImage } from '../types';
import { upscaleImage } from '../services/geminiService';

interface SavedLookDetailProps {
  savedImage: SavedImage;
  onBack: () => void;
}

const formatFullTimestamp = (timestamp: string) => {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return 'Saved date unavailable';
  }
  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const SavedLookDetail: React.FC<SavedLookDetailProps> = ({ savedImage, onBack }) => {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaleError, setUpscaleError] = useState<string | null>(null);

  const downloadImage = (href: string, filename: string) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadOriginal = () => {
    downloadImage(savedImage.generatedImageUrl, `barbertry_saved_${savedImage.id}.png`);
  };

  const handleDownloadUpscaled = async () => {
    if (isUpscaling) {
      return;
    }
    setIsUpscaling(true);
    setUpscaleError(null);
    try {
      const upscaledImage = await upscaleImage(savedImage.generatedImageUrl);
      downloadImage(upscaledImage, `barbertry_saved_${savedImage.id}_upscaled.png`);
    } catch (error) {
      console.error('Upscaling saved look failed:', error);
      setUpscaleError('Upscaling failed, downloading original...');
      setTimeout(() => {
        handleDownloadOriginal();
      }, 600);
    } finally {
      setTimeout(() => {
        setIsUpscaling(false);
        setUpscaleError(null);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-brand-text-secondary hover:text-brand-text transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Library
        </button>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-brand-text">{savedImage.styleName}</h2>
        <p className="text-brand-text-secondary text-sm mt-1">
          Saved look preview from your library
        </p>
      </div>

      <div className="aspect-square bg-brand-gray rounded-2xl overflow-hidden mb-4">
        <img
          src={savedImage.generatedImageUrl}
          alt={savedImage.styleName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-brand-gray rounded-2xl p-4 space-y-2 mb-4">
        <div className="flex items-center text-brand-text-secondary text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Saved {formatFullTimestamp(savedImage.savedAt)}
        </div>
        {savedImage.promptSummary && (
          <p className="text-brand-text text-sm leading-relaxed">
            {savedImage.promptSummary}
          </p>
        )}
      </div>

      <div className="mt-auto space-y-3">
        <button
          onClick={handleDownloadOriginal}
          className="w-full flex items-center justify-center bg-brand-light-gray text-brand-text font-semibold py-3 rounded-xl hover:bg-brand-gray transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Original
        </button>
        <button
          onClick={handleDownloadUpscaled}
          disabled={isUpscaling}
          className="w-full flex items-center justify-center bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUpscaling ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              {upscaleError ?? 'Upscaling...'}
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Upscaled
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SavedLookDetail;
