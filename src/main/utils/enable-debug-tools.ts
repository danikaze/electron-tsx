import { app } from 'electron';
import debug from 'electron-debug';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

/**
 * Installs the developer tools in Electron.
 *
 * - Developer Tools are enabled on development mode or when the environment
 * variable `DEBUG` is explicitly set to `"true"`
 * - Debug mode can be disabled on development mode if `DEBUG` is `"false"`
 * - Extensions can be forced to download by setting `UPGRADE_EXTENSIONS` to
 * `"true"`
 *
 * @returns Promise resolved when done
 */
export async function enableDebugTools(): Promise<void> {
  const enabled =
    process.env.DEBUG !== 'false' &&
    (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true');
  if (!enabled) return;

  debug({ isEnabled: true });
  await installExtensions();
}

async function installExtensions(): Promise<void> {
  await app.whenReady();

  const extensions = [REACT_DEVELOPER_TOOLS];
  const forceDownload = process.env.UPGRADE_EXTENSIONS === 'true';

  for (const extension of extensions) {
    try {
      const extName = await installExtension(extension, forceDownload);
      console.info(`Added extension: ${extName} (${extension.id})`);
    } catch (e) {
      console.warn('Errors happened while installing extensions:\n', e);
    }
  }
}
