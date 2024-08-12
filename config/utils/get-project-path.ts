import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export function getProjectPath(...path: string[]): string {
  /*
   * __dirname is not defined in ES module scope, so there's this workaround
   */
  const filename = fileURLToPath(import.meta.url);

  return join(dirname(filename),'..','..', ...path);
}