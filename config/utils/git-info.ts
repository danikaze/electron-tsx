import { execSync } from 'child_process';

export function gitInfo(onError = '') {
  return {
    rev: execute('git rev-parse HEAD', onError),
    shortRev: execute('git rev-parse --short HEAD', onError),
    branch: execute('git rev-parse --abbrev-ref HEAD', onError),
  };
}

function execute(command: string, onError: string): string {
  try {
    return execSync(command).toString().trim();
  } catch {
    return onError;
  }
}
