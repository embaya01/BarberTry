
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Trimming the pixels...",
  "Fading the edges...",
  "Applying digital pomade...",
  "Sharpening the line-up...",
  "Consulting with the AI barber...",
  "Just a moment...",
];

const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-brand-text font-semibold animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
