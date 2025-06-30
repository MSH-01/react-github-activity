import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to conditionally combine class names
 * Based on shadcn/ui's cn utility
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate the date N months ago from today
 */
export function getDateMonthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

/**
 * Get the start and end of a year
 */
export function getYearBounds(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31),
  };
}

/**
 * Check if a value is a valid GitHub username
 */
export function isValidGitHubUsername(username: string): boolean {
  // GitHub username rules: 1-39 characters, alphanumeric and hyphens, cannot start/end with hyphen
  const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return githubUsernameRegex.test(username);
}

/**
 * Check if a value looks like a GitHub token
 */
export function isValidGitHubToken(token: string): boolean {
  // GitHub tokens typically start with 'ghp_', 'gho_', 'ghu_', 'ghs_', or 'ghr_'
  const githubTokenRegex = /^gh[pousr]_[A-Za-z0-9_]{36,}$/;
  return githubTokenRegex.test(token);
} 