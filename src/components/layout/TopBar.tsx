import React, { useState } from 'react';
import { 
  Menu, Bell, MessageSquare,  
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 font-sans">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu */}
        <button 
          onClick={onToggleSidebar}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5 text-gray-500">
        {/* Notifications */}
        <button className="relative p-1 hover:text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            4
          </span>
        </button>

        {/* Messages */}
        <button className="p-1 hover:text-gray-700 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

       

        {/* Profile Popover (Right Side) */}
        <div className="relative">
          <button 
            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt="Charles Hall" 
                className="w-9 h-9 rounded-full border border-gray-200 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-[13px] text-green-600 font-medium tracking-wide hidden sm:inline-block">Online</span>
          </button>

          {isProfilePopupOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-4 px-4 z-50 text-left">
              <div className="flex flex-col">
                <span className="text-sm text-gray-900 font-medium">Charles Hall</span>
                <span className="text-xs text-gray-500 mt-0.5">Designer</span>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                  <a href="#" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">View Profile</a>
                  <a href="#" className="text-xs text-gray-600 hover:text-blue-600 transition-colors">Settings</a>
                  <a href="#" className="text-xs text-red-500 hover:text-red-600 transition-colors">Sign Out</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
