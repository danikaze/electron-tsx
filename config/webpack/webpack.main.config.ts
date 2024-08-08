import { Configuration } from 'webpack';

import { getWebpackConfig } from './webpack.base.config';

export const mainProcessConfig = getWebpackConfig('main', ({ getProjectPath }) => {
  const config: Configuration = {
    target: 'electron-main',
    entry: {
      index: getProjectPath('src/main/index.ts')
    },
  };

  return config;
});
