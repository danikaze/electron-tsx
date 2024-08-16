import { Configuration } from 'webpack';

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

export const preloadConfig = getWebpackConfig('preload', () => {
  const config: Configuration = {
    target: 'electron-renderer',
    entry: {
      index: getProjectPath('src', 'preload', 'index'),
    },
    output: {
      /*
       * For some reason, webpack generates cjs code (or it's unable to detect
       * it's esm when importing this file) with `.js` extension and this
       * results in an error at import time.
       * This is just a hack to hardcode the extension to `.cjs` but might need
       * to be removed in the future depending on the generated code...
       *
       * TODO: Decide the extension depending on the content (and edit the
       * `ENTRY_POINT_PRELOAD` based on it)
       */
      filename: '[id].cjs',
    },
  };

  return config;
});
