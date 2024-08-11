import { Configuration } from 'webpack';
import 'webpack-dev-server'; // needed for Configuration types

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

export const preloadConfig = getWebpackConfig('preload', () => {
  const config: Configuration = {
    target: 'electron-renderer',
    entry: {
      index: getProjectPath('src', 'preload', 'index.ts')
    },
  };

  return config;
});
