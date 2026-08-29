import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Chọn một tùy chọn...',
  error,
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}

      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl border text-xs flex items-center justify-between bg-slate-50 transition-all duration-200 outline-none cursor-pointer text-left ${
          size === 'sm' ? 'px-3 py-1.5' : 'px-3.5 py-2'
        } ${
          isOpen
            ? 'border-teal-600 bg-white ring-2 ring-teal-100 shadow-xs'
            : 'border-slate-200 hover:border-slate-300 hover:bg-white'
        } ${error ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
      >
        <span
          className={`truncate font-medium flex items-center gap-2 ${
            selectedOption ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-teal-600' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 min-w-full">
          <div className="p-1 max-h-56 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon}
                    {option.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-2" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};
