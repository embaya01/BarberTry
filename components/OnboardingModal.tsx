
import React from 'react';
import { ShieldCheck, Camera, Star } from 'lucide-react';

interface OnboardingModalProps {
  onConsent: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onConsent }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-brand-gray rounded-2xl shadow-2xl max-w-sm w-full p-6 md:p-8 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold text-brand-text mb-2">Welcome to BarberTry</h1>
        <p className="text-brand-text-secondary mb-6">Find your next look before you even sit in the chair.</p>
        
        <div className="space-y-4 text-left my-6">
          <div className="flex items-start space-x-4">
            <Camera className="text-brand-accent w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-brand-text">Upload Your Selfie</h3>
              <p className="text-sm text-brand-text-secondary">Provide a clear photo for the most realistic virtual try-on.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Star className="text-brand-accent w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-brand-text">Explore Styles</h3>
              <p className="text-sm text-brand-text-secondary">Browse our curated gallery of modern and classic haircuts.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <ShieldCheck className="text-brand-accent w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-brand-text">Your Privacy Matters</h3>
              <p className="text-sm text-brand-text-secondary">Your photos are sent to Google's AI for processing and are not stored on our servers. You can save your results to your own device.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onConsent}
          className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
