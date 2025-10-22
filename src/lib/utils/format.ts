/**
 * Date formatting utilities
 */

/**
 * Format a date to a localized string
 * Always uses Western numerals (0-9) for date numbers.
 *
 * @param date - Date object, ISO string, or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string with Western numerals
 *
 * @example
 * formatDate(new Date(), { dateStyle: 'long' })
 * // Returns: "January 15, 2024"
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  // Always use en-US for date formatting to ensure Western numerals
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * Always uses Western numerals (0-9) for time numbers.
 *
 * @param date - Date object, ISO string, or timestamp
 * @returns Relative time string with Western numerals
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000))
 * // Returns: "1 day ago"
 */
export function formatRelativeTime(
  date: Date | string | number
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Always use en-US for relative time formatting to ensure Western numerals
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  const intervals: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of intervals) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1 || unit === 'second') {
      return rtf.format(-interval, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Number formatting utilities
 */

/**
 * Format a number as currency
 * Always uses Western numerals (0-9) regardless of locale.
 *
 * @param amount - Number to format
 * @param currency - ISO 4217 currency code (default: 'IQD')
 * @returns Formatted currency string with Western numerals
 *
 * @example
 * formatCurrency(1299.99, 'IQD')
 * // Returns: "IQD 1,299.99"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'IQD'
): string {
  // Always use en-US for number formatting to ensure Western numerals
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number with custom options
 * Always uses Western numerals (0-9).
 *
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string with Western numerals
 *
 * @example
 * formatNumber(1234567.89, { maximumFractionDigits: 0 })
 * // Returns: "1,234,568"
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  // Always use en-US for number formatting to ensure Western numerals
  return new Intl.NumberFormat('en-US', options).format(value);
}

/**
 * Format a number as a percentage
 * Always uses Western numerals (0-9).
 *
 * @param value - Number to format (0.5 = 50%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string with Western numerals
 *
 * @example
 * formatPercentage(0.1567, 2)
 * // Returns: "15.67%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 0
): string {
  // Always use en-US for number formatting to ensure Western numerals
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format bytes to human-readable size
 *
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted size string
 *
 * @example
 * formatBytes(1536)
 * // Returns: "1.50 KB"
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * String formatting utilities
 */

/**
 * Truncate a string to a maximum length
 *
 * @param text - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to append if truncated (default: '...')
 * @returns Truncated string
 *
 * @example
 * truncate('Hello World', 8)
 * // Returns: "Hello..."
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert a string to title case
 *
 * @param text - String to convert
 * @returns Title cased string
 *
 * @example
 * toTitleCase('hello world')
 * // Returns: "Hello World"
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a string to kebab-case
 *
 * @param text - String to convert
 * @returns Kebab-cased string
 *
 * @example
 * toKebabCase('Hello World')
 * // Returns: "hello-world"
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert a string to camelCase
 *
 * @param text - String to convert
 * @returns camelCased string
 *
 * @example
 * toCamelCase('hello-world')
 * // Returns: "helloWorld"
 */
export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
}

/**
 * Capitalize the first letter of a string
 *
 * @param text - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * capitalize('hello')
 * // Returns: "Hello"
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Slugify a string for use in URLs
 *
 * @param text - String to slugify
 * @returns Slugified string
 *
 * @example
 * slugify('Hello World!')
 * // Returns: "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
