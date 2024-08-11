import { Configuration } from 'webpack';

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

export const mainProcessConfig = getWebpackConfig('main', () => {
  const config: Configuration = {
    target: 'electron-main',
    entry: {
      index: getProjectPath('src/main/index.ts')
    },
  };

  return config;
});
