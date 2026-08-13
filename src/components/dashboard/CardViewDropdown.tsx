import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type ViewMode = 'total' | 'daily' | 'weekly' | 'monthly';

interface CardViewDropdownProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const CardViewDropdown: React.FC<CardViewDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { label: 'All Time (Total)', value: 'total' },
    { label: 'Today (Daily)', value: 'daily' },
    { label: 'Last 7 days (Weekly)', value: 'weekly' },
    { label: 'Last 28 days (Monthly)', value: 'monthly' },
  ] as const;

  const getSubLabel = () => {
    switch (value) {
      case 'total': return 'Lifetime stats';
      case 'daily': return 'Today\'s stats';
      case 'weekly': return 'This week\'s stats';
      case 'monthly': return 'This month\'s stats';
      default: return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-6 px-3 py-1.5 rounded-lg bg-transparent hover:bg-gray-50 transition-all text-left min-w-[150px]"
      >
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">{getSubLabel()}</span>
          <span className="text-[13px] font-medium text-gray-800 mt-0.5">
            {options.find(o => o.value === value)?.label}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-[180px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-[60]">
          {options.map((opt, i) => (
            <button 
              type="button"
              key={i}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors ${
                value === opt.value ? 'bg-gray-50/80 text-gray-900 font-medium' : 'text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardViewDropdown;
