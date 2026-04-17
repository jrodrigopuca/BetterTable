/**
 * Virtualization constants
 *
 * VIRTUALIZATION_THRESHOLD: Minimum number of rows to auto-enable virtualization
 * when pagination is disabled. Below this threshold, all rows render normally.
 * Above it, only visible rows + buffer are rendered for performance.
 *
 * To change this value, update it here — it's the single source of truth.
 */
export const VIRTUALIZATION_THRESHOLD = 500;

/**
 * Default fixed row height in pixels for virtualized rendering.
 * Assumes uniform row height (variable height is not supported yet).
 */
export const DEFAULT_ROW_HEIGHT = 48;

/**
 * Number of extra rows rendered above and below the visible viewport
 * to prevent flicker during fast scrolling.
 */
export const DEFAULT_VIRTUAL_BUFFER = 5;
