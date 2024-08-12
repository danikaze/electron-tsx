import { existsSync, readdirSync } from 'fs';
import { basename, dirname, extname, join } from 'path';

import { getAppConfig } from './get-app-config';
import { getProjectPath } from './get-project-path';
import { OfficialPlatform } from '@electron/packager';

type Platform = Exclude<OfficialPlatform, 'mas'>;

/**
 * Get the local icon path for the specified platform.
 * - windows will prefer `.ico` files
 * - macOS will prefer `.icns` files
 * - linux will prefer `.png` files
 */
export async function getIconPath(platform: OfficialPlatform): Promise<string | undefined> {
  const icons = await getAllIcons();
  return icons[platform === 'mas' ? 'darwin' : platform][0];
}

/**
 * Get a list of paths by platform, sorted by quality
 */
async function getAllIcons(): Promise<Record<Platform, string[]>> {
  const res: Record<Platform, string[]> = {
    win32: [],
    darwin: [],
    linux: [],
  }
  const { iconPath } = await getAppConfig();
  const projectBaseIconPath = getProjectPath(iconPath);
  const iconFolder = dirname(projectBaseIconPath);
  const iconBase = basename(projectBaseIconPath);

  if (!existsSync(iconFolder)) {
    console.warn(`The path specified for icons doesn't exist (${iconPath})`);
    return res;
  }

  readdirSync(iconFolder).forEach((filename => {
    const platform = getIconPlatform(iconBase, filename);
    if (!platform) return;
    res[platform].push(join(iconFolder, filename));
  }));

  Object.entries(res).forEach(([platform, icons]) => {
    if (icons.length === 0) {
      console.warn(`There are no icons provided for ${platform}`);
      return;
    }
    icons.sort(sortIconBySize);
  });

  return res;
}

/**
 * @param base base filename (without size suffix and extension) given in the config
 * @param filename full filename to check
 * @returns the platform where the icon fits, or `undefined` if is not a valid icon name
 */
function getIconPlatform(base: string, filename: string): Platform | undefined {
  if (!filename.startsWith(base)) return;
  const ext = extname(filename);
  const sizeSuffix = filename.substring(base.length, filename.length - ext.length);
  if (!/^-\d+$/.test(sizeSuffix)) return;
  if (ext === '.ico') return 'win32';
  if (ext === '.icns') return 'darwin';
  if (ext === '.png') return 'linux';
}

/**
 * @returns size of the image given by the filename (as `icon-${SIZE}.ext`)
 */
function getIconSize(filename: string): number {
  return parseInt(/.*-(\d+)\.[^.]+$/.exec(filename)[1]);
}

/**
 * Sorter function based on the size provided by the filenames
 *
 * @param a first filename to compare
 * @param b second filename to compare
 * @returns result to place the biggest sizes first
 */
function sortIconBySize(a: string, b: string): number {
  const sizeA = getIconSize(a);
  const sizeB = getIconSize(b);
  return sizeB - sizeA;
}