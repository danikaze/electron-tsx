#!/usr/bin/env ts-node

import packager, {
  OfficialArch,
  OfficialPlatform,
  Options,
} from '@electron/packager';
import { dirname, relative } from 'path';

import packageJson from '../../package.json';
import { AppConfig } from '../types';
import { getAppConfig } from '../utils/get-app-config';
import { getAuthorName } from '../utils/get-author-name';
import { getProjectPath } from '../utils/get-project-path';
import { getIconPath } from '../utils/icons';
import { packageOutPath, webpackOutPath } from '../utils/paths';

run();

async function run(): Promise<void> {
  const appConfig = await getAppConfig();
  const options = await getPackagerOptions(appConfig);
  await bundleElectronApps(options);
}

async function getPackagerOptions(appConfig: AppConfig): Promise<Options> {
  const options: Options = {
    appBundleId: appConfig.appBundleId,
    appCopyright: appConfig.appCopyright ?? getDefaultAppCopyright(),
    appVersion: appConfig.appVersion ?? packageJson.version,
    arch: appConfig.arch ?? 'all',
    asar: appConfig.asar ?? true,
    buildVersion:
      appConfig.buildVersion ?? appConfig.appVersion ?? packageJson.version,
    dir: getProjectPath('.'),
    executableName: appConfig.executableName ?? packageJson.name,
    ignore: getIgnoreFn(appConfig),
    name: appConfig.name ?? packageJson.name,
    out: packageOutPath,
    overwrite: appConfig.overwrite,
    platform: appConfig.platform ?? getDefaultPlatforms(),
    win32metadata: {
      /* eslint-disable @typescript-eslint/naming-convention */
      CompanyName: appConfig.win?.manufacturer ?? getAuthorName(),
      FileDescription:
        appConfig.win?.shortName ?? appConfig.name ?? packageJson.name,
      OriginalFilename: appConfig.executableName ?? packageJson.name,
      InternalName: appConfig.executableName ?? packageJson.name,
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    icon: appConfig.iconPath,
  };

  return options;
}

function getDefaultAppCopyright(): string {
  const year = new Date().getFullYear();
  const { author } = packageJson;
  return `Copyright (C) ${year} ${author}`;
}

function getIgnoreFn(config: AppConfig): (path: string) => boolean {
  const webpackBuildPath =
    '/' + relative(getProjectPath(), webpackOutPath).replace(/\\/g, '/');

  const isBuildParent = (path: string, wp = webpackBuildPath): boolean => {
    if (wp === '/') return false;
    if (wp === path) return true;
    return isBuildParent(path, dirname(wp));
  };

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

function getDefaultPlatforms(): OfficialPlatform[] {
  if (process.platform === 'win32') return ['win32'];
  if (process.platform === 'darwin') return ['darwin', 'mas'];
  if (process.platform === 'linux') return ['linux'];

  throw new Error(
    [
      `Unknown platform "${process.platform}". `,
      'Please set it manually in config/app.config.ts',
    ].join('')
  );
}

function getAllArchs(platform: OfficialPlatform): OfficialArch[] {
  const mapping: Record<OfficialPlatform, OfficialArch[]> = {
    win32: ['x64', 'ia32', 'arm64'],
    linux: ['x64', 'arm64', 'armv7l'],
    darwin: ['arm64', 'x64', 'universal'],
    mas: ['arm64', 'x64', 'universal'],
  };
  return mapping[platform];
}

/**
 * Wrapper to build all combinations of platforms x archs possible
 * Avoid relying on the `all` accepted by `@electron/packager` so the icon
 * can be properly chosen for each case
 *
 * It also allows bundling in parallel so it's faster (maybe?)
 */
async function bundleElectronApps(options: Options) {
  const apps = getPlatformArchCombination(options);
  console.log('Bundling apps...');

  const startTime = Date.now();
  const promises: Promise<void>[] = apps.map(async ([platform, arch], i) => {
    return bundleElectronApp({
      ...options,
      platform,
      arch,
      icon: await getIconPath(platform),
    });
  });

  await Promise.all(promises);
  const ellapsed = Date.now() - startTime;
  console.log(`All Done! (Ellapsed: ${ellapsed} ms)`);
}

/**
 * Get all the combinations of Platforms x Archs from the given options
 */
function getPlatformArchCombination(
  options: Options
): [platform: OfficialPlatform, arch: OfficialArch][] {
  const res: [platform: OfficialPlatform, arch: OfficialArch][] = [];

  const platforms = (
    options.platform === 'all'
      ? getDefaultPlatforms()
      : Array.isArray(options.platform)
        ? options.platform
        : [options.platform]
  ) as OfficialPlatform[];

  for (const platform of platforms) {
    const archs = (
      options.arch === 'all'
        ? getAllArchs(platform)
        : Array.isArray(options.arch)
          ? options.arch
          : [options.arch]
    ) as OfficialArch[];

    for (const arch of archs) {
      res.push([platform, arch]);
    }
  }

  return res;
}

async function bundleElectronApp(options: Options) {
  await packager(options);
}
