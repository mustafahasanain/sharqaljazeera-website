'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { parseFilters, updateSort } from '@/lib/utils/query';
import { useState, useRef, useEffect } from 'react';

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current sort value
  const filters = parseFilters(searchParams.toString());
  const currentSort = filters.sort || 'featured';
  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || 'Featured';

  // Handle sort change
  const handleSortChange = (value: string) => {
    const current = searchParams.toString();
    const newQuery = updateSort(current, value);
    router.push(`?${newQuery}`, { scroll: false });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="sort-dropdown" className="sr-only">
        Sort products
      </label>
      <button
        id="sort-dropdown"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-light-300 bg-light-100 px-4 py-2 text-body text-dark-900 hover:border-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-body-medium">Sort By:</span>
        <span className="text-body">{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-dark-700 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full z-10 mt-2 w-56 rounded-lg bg-light-100 shadow-lg ring-1 ring-light-300"
          role="listbox"
          aria-label="Sort options"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full px-4 py-3 text-left text-body hover:bg-light-200 focus:outline-none focus-visible:bg-light-200 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                currentSort === option.value
                  ? 'bg-light-200 text-dark-900 font-medium'
                  : 'text-dark-700'
              }`}
              role="option"
              aria-selected={currentSort === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
