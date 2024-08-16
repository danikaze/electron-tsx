import { getProjectPath } from './get-project-path';

export const webpackOutPath = getProjectPath('out', 'build');
export const packageOutPath = getProjectPath('out', 'package');
export const installerOutPath = getProjectPath('out', 'installer');
