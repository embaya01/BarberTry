
import React from 'react';

interface PlaceholderPageProps {
  icon: React.ElementType;
  title: string;
  message: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon: Icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-brand-text-secondary h-full animate-fade-in pt-12">
      <Icon className="w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-brand-text mb-2">{title}</h1>
      <p>{message}</p>
    </div>
  );
};

export default PlaceholderPage;
