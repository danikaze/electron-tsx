import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server'; // needed for Configuration types

import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

const DEV_SERVER_PORT = parseInt(process.env.PORT || '9000');

export const rendererConfig = getWebpackConfig('renderer', ({ isProduction }) => {
  const config: Configuration = {
    target: 'electron-renderer',
    entry: {
      index: getProjectPath('src', 'renderer', 'index.ts')
    },
    devServer: isProduction ? undefined : {
      host: '0.0.0.0',
      compress: true,
      port: DEV_SERVER_PORT
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: getProjectPath('src', 'renderer', 'index.html'),
        minify: isProduction && {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
        }
      })
    ]
  };

  return config;
});
