#!/usr/bin/env ts-node

import { MSICreator, MSICreatorOptions } from 'electron-wix-msi';
import { existsSync, readdirSync, statSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import { basename, join } from 'path';
import { rimrafSync } from 'rimraf';

import packageJson from '../../package.json';
import { AppConfig } from '../types';
import { getAppConfig } from '../utils/get-app-config';
import { getAuthorName } from '../utils/get-author-name';
import { installerOutPath, packageOutPath } from '../utils/paths';

type WindowsArch = Exclude<MSICreatorOptions['arch'], undefined>;
type MSICreatorCreateResult = ReturnType<MSICreator['create']> extends Promise<infer T> ? T : never;

run();

async function run(): Promise<void> {
  const appConfig = await getAppConfig();
  await createInstallers(appConfig);
}

/**
 * Create installers from the bundled folders for windows
 *
 * https://github.com/electron-userland/electron-wix-msi
 */
async function createInstallers(appConfig?: AppConfig) {
  console.log('Creating installers for:');
  const bundledFolders = readdirSync(packageOutPath)
    .map(folder => join(packageOutPath, folder))
    .filter(folder => statSync(folder).isDirectory())
    .filter(folder => {
      try { getArchFromFolder(folder); return true; }
      catch { return false }
    });
  bundledFolders.forEach((folder, i) => console.log([
    `  ${i+1}.`,
    `${basename(folder)} => `,
    getInstallerFolderName(folder)
  ].join('')));

  const stats = { ok: 0, skip: 0, error: 0 };
  for (let i = 0; i < bundledFolders.length; i++) {
    const folder = bundledFolders[i];
    const dirname = getInstallerFolderName(folder);
    const outDir = join(installerOutPath, dirname);

    if (existsSync(outDir)) {
      if (appConfig.overwrite) {
        rimrafSync(outDir);
      } else {
        console.log(`- ${dirname} already exists. Skipping (or set overwrite=true)`);
        stats.skip++;
        continue;
      }
    }

    console.log(`- Creating installer ${i+1}/${bundledFolders.length} (${dirname})...`);
    try {
      await createInstaller(
        appConfig,
        outDir,
        folder
      );
      console.log('  - Ok!');
      stats.ok++;
    } catch (e) {
      console.warn(e);
      stats.error++;
    }
  }
  console.log(`All Done! (Total: ${bundledFolders.length} / OK: ${stats.ok} / Skipped: ${stats.skip} / Errors: ${stats.error})`);
}

/**
 * Bundled folder architectures are different from the ones used by the
 * installer, so this functions just transform them
 */
function getInstallerFolderName(bundledFolderPath: string): string {
  const bundledDirName = basename(bundledFolderPath);
  const i = bundledDirName.lastIndexOf('-');
  const arch = getArchFromFolder(bundledDirName)
  return `${bundledDirName.substring(0, i)}-${arch}`;
}

/**
 * Create one installer from the given folder
 */
async function createInstaller(
  appConfig: AppConfig,
  outFolder: string,
  folder: string,
): Promise<void> {
  mkdirpSync(outFolder);

  const options = getMSICreatorOptions(appConfig, outFolder, folder);
  const msiCreator = new MSICreator(options);

  const supportBinaries = await msiCreator.create();
  await signBinaries(appConfig, supportBinaries);
  await msiCreator.compile();
}

/**
 * Creates the options to pass to the MSICreator instance from the app configuration
 */
function getMSICreatorOptions(
  config: AppConfig,
  outFolder: string,
  folder: string,
): MSICreatorOptions {
  const arch = getArchFromFolder(folder)
  return {
    arch,
    appDirectory: folder,
    outputDirectory: outFolder,
    exe: config.name ?? packageJson.name,
    description: config.description ?? packageJson.description,
    name: config.name ?? packageJson.name,
    manufacturer: config.win?.manufacturer ?? getAuthorName(),
    shortName: config.win?.shortName,
    shortcutFolderName: config.win?.shortcutFolderName,
    shortcutName: config.win?.shortcutName,
    version: config.appVersion ?? packageJson.version,
    ui: config?.win?.installerUi
  };
}

/**
 * Get the architecture to create installers for, from the folder generated by
 * the bundle process, which are to be named as
 * `${APP_NAME}-win32-${'x64' | 'ia32'}`
 *
 * Will throw an error if the folder name is not the expected one
 */
function getArchFromFolder(folder: string): WindowsArch {
  if (folder.endsWith('win32-ia32')) return 'x86';
  if (folder.endsWith('win32-x64')) return 'x64';

  throw new Error(`Architecture not supported for the folder ${basename(folder)}`);
}

/**
 * Get the name for the installer executable to generate
 */
function getInstallerExeName(config: AppConfig, arch: WindowsArch): string {
  const name = config.name ?? packageJson.name;
  return `${name}-${arch} setup`;
}

/**
 * Sign the binaries with the certificates provided in the configuration
 *
 * @TODO
 */
async function signBinaries(
  config: AppConfig,
  data: MSICreatorCreateResult
): Promise<void> {}