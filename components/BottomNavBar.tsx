
import React from 'react';
import { Home, LayoutGrid, ScanLine, Bell, User } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NavItem: React.FC<{
  tab: NavTab;
  activeTab: NavTab;
  onClick: (tab: NavTab) => void;
  icon: React.ElementType;
  label: string;
}> = ({ tab, activeTab, onClick, icon: Icon, label }) => {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => onClick(tab)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-brand-accent' : 'text-brand-text-secondary hover:text-brand-text'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-brand-gray border-t border-brand-light-gray max-w-lg mx-auto rounded-t-2xl">
      <div className="flex justify-around items-center h-full">
        <NavItem
          tab="home"
          activeTab={activeTab}
          onClick={onTabChange}
          icon={Home}
          label="Home"
        />
        <NavItem
          tab="library"
          activeTab={activeTab}
          onClick={onTabChange}
          icon={LayoutGrid}
          label="Library"
        />
        
        <div className="w-1/5 flex justify-center">
            <button
            onClick={() => onTabChange('generate')}
            className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white -mt-8 shadow-lg shadow-brand-accent/30 transform transition-transform hover:scale-110"
            aria-label="Generate new haircut"
            >
            <ScanLine className="w-8 h-8" />
            </button>
        </div>

        <NavItem
          tab="notifications"
          activeTab={activeTab}
          onClick={onTabChange}
          icon={Bell}
          label="Notifications"
        />
        <NavItem
          tab="profile"
          activeTab={activeTab}
          onClick={onTabChange}
          icon={User}
          label="Profile"
        />
      </div>
    </nav>
  );
};

export default BottomNavBar;
