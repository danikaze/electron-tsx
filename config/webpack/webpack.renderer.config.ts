import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server'; // needed for Configuration types

import { getWebpackConfig } from './webpack.base.config';

const DEV_SERVER_PORT = parseInt(process.env.PORT || '9000');

export const rendererConfig = getWebpackConfig('renderer', ({ isProduction, getProjectPath }) => {
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
