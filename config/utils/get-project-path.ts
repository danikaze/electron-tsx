import { join } from 'path';

export function getProjectPath(...path: string[]): string {
  return join(__dirname,'..','..', ...path);
}