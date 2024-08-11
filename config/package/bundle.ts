#!/usr/bin/env ts-node

import packager, { Options } from '@electron/packager';
import { dirname, relative } from 'path';

import packageJson from '../../package.json';
import { AppConfig } from '../types';
import { getAppConfig } from '../utils/get-app-config';
import { getAuthorName } from '../utils/get-author-name';
import { getProjectPath } from '../utils/get-project-path';
import { packageOutPath, webpackOutPath } from '../utils/paths';

run();

async function run(): Promise<void> {
  const appConfig = await getAppConfig();
  const options = await getPackagerOptions(appConfig);
  await bundleElectronApp(options);
}

async function getPackagerOptions(appConfig: AppConfig): Promise<Options> {
  const options: Options = {
    appBundleId: appConfig.appBundleId,
    appCopyright: appConfig.appCopyright ?? getDefaultAppCopyright(),
    appVersion: appConfig.appVersion ?? packageJson.version,
    arch: appConfig.arch ?? 'all',
    asar: appConfig.asar ?? true,
    buildVersion: appConfig.buildVersion ?? appConfig.appVersion ?? packageJson.version,
    dir: getProjectPath('.'),
    executableName: appConfig.executableName ?? packageJson.name,
    ignore: getIgnoreFn(appConfig),
    name: appConfig.name ?? packageJson.name,
    out: packageOutPath,
    overwrite: appConfig.overwrite,
    platform: appConfig.platform ?? getDefaultPlatforms(),
    win32metadata: {
      CompanyName: appConfig.win?.manufacturer ?? getAuthorName(),
      FileDescription: appConfig.win?.shortName ?? appConfig.name ?? packageJson.name,
      OriginalFilename: appConfig.executableName ?? packageJson.name,
      InternalName: appConfig.executableName ?? packageJson.name
    }
  };

  return options;
}

function getDefaultAppCopyright(): string {
  const year = new Date().getFullYear();
  const { author } = packageJson;
  return `Copyright (C) ${year} ${author}`;
}

function getIgnoreFn(config: AppConfig): (path: string) => boolean {
  const webpackBuildPath = '/' + relative(getProjectPath(), webpackOutPath).replace(/\\/g, '/');

  const isBuildParent = (path: string, wp = webpackBuildPath): boolean =>  {
    if (wp === '/') return false;
    if (wp === path) return true;
    return isBuildParent(path, dirname(wp));
  }

  return (path: string): boolean => {
    if (!path) return false;
    // package.json must be included always
    if (path === '/package.json') return false;
    // everything outside the webpack out folder gets ignored
    if (!path.startsWith(webpackBuildPath) && !isBuildParent(path)) return true;
    // ignore source maps depending on config.packMapFiles
    if (!config.packMapFiles && path.endsWith('.js.map')) return true;

    return false;
  };
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
