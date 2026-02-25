
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageBase64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should not exceed 5MB.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="text-4xl font-bold text-brand-text mb-2">Upload Your Photo</h1>
        <p className="text-brand-text-secondary mb-6 max-w-md">For best results, use a well-lit, front-facing photo where your hair is clearly visible.</p>

        {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6 flex items-center">
                <span>{error}</span>
            </div>
        )}

        <div className="w-full max-w-xs space-y-4">
            <input
                type="file"
                accept="image/*"
                capture="user"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-center bg-brand-accent text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
                Take a Selfie
            </button>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center bg-brand-light-gray text-brand-text font-bold py-4 px-6 rounded-lg hover:bg-brand-gray transition-transform transform hover:scale-105"
            >
                Upload from Gallery
            </button>
        </div>

        <div className="mt-8 p-6 bg-brand-gray rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-brand-text mb-3">Photo Tips:</h3>
            <ul className="text-sm text-brand-text-secondary space-y-2 text-left list-disc list-inside">
                <li>Face the camera directly.</li>
                <li>Avoid harsh shadows or backlighting.</li>
                <li>Keep a neutral expression.</li>
                <li>Ensure your hair isn't covered by a hat or hood.</li>
            </ul>
        </div>
    </div>
  );
};

export default ImageUploader;
