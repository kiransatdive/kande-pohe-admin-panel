import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DateRangeDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
}

const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({ value = '28', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
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
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 28 days', value: '28' },
    { label: 'Last 90 days', value: '90' },
    { label: 'Last 365 days', value: '365' },
    { label: 'Lifetime', value: 'lifetime' },
    { divider: true },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { divider: true },
    { label: 'July', value: 'july' },
    { label: 'June', value: 'june' },
    { label: 'May', value: 'may' },
    { divider: true },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-6 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:shadow-md transition-all text-left min-w-[200px]"
      >
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">July 11 - August 8, 2026</span>
          <span className="text-[13px] font-medium text-gray-800 mt-0.5">
            {options.find(o => o.value === value)?.label || 'Last 28 days'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-[200px] max-h-[250px] overflow-y-auto bg-white border border-gray-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 z-[60]">
          {showCustomForm ? (
            <div className="px-4 py-2">
              <button 
                type="button"
                className="text-[11px] font-bold text-gray-400 mb-3 flex items-center hover:text-gray-700 transition-colors"
                onClick={() => setShowCustomForm(false)}
              >
                 ← Presets
              </button>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-3">Custom Range</div>
              <div className="flex flex-col gap-2.5 mb-4">
                <div className="relative">
                  <input type="date" className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-[12px] text-gray-700 focus:outline-none focus:border-blue-400 placeholder:text-gray-400 cursor-pointer" />
                </div>
                <div className="relative">
                  <input type="date" className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-[12px] text-gray-700 focus:outline-none focus:border-blue-400 placeholder:text-gray-400 cursor-pointer" />
                </div>
              </div>
              <button type="button" className="w-full bg-[#00a3ff] hover:bg-[#0095e6] text-white text-[13px] font-semibold py-2 rounded-md transition-colors shadow-sm" onClick={() => setIsOpen(false)}>
                Apply Range
              </button>
            </div>
          ) : (
            options.map((opt, i) => {
              if (opt.divider) {
                return <div key={i} className="h-px bg-gray-100 my-0.5 w-full"></div>;
              }
              return (
                <button 
                  type="button"
                  key={i}
                  onClick={() => {
                    if (opt.value === 'custom') {
                      setShowCustomForm(true);
                    } else {
                      if (opt.value && onChange) onChange(opt.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors ${
                    value === opt.value && !showCustomForm ? 'bg-gray-50/80 text-gray-900 font-medium' : 'text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
