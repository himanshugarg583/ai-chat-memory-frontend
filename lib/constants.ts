/**
 * Application constants
 */

export const MEMORY_CATEGORIES = ['general', 'personal', 'technical', 'preference'] as const;

export type MemoryCategory = typeof MEMORY_CATEGORIES[number];

export const CATEGORY_STYLES: Record<string, string> = {
  personal: 'bg-purple-100 text-purple-700 border-purple-200',
  technical: 'bg-blue-100 text-blue-700 border-blue-200',
  preference: 'bg-amber-100 text-amber-700 border-amber-200',
  general: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const ACTION_STYLES: Record<string, string> = {
  created: 'text-emerald-600 bg-emerald-50',
  updated: 'text-amber-600 bg-amber-50',
  removed: 'text-red-600 bg-red-50',
  unchanged: 'text-gray-500 bg-gray-50',
};

export const TEXTAREA_MAX_HEIGHT = 150;
export const MESSAGE_MAX_LENGTH = 4000;
