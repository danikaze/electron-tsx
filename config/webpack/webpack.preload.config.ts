import { Configuration } from 'webpack';
import 'webpack-dev-server'; // needed for Configuration types

import { getWebpackConfig } from './webpack.base.config';

export const preloadConfig = getWebpackConfig('preload', ({ getProjectPath }) => {
  const config: Configuration = {
    target: 'electron-renderer',
    entry: {
      index: getProjectPath('src', 'preload', 'index.ts')
    },
  };

  return config;
});
