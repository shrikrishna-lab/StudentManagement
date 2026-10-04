/**
 * Utility helper to join class names cleanly.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
