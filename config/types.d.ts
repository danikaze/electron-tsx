import { OfficialArch, OfficialPlatform } from '@electron/packager';
import { UIOptions } from 'electron-wix-msi';

export type AppConfig = {
  appBundleId?: string;
  /**
   * App copyright information.
   *
   * **Default**: `"Copyright (C) ${YEAR} ${packageJson.author}"`
   *
   * Used in:
   * - win
   *   - bundle (binary details / `LegalCopyright`)
   *   - installer (`NSHumanReadableCopyright`)
   */
  appCopyright?: string;
  /**
   * App version
   *
   * **Default**: `packageJson.version`
   *
   * Used in:
   * - win
   *   - bundle (binary details / `ProductVersion` metadata property)
   * - mac
   *   - bundle (`CFBundleShortVersionString`)
   */
  appVersion?: string;
  /**
   * The target system architecture(s) to build for.
   *
   * Arch values for the official prebuilt Electron binaries:
   * - `ia32`
   * - `x64`
   * - `armv7l`
   * - `arm64` _(Linux: Electron 1.8.0 and above; Windows: 6.0.8 and above; macOS: 11.0.0-beta.1 and above)_
   * - `mips64el` _(Electron 1.8.2-beta.5 to 1.8.8)_
   *
   * **Default**: `"all"`
   *
   * - bundle
   */
  arch?: OfficialArch | OfficialArch[] | 'all';
  /**
   * Build version of the application
   *
   * **Default**: `packageJson.version`
   *
   * - win
   *   - bundle (`FileVersion`)
   * - mac
   *   - bundle (`CFBundleVersion`)
   */
  buildVersion?: string;
  /**
   * App description
   *
   * **Default**: `packageJson.description`
   *
   * - win
   *   - installer (Descriptions for shortcuts on Main Menu and Desktop)
   */
  description?: string;
  /**
   * Name for the bundled executable file
   *
   * **Default**: `packageJson.name`
   *
   * - win
   *   - bundle
   *   - installer
   */
  executableName?: string;
  /**
   * Name of the application
   *
   * **Default**: `packageJson.name` (transformed to remove not-allowed chars)
   *
   * - win
   *   - bundle
   *   - installer
   */
  name?: string;
  /**
   * If `true`, it will overwrite the output folder if it already exists
   * when generating the bundled binaries
   *
   * **Default**: `false`
   */
  overwrite?: boolean;
  /**
   * When packing files into the bundled binary, by default JS source map files
   * won't be included on production builds. Set this to `true` to include them
   * anyways.
   *
   * **Default**: `process.env.NODE_ENV !== "production"`
   *
   * - bundle
   */
  packMapFiles?: boolean;
  /**
   * The target platform(s) to build for.
   *
   * Platform values for the official prebuilt Electron binaries:
   * - `darwin` (macOS)
   * - `linux`
   * - `mas` (macOS, specifically for submitting to the Mac App Store)
   * - `win32`
   *
   * **Default**: Platform of the current machine (`["darwin", "mas"] for macOS)
   *
   * - bundle
   */
  platform?: OfficialPlatform | OfficialPlatform[] | 'all';
  /**
   * Whether to package the application's source code into an archive, using [Electron's
   * archive format](https://github.com/electron/asar). Reasons why you may want to enable
   * this feature include mitigating issues around long path names on Windows, slightly speeding
   * up `require`, and concealing your source code from cursory inspection.
   *
   * **Default**: `true`
   */
  asar?: boolean;
  /**
   * Path to the icon used for the executable
   *
   * **Default**: Provided icons in the `config/icon` folder.
   *
   * Check [the docs](./docs/icons.md) on how to use it across multiple platforms.
   */
  iconPath?: string;
  /**
   * Windows specific configuration values
   */
  win?: {
    /**
     * Name of the manufacturer in the installer and the CompanyName in the
     * binary file.
     *
     * **Default**: `packageJson.author` (just the name without the email)
     *
     * - bundle
     * - installer
     */
    manufacturer?: string;
    /**
     * A short name for the app, used wherever spaces and special characters
     * are not allowed
     *
     * **Default**: `name`
     *
     * - bundle (File Description)
     * - installer
     */
    shortName?: string;
    /**
     * Name of the shortcut folder in the Windows Start Menu
     *
     * **Default**: `manufacturer`
     *
     * - installer
     */
    shortcutFolderName?: string;
    /**
     * Name of the shortcut in the Windows Start Menu
     *
     * **Default**: `name`
     *
     * - installer
     */
    shortcutName?: string;
    /**
     * UI Configuration for the Installer
     *
     * https://github.com/electron-userland/electron-wix-msi?tab=readme-ov-file#ui-configuration-optional
     *
     * - installer
     */
    installerUi?: UIOptions | boolean;
  };
};
