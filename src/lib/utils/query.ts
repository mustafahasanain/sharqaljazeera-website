import queryString from 'query-string';

/**
 * Type definitions for filter and sort parameters
 */
export interface FilterParams {
  brands?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
}

/**
 * Parse URL search params into a FilterParams object
 */
export function parseFilters(searchParams: string | URLSearchParams): FilterParams {
  const parsed = queryString.parse(
    typeof searchParams === 'string' ? searchParams : searchParams.toString(),
    { arrayFormat: 'comma' }
  );

  return {
    brands: Array.isArray(parsed.brands)
      ? parsed.brands
      : parsed.brands
      ? [parsed.brands]
      : undefined,
    categories: Array.isArray(parsed.categories)
      ? parsed.categories
      : parsed.categories
      ? [parsed.categories]
      : undefined,
    priceMin: parsed.priceMin ? Number(parsed.priceMin) : undefined,
    priceMax: parsed.priceMax ? Number(parsed.priceMax) : undefined,
    sort: parsed.sort?.toString(),
    page: parsed.page ? Number(parsed.page) : 1,
  };
}

/**
 * Convert FilterParams to URL query string
 */
export function stringifyFilters(filters: FilterParams): string {
  const cleanFilters: Record<string, string | string[] | number> = {};

  if (filters.brands && filters.brands.length > 0) {
    cleanFilters.brands = filters.brands;
  }
  if (filters.categories && filters.categories.length > 0) {
    cleanFilters.categories = filters.categories;
  }
  if (filters.priceMin !== undefined) {
    cleanFilters.priceMin = filters.priceMin;
  }
  if (filters.priceMax !== undefined) {
    cleanFilters.priceMax = filters.priceMax;
  }
  if (filters.sort) {
    cleanFilters.sort = filters.sort;
  }
  if (filters.page && filters.page > 1) {
    cleanFilters.page = filters.page;
  }

  return queryString.stringify(cleanFilters, { arrayFormat: 'comma' });
}

/**
 * Add or update a filter value in the URL
 */
export function addFilter(
  currentParams: string | URLSearchParams,
  key: keyof FilterParams,
  value: string | number
): string {
  const filters = parseFilters(currentParams);

  if (key === 'brands' || key === 'categories') {
    const currentArray = filters[key] || [];
    if (!currentArray.includes(value.toString())) {
      filters[key] = [...currentArray, value.toString()];
    }
  } else if (key === 'priceMin' || key === 'priceMax') {
    filters[key] = typeof value === 'number' ? value : Number(value);
  } else if (key === 'page') {
    filters[key] = typeof value === 'number' ? value : Number(value);
  } else if (key === 'sort') {
    filters[key] = value.toString();
  }

  // Reset to page 1 when filters change
  if (key !== 'page') {
    filters.page = 1;
  }

  return stringifyFilters(filters);
}

/**
 * Remove a filter value from the URL
 */
export function removeFilter(
  currentParams: string | URLSearchParams,
  key: keyof FilterParams,
  value?: string | number
): string {
  const filters = parseFilters(currentParams);

  if (key === 'brands' || key === 'categories') {
    if (value !== undefined) {
      const currentArray = filters[key] || [];
      filters[key] = currentArray.filter((v) => v !== value.toString());
      if (filters[key]?.length === 0) {
        delete filters[key];
      }
    } else {
      delete filters[key];
    }
  } else {
    delete filters[key];
  }

  // Reset to page 1 when filters change
  if (key !== 'page') {
    filters.page = 1;
  }

  return stringifyFilters(filters);
}

/**
 * Toggle a filter value (add if not present, remove if present)
 */
export function toggleFilter(
  currentParams: string | URLSearchParams,
  key: keyof FilterParams,
  value: string | number
): string {
  const filters = parseFilters(currentParams);

  if (key === 'brands' || key === 'categories') {
    const currentArray = filters[key] || [];
    if (currentArray.includes(value.toString())) {
      return removeFilter(currentParams, key, value);
    } else {
      return addFilter(currentParams, key, value);
    }
  }

  return stringifyFilters(filters);
}

/**
 * Update sort parameter
 */
export function updateSort(
  currentParams: string | URLSearchParams,
  sortValue: string
): string {
  const filters = parseFilters(currentParams);
  filters.sort = sortValue;
  filters.page = 1; // Reset to page 1 when sort changes
  return stringifyFilters(filters);
}

/**
 * Update page parameter
 */
export function updatePage(
  currentParams: string | URLSearchParams,
  page: number
): string {
  const filters = parseFilters(currentParams);
  filters.page = page;
  return stringifyFilters(filters);
}

/**
 * Clear all filters
 */
export function clearAllFilters(): string {
  return '';
}

/**
 * Check if a filter value is active
 */
export function isFilterActive(
  currentParams: string | URLSearchParams,
  key: keyof FilterParams,
  value: string | number
): boolean {
  const filters = parseFilters(currentParams);

  if (key === 'brands' || key === 'categories') {
    const currentArray = filters[key] || [];
    return currentArray.includes(value.toString());
  }

  return filters[key] === value;
}

/**
 * Get active filters for display
 */
export function getActiveFilters(
  currentParams: string | URLSearchParams
): Array<{ key: keyof FilterParams; value: string; label: string }> {
  const filters = parseFilters(currentParams);
  const active: Array<{ key: keyof FilterParams; value: string; label: string }> = [];

  if (filters.brands) {
    filters.brands.forEach((brand) => {
      active.push({ key: 'brands', value: brand, label: brand });
    });
  }

  if (filters.categories) {
    filters.categories.forEach((category) => {
      active.push({ key: 'categories', value: category, label: category });
    });
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const priceLabel =
      filters.priceMin && filters.priceMax
        ? `$${filters.priceMin} - $${filters.priceMax}`
        : filters.priceMin
        ? `Over $${filters.priceMin}`
        : `Under $${filters.priceMax}`;
    active.push({ key: 'priceMin', value: 'price', label: priceLabel });
  }

  return active;
}
