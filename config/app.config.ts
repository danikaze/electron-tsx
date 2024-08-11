import { AppConfig } from './package/types';

/**
 * Can be a constant `AppConfig` object, or a function returning it
 */
const appConfig: AppConfig = {
  platform: 'win32',
  arch: 'x64',
  packMapFiles: false,
  name: 'Electron TSX',
  executableName: 'etsx',
  overwrite: true,
  appBundleId: 'xyz',
}

export default appConfig;