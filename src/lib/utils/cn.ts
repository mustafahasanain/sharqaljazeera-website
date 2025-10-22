import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS support
 *
 * Combines clsx for conditional class names and tailwind-merge to properly
 * handle Tailwind CSS class conflicts (e.g., "px-2 px-4" -> "px-4")
 *
 * @param inputs - Class names, objects, or arrays to merge
 * @returns Merged class name string
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 * cn(['base-class', { 'active-class': isActive }]) // Array and object syntax
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
