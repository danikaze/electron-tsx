import { Configuration } from 'webpack';

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

const preloadConfig = getWebpackConfig('preload', ({ isProduction }) => {
  const config: Configuration = {
    watch: !isProduction,
    target: 'electron-renderer',
    entry: {
      index: getProjectPath('src', 'preload', 'index'),
    },
  };

  return config;
});

export default preloadConfig;
