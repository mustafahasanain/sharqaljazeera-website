'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import {
  parseFilters,
  toggleFilter,
  isFilterActive,
  clearAllFilters,
  addFilter,
  removeFilter,
} from '@/lib/utils/query';
import {
  getAvailableBrands,
  getAvailableCategories,
  priceRanges,
} from '@/data/products';

interface FilterGroup {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  filterKey: 'brands' | 'categories';
}

interface PriceFilterGroup {
  id: string;
  label: string;
  options: { label: string; min: number; max: number }[];
}

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['brands', 'categories', 'price'])
  );

  // Filter groups configuration
  const filterGroups: FilterGroup[] = [
    {
      id: 'brands',
      label: 'Brand',
      filterKey: 'brands',
      options: getAvailableBrands().map((brand) => ({
        value: brand.name,
        label: brand.name,
      })),
    },
    {
      id: 'categories',
      label: 'Category',
      filterKey: 'categories',
      options: getAvailableCategories().map((category) => ({
        value: category.name,
        label: category.name,
      })),
    },
  ];

  const priceFilterGroup: PriceFilterGroup = {
    id: 'price',
    label: 'Price Range',
    options: priceRanges,
  };

  // Toggle filter group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Handle filter toggle
  const handleFilterToggle = (
    filterKey: 'brands' | 'categories',
    value: string
  ) => {
    const current = searchParams.toString();
    const newQuery = toggleFilter(current, filterKey, value);
    router.push(`?${newQuery}`, { scroll: false });
  };

  // Handle price range selection
  const handlePriceRangeToggle = (min: number, max: number) => {
    const current = searchParams.toString();
    const filters = parseFilters(current);

    // Check if this price range is already selected
    const isActive = filters.priceMin === min && filters.priceMax === max;

    let newQuery: string;
    if (isActive) {
      // Remove price filters
      const temp = removeFilter(current, 'priceMin');
      newQuery = removeFilter(temp, 'priceMax');
    } else {
      // Set new price range
      const temp = addFilter(current, 'priceMin', min);
      newQuery = addFilter(temp, 'priceMax', max);
    }

    router.push(`?${newQuery}`, { scroll: false });
  };

  // Check if price range is active
  const isPriceRangeActive = (min: number, max: number): boolean => {
    const filters = parseFilters(searchParams.toString());
    return filters.priceMin === min && filters.priceMax === max;
  };

  // Clear all filters
  const handleClearAll = () => {
    router.push(`?${clearAllFilters()}`, { scroll: false });
  };

  // Get active filter count
  const getActiveFilterCount = (): number => {
    const filters = parseFilters(searchParams.toString());
    let count = 0;
    if (filters.brands) count += filters.brands.length;
    if (filters.categories) count += filters.categories.length;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined)
      count += 1;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const filtersContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-light-300 p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-dark-700" />
          <h2 className="text-heading-3 text-dark-900">Filters</h2>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange text-footnote text-light-100">
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
          aria-label="Close filters"
        >
          <X className="h-5 w-5 text-dark-700" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="space-y-6">
          {/* Standard filter groups */}
          {filterGroups.map((group) => (
            <div key={group.id} className="border-b border-light-300 pb-4">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 rounded"
                aria-expanded={expandedGroups.has(group.id)}
              >
                <span className="text-body-medium text-dark-900">
                  {group.label}
                </span>
                {expandedGroups.has(group.id) ? (
                  <ChevronUp className="h-4 w-4 text-dark-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-dark-700" />
                )}
              </button>

              {expandedGroups.has(group.id) && (
                <div className="mt-3 space-y-2">
                  {group.options.map((option) => {
                    const isActive = isFilterActive(
                      searchParams.toString(),
                      group.filterKey,
                      option.value
                    );

                    return (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 group"
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() =>
                            handleFilterToggle(group.filterKey, option.value)
                          }
                          className="h-4 w-4 rounded border-light-400 text-orange focus:ring-2 focus:ring-orange focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-body text-dark-700 group-hover:text-dark-900">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Price range filter */}
          <div className="border-b border-light-300 pb-4">
            <button
              onClick={() => toggleGroup('price')}
              className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 rounded"
              aria-expanded={expandedGroups.has('price')}
            >
              <span className="text-body-medium text-dark-900">
                {priceFilterGroup.label}
              </span>
              {expandedGroups.has('price') ? (
                <ChevronUp className="h-4 w-4 text-dark-700" />
              ) : (
                <ChevronDown className="h-4 w-4 text-dark-700" />
              )}
            </button>

            {expandedGroups.has('price') && (
              <div className="mt-3 space-y-2">
                {priceFilterGroup.options.map((option) => {
                  const isActive = isPriceRangeActive(option.min, option.max);

                  return (
                    <label
                      key={option.label}
                      className="flex cursor-pointer items-center gap-2 group"
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() =>
                          handlePriceRangeToggle(option.min, option.max)
                        }
                        className="h-4 w-4 rounded border-light-400 text-orange focus:ring-2 focus:ring-orange focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-body text-dark-700 group-hover:text-dark-900">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear all button */}
      {activeCount > 0 && (
        <div className="border-t border-light-300 p-4 lg:p-6">
          <button
            onClick={handleClearAll}
            className="w-full rounded-lg bg-dark-900 px-4 py-2 text-body-medium text-light-100 hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Filter button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-light-300 bg-light-100 px-4 py-2 text-body-medium text-dark-900 hover:border-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-5 w-5 text-dark-700" />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange text-footnote text-light-100">
            {activeCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-dark-900/50 cursor-pointer"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Filter drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 sm:w-96 bg-light-100 shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Filters"
      >
        {filtersContent}
      </aside>
    </>
  );
}
