import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import 'webpack-dev-server'; // needed for Configuration types

import { getCssLocalIdent } from '../utils/get-css-local-ident';
import { getProjectPath } from '../utils/get-project-path';
import { getWebpackConfig } from './get-webpack-config';

const DEV_SERVER_PORT = parseInt(process.env.PORT || '9000');

export const rendererConfig = getWebpackConfig(
  'renderer',
  ({ isProduction }) => {
    const config: Configuration = {
      target: 'electron-renderer',
      entry: {
        index: getProjectPath('src', 'renderer', 'index'),
      },
      output: {
        publicPath: isProduction ? './' : undefined,
        scriptType: 'text/javascript',
      },
      devServer: !isProduction && {
        host: '0.0.0.0',
        compress: true,
        port: DEV_SERVER_PORT,
      },
      plugins: [
        new DefinePlugin({
          'process.type': JSON.stringify('renderer'),
        }),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: getProjectPath('src', 'renderer', 'index.html'),
          minify: isProduction && {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
          },
          scriptLoading: 'module',
        }),
        isProduction && new MiniCssExtractPlugin({ filename: 'style.css' }),
      ],
      module: {
        rules: [
          // CSS Modules
          {
            test: /\.module\.((c|sa|sc)ss)$/i,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    getLocalIdent: getCssLocalIdent(),
                  },
                  esModule: false,
                  sourceMap: true,
                  importLoaders: 1,
                },
              },
              'sass-loader',
            ],
          },
          // Non-Modules CSS
          {
            test: /\.((c|sa|sc)ss)$/i,
            exclude: /\.module\.((c|sa|sc)ss)$/i,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
              'sass-loader',
            ],
          },
          // Fonts
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
          // Images
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
        ],
      },
    };

    return config;
  }
);
