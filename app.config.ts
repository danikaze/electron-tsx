import type { AppConfig } from './config/types.d.ts';

/**
 * Can be a constant `AppConfig` object, or a function returning it
 */
const appConfig: AppConfig = {
  packMapFiles: false,
  name: 'Electron TSX',
  executableName: 'etsx',
  overwrite: true,
  appBundleId: 'xyz',
}

export default appConfig;