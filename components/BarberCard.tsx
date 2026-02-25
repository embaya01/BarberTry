
import React, { useState } from 'react';
import { HaircutStyle } from '../types';
import { RefreshCw, Download, ArrowLeft, Loader } from 'lucide-react';
import { upscaleImage } from '../services/geminiService';

interface BarberCardProps {
  image: string;
  style: HaircutStyle;
  onStartOver: () => void;
  onBack: () => void;
}

const BarberCard: React.FC<BarberCardProps> = ({ image, style, onStartOver, onBack }) => {
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

  const handleDownload = async () => {
    setIsUpscaling(true);
    setUpscaleError(null);
    try {
      const upscaledImage = await upscaleImage(image);
      downloadImage(upscaledImage, `barbertry_upscaled_${style.id}.png`);
    } catch (error) {
      console.error("Upscaling failed:", error);
      setUpscaleError("Upscaling failed, downloading original.");
      // Fallback to downloading the original image after a short delay
      setTimeout(() => {
        downloadImage(image, `barbertry_final_${style.id}.png`);
      }, 1500);
    } finally {
      // Keep loading state for a bit even on error to show the message
      setTimeout(() => setIsUpscaling(false), 1500);
    }
  };


  return (
    <div className="flex flex-col p-4 animate-fade-in">
        <div className="relative w-full max-w-sm text-center mb-4">
          <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-brand-text-secondary hover:text-brand-text transition" aria-label="Go back to preview">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-brand-text">Show this to your barber</h1>
            <p className="text-brand-text-secondary">Here's the look you're going for.</p>
          </div>
        </div>

        <div id="barber-card" className="bg-brand-gray w-full max-w-sm rounded-2xl p-6 shadow-2xl mb-4 self-center">
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
                <img src={image} alt={style.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-brand-text-secondary text-sm">Style:</p>
                <h2 className="text-brand-text text-3xl font-bold">{style.name}</h2>
            </div>
        </div>

        <div className="w-full max-w-sm grid grid-cols-2 gap-4 self-center">
            <button
                onClick={handleDownload}
                disabled={isUpscaling}
                className="flex items-center justify-center bg-brand-light-gray text-brand-text font-bold py-3 px-6 rounded-lg hover:bg-brand-gray transition-colors disabled:bg-brand-gray disabled:cursor-not-allowed"
            >
                {isUpscaling ? (
                    <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        {upscaleError ? upscaleError : 'Upscaling...'}
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 mr-2" />
                        Save
                    </>
                )}
            </button>
            <button
                onClick={onStartOver}
                className="flex items-center justify-center bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
            >
                <RefreshCw className="w-5 h-5 mr-2" />
                Start Over
            </button>
        </div>
    </div>
  );
};

export default BarberCard;
