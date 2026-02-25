
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in pt-12">
      <div className="relative mb-6">
        <Sparkles className="absolute -top-4 -left-8 w-12 h-12 text-brand-accent/50 animate-pulse" />
        <Sparkles className="absolute -bottom-4 -right-8 w-12 h-12 text-brand-accent/50 animate-pulse delay-500" />
        <h1 className="text-5xl md:text-6xl font-bold text-brand-text leading-tight">
          Discover Your
          <br />
          Next Hairstyle
        </h1>
      </div>
      <p className="text-brand-text-secondary max-w-sm mb-10">
        Stop wondering what you'd look like. Use AI to virtually try on haircuts with your own photo before you commit.
      </p>

      <button
        onClick={onStart}
        className="group flex items-center justify-center bg-brand-accent text-white font-bold py-4 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-accent/30"
      >
        Start Makeover
        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="mt-16 p-6 bg-brand-gray rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-brand-text mb-3">How it works:</h3>
            <ol className="text-sm text-brand-text-secondary space-y-3 text-left list-decimal list-inside">
                <li><span className="font-semibold text-brand-text">Take a selfie</span> or upload a photo.</li>
                <li><span className="font-semibold text-brand-text">Choose a style</span> from our gallery.</li>
                <li><span className="font-semibold text-brand-text">See your new look</span> in seconds!</li>
            </ol>
        </div>
    </div>
  );
};

export default HomePage;
