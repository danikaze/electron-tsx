#!/usr/bin/env ts-node
import packager, { Options } from '@electron/packager';

import packageJson from '../../package.json';
import appConfigModule from '../app.config';
import { getProjectPath } from '../utils/get-project-path';
import { AppConfig } from './types';

type AppConfigModuleExport = AppConfig | (() => AppConfig) | (() => Promise<AppConfig>);

run();

async function run(): Promise<void> {
  const options = await readOptions();
  await bundleElectronApp(options);
}

async function readOptions(): Promise<Options> {
  const appConfig = await getAppConfig();

  const options: Options = {
    appBundleId: appConfig.appBundleId,
    appCopyright: appConfig.appCopyright,
    appVersion: appConfig.appVersion ?? packageJson.version,
    arch: appConfig.arch ?? 'all',
    asar: appConfig.asar ?? true,
    buildVersion: appConfig.buildVersion ?? appConfig.appVersion ?? packageJson.version,
    dir: getProjectPath('.'),
    executableName: appConfig.executableName ?? packageJson.name,
    ignore: ignorePath.bind(undefined, appConfig),
    name: appConfig.name ?? packageJson.name,
    out: getProjectPath('out'),
    overwrite: appConfig.overwrite,
    platform: appConfig.platform ?? getDefaultPlatforms(),
  };

  return options;
}

function ignorePath(config: AppConfig, path: string): boolean {
  // root can't be ignored
  if (!path) return false;
  // package.json must be included always
  if (path === '/package.json') return false;
  // everything outside /build gets ignored
  if (!path.startsWith('/build')) return true;
  // ignore source maps depending on config.packMapFiles
  if (!config.packMapFiles && path.endsWith('.js.map')) return true;

  return false;
}

async function getAppConfig(): Promise<AppConfig> {
  const appConfig = appConfigModule as AppConfigModuleExport;
  if (typeof appConfig === 'function') {
    return await appConfig();
  }
  return appConfig;
}

function getDefaultPlatforms(): Exclude<AppConfig['platform'], 'all'> {
  if (process.platform === 'win32') return 'win32';
  if (process.platform === 'darwin') return ['darwin', 'mas'];
  if (process.platform === 'linux') return 'linux';

  throw new Error([
    `Unknown platform "${process.platform}". `,
    'Please set it manually in config/app.config.ts'
  ].join(''));
}

async function bundleElectronApp(options?: Options) {
  console.log('Bundling...');
  await packager(options);
  console.log('Done!');
}