import { Configuration } from 'webpack';

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

const mainProcessConfig = getWebpackConfig('main', ({ isProduction }) => {
  const config: Configuration = {
    watch: !isProduction,
    target: 'electron-main',
    entry: {
      index: getProjectPath('src/main/index'),
    },
  };

  return config;
});

export default mainProcessConfig;
