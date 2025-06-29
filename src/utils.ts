import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to conditionally combine class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
} 