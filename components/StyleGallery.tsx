
import React, { useState, useRef, useEffect } from 'react';
import { HaircutStyle } from '../types';
import { Search, ChevronDown, Wand2, ArrowLeft } from 'lucide-react';

interface StyleGalleryProps {
  userImage: string;
  styles: HaircutStyle[];
  onGenerate: (style: HaircutStyle, modifications: string) => void;
  onChangePhoto: () => void;
}

const StyleGallery: React.FC<StyleGalleryProps> = ({ userImage, styles, onGenerate, onChangePhoto }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<HaircutStyle | null>(null);
  const [modifications, setModifications] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredStyles = styles.filter(style =>
    style.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStyleSelect = (style: HaircutStyle) => {
    setSelectedStyle(style);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleGenerateClick = () => {
    if (selectedStyle) {
      onGenerate(selectedStyle, modifications);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in">
       <div className="relative text-center mb-4">
          <button onClick={onChangePhoto} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-brand-text-secondary hover:text-brand-text transition" aria-label="Change photo">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-brand-text">Create Your Look</h1>
            <p className="text-brand-text-secondary mt-2">Pick a base style, then add your own touch.</p>
          </div>
      </div>
      
      <div className="mb-4 flex flex-col items-center">
        <div
          className="relative w-32 h-32 md:w-40 md:h-40 group"
        >
          <img src={userImage} alt="Your selfie" className="rounded-full w-full h-full object-cover border-4 border-brand-accent shadow-lg" />
           <div className="absolute bottom-0 right-0 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full">
            YOUR PHOTO
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Style Dropdown */}
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">1. Choose a base style</label>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-brand-gray border border-brand-light-gray rounded-lg py-3 px-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
            >
                <span>{selectedStyle ? selectedStyle.name : 'Select a style...'}</span>
                <ChevronDown className={`w-5 h-5 text-brand-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-brand-gray border border-brand-light-gray rounded-lg shadow-2xl animate-fade-in-up max-h-80 flex flex-col">
                    <div className="p-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-light-gray rounded-md py-2 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-1 focus:ring-brand-accent"
                            />
                        </div>
                    </div>
                    <ul className="flex-1 overflow-y-auto p-2">
                        {filteredStyles.length > 0 ? (
                        filteredStyles.map(style => (
                            <li
                            key={style.id}
                            onClick={() => handleStyleSelect(style)}
                            className="p-3 text-brand-text rounded-md cursor-pointer hover:bg-brand-light-gray"
                            role="option"
                            aria-selected={selectedStyle?.id === style.id}
                            >
                            {style.name}
                            </li>
                        ))
                        ) : (
                        <p className="p-3 text-center text-brand-text-secondary">No styles found.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>

        {/* Modifications Textarea */}
        <div>
            <label htmlFor="modifications" className="block text-sm font-medium text-brand-text-secondary mb-2">2. Add your custom changes (optional)</label>
            <textarea
                id="modifications"
                value={modifications}
                onChange={(e) => setModifications(e.target.value)}
                placeholder="e.g., 'add a hard part on the left', 'make it blonde', 'less volume on top'"
                className="w-full h-20 bg-brand-gray border border-brand-light-gray rounded-lg p-4 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
            />
        </div>

        {/* Generate Button */}
        <button
            onClick={handleGenerateClick}
            disabled={!selectedStyle}
            className="w-full flex items-center justify-center bg-brand-accent text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-brand-light-gray disabled:cursor-not-allowed disabled:scale-100"
        >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate Haircut
        </button>
      </div>
    </div>
  );
};

export default StyleGallery;
