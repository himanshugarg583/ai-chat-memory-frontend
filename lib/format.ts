/**
 * Formatting utilities
 */

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(0);
}

export function formatSimilarity(value: number): string {
  return `${formatPercent(value)}% match`;
}
