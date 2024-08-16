import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

export function getProjectPath(...path: string[]): string {
  /*
   * __dirname is not defined in ES module scope, so there's this workaround
   */
  const filename = fileURLToPath(import.meta.url);

  return resolve(join(dirname(filename), '..', '..', ...path));
}
