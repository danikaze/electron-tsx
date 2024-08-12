import { AppConfig } from './config/types';

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