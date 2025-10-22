import { z } from 'zod';

/**
 * Common validation schemas using Zod
 *
 * These schemas can be used for form validation, API request validation,
 * and runtime type checking throughout the application.
 */

/**
 * Email validation schema
 *
 * @example
 * emailSchema.parse('user@example.com') // Valid
 * emailSchema.parse('invalid-email') // Throws ZodError
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

/**
 * Password validation schema
 * Requires: minimum 8 characters, at least one uppercase, one lowercase, one number
 *
 * @example
 * passwordSchema.parse('SecurePass123') // Valid
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Strong password validation schema
 * Requires: minimum 12 characters, uppercase, lowercase, number, and special character
 */
export const strongPasswordSchema = passwordSchema
  .min(12, 'Password must be at least 12 characters')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

/**
 * Phone number validation schema (international format)
 *
 * @example
 * phoneSchema.parse('+1234567890') // Valid
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * URL validation schema
 *
 * @example
 * urlSchema.parse('https://example.com') // Valid
 */
export const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .url('Invalid URL format');

/**
 * Username validation schema
 * Allows: alphanumeric, underscores, hyphens (3-20 characters)
 *
 * @example
 * usernameSchema.parse('user_name-123') // Valid
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

/**
 * Postal/ZIP code validation schema (flexible)
 *
 * @example
 * postalCodeSchema.parse('12345') // Valid
 * postalCodeSchema.parse('SW1A 1AA') // Valid
 */
export const postalCodeSchema = z
  .string()
  .min(1, 'Postal code is required')
  .regex(/^[A-Z0-9\s-]{3,10}$/i, 'Invalid postal code format');

/**
 * Credit card number validation schema (basic format check)
 * Note: This only validates format, not actual card validity
 *
 * @example
 * creditCardSchema.parse('4111111111111111') // Valid format
 */
export const creditCardSchema = z
  .string()
  .min(1, 'Credit card number is required')
  .regex(/^\d{13,19}$/, 'Invalid credit card number format');

/**
 * CVV validation schema
 *
 * @example
 * cvvSchema.parse('123') // Valid
 */
export const cvvSchema = z
  .string()
  .min(1, 'CVV is required')
  .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits');

/**
 * Date string validation schema (ISO 8601 format)
 *
 * @example
 * dateStringSchema.parse('2024-01-15') // Valid
 */
export const dateStringSchema = z
  .string()
  .min(1, 'Date is required')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

/**
 * Validation helper functions
 */

/**
 * Validate if a string is a valid email
 *
 * @param email - Email string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // Returns: true
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validate if a string is a valid password
 *
 * @param password - Password string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidPassword('SecurePass123') // Returns: true
 */
export function isValidPassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

/**
 * Validate if a string is a valid URL
 *
 * @param url - URL string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidUrl('https://example.com') // Returns: true
 */
export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}

/**
 * Validate if a string is a valid phone number
 *
 * @param phone - Phone number string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidPhone('+1234567890') // Returns: true
 */
export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

/**
 * Validate if a string is a valid username
 *
 * @param username - Username string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidUsername('user_name') // Returns: true
 */
export function isValidUsername(username: string): boolean {
  return usernameSchema.safeParse(username).success;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 *
 * @param value - Value to check
 * @returns True if empty, false otherwise
 *
 * @example
 * isEmpty('') // Returns: true
 * isEmpty([]) // Returns: true
 * isEmpty({}) // Returns: true
 * isEmpty('hello') // Returns: false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if a value is a valid number (not NaN or Infinity)
 *
 * @param value - Value to check
 * @returns True if valid number, false otherwise
 *
 * @example
 * isValidNumber(42) // Returns: true
 * isValidNumber(NaN) // Returns: false
 * isValidNumber(Infinity) // Returns: false
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if a value is within a numeric range (inclusive)
 *
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range, false otherwise
 *
 * @example
 * isInRange(5, 1, 10) // Returns: true
 * isInRange(15, 1, 10) // Returns: false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return isValidNumber(value) && value >= min && value <= max;
}

/**
 * Sanitize a string by removing potentially harmful characters
 *
 * @param input - String to sanitize
 * @returns Sanitized string
 *
 * @example
 * sanitizeString('<script>alert("xss")</script>')
 * // Returns: 'scriptalert("xss")/script'
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

/**
 * Validate file extension
 *
 * @param filename - Filename to check
 * @param allowedExtensions - Array of allowed extensions (without dots)
 * @returns True if extension is allowed, false otherwise
 *
 * @example
 * isValidFileExtension('image.jpg', ['jpg', 'png', 'gif'])
 * // Returns: true
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Validate file size
 *
 * @param sizeInBytes - File size in bytes
 * @param maxSizeInMB - Maximum allowed size in megabytes
 * @returns True if size is within limit, false otherwise
 *
 * @example
 * isValidFileSize(1048576, 5) // 1MB file, 5MB limit
 * // Returns: true
 */
export function isValidFileSize(sizeInBytes: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return isValidNumber(sizeInBytes) && sizeInBytes <= maxSizeInBytes;
}

/**
 * Common regex patterns for validation
 */
export const REGEX_PATTERNS = {
  /** Alphanumeric only */
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  /** Alphabetic only */
  ALPHA: /^[a-zA-Z]+$/,
  /** Numeric only */
  NUMERIC: /^[0-9]+$/,
  /** Hexadecimal color code */
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  /** IPv4 address */
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  /** Slug (URL-friendly string) */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * Validate against a custom regex pattern
 *
 * @param value - String to validate
 * @param pattern - Regular expression pattern
 * @returns True if matches pattern, false otherwise
 *
 * @example
 * matchesPattern('abc123', REGEX_PATTERNS.ALPHANUMERIC)
 * // Returns: true
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}
