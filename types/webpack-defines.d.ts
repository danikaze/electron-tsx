/**
 * Path to the preload built file
 *
 * ```
 * const mainWindow = new BrowserWindow({
 *   webPreferences: {
 *     preload: ENTRY_POINT_PRELOAD,
 *   }
 * });
 * ```
 */
declare const ENTRY_POINT_PRELOAD: string;

/**
 * Path to the built html (from `/src/renderer/index.html`)
 *
 * ```
 * mainWindow.loadFile(ENTRY_POINT_HTML);
 * ```
 */
declare const ENTRY_POINT_HTML: string;

/**
 * Path to the largest png icon provided
 *
 * ```
 * const mainWindow = new BrowserWindow({
 *   icon: APP_ICON_PNG_PATH,
 * });
 * ```
 */
declare const APP_ICON_PNG_PATH: string;
