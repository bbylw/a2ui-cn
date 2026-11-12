/** Compact one-line rendering of an action context for the log panels. */
export function formatContext(context: Record<string, unknown>): string {
  return Object.entries(context)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ');
}
