import { AppConfig } from '../types.d';
import packageJson from '../../package.json';
import appConfigModule from '../../app.config';

type AppConfigModuleExport = AppConfig | (() => AppConfig) | (() => Promise<AppConfig>);

/**
 * Read the app.config.ts file and return the required AppConfig with defaults
 */
export async function getAppConfig(): Promise<AppConfig> {
  const appConfigExport = appConfigModule as AppConfigModuleExport;
  const userConfig = typeof appConfigExport === 'function' ? await appConfigExport() : appConfigExport;

  return {
    appBundleId: undefined,
    appCopyright: undefined,
    appVersion: packageJson.version,
    arch: 'all',
    buildVersion: userConfig.appVersion ?? packageJson.version,
    description: packageJson.description,
    executableName: packageJson.name,
    name: packageJson.name,
    overwrite: false,
    packMapFiles: process.env.NODE_ENV !== 'production',
    platform: getDefaultPlatforms(),
    asar: true,
    iconPath: 'config/icons/icon',
    ...userConfig
  };
}

/**
 * @returns Default platforms to bundle based on the current machine
 */
function getDefaultPlatforms(): Exclude<AppConfig['platform'], 'all'> {
  if (process.platform === 'win32') return 'win32';
  if (process.platform === 'darwin') return ['darwin', 'mas'];
  if (process.platform === 'linux') return 'linux';

  throw new Error([
    `Unknown platform "${process.platform}". `,
    'Please set it manually in config/app.config.ts'
  ].join(''));
}
