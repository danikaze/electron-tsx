import { OfficialArch, OfficialPlatform } from '@electron/packager';

export type AppConfig = {
  platform?: OfficialPlatform | OfficialPlatform[] | 'all';
  arch?: OfficialArch | OfficialArch[] | 'all';
  packMapFiles?: boolean;
  name?: string;
  executableName?: string;
  overwrite?: boolean;
  appVersion?: string;
  buildVersion?: string;
  appBundleId?: string;
  appCopyright?: string;
  asar?: boolean;
}