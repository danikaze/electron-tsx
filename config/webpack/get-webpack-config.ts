import { join } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { CleanPlugin, Configuration, DefinePlugin } from 'webpack';
import { merge } from 'webpack-merge';

import { version } from '../../package.json';
import { getDateString } from '../utils/get-date-string';
import { getIconPath } from '../utils/icons';
import { jsonify } from '../utils/jsonify';
import { webpackOutPath } from '../utils/paths';

export type WebpackTarget = 'main' | 'preload' | 'renderer';

export type GetWebpackConfigCallbackData = {
  isProduction: boolean;
  baseOutPath: string;
  devServerPort: number;
}

/**
 * @param type Type of build to create. Will provide base values to be extended by `configBuilder`
 * @param configBuilder Config or function returning the webpack config that will extend the provided base
 * @returns webpack configuration for the given `type` of build.
 */
export async function getWebpackConfig(
  type: WebpackTarget,
  configBuilder: Omit<Configuration, 'path'>
  | ((data: GetWebpackConfigCallbackData) => Omit<Configuration, 'path'>)
) {
  const baseOutPath = join(webpackOutPath, type);
  const isProduction = process.env.NODE_ENV === 'production';
  const devServerPort = parseInt(process.env.PORT || '9000');

  console.log('(wp)ENTRY_POINT_HTML:', isProduction
    ? join(webpackOutPath, 'renderer', 'index.html')
    : `http://localhost:${devServerPort}`)

  const baseConfig: Configuration = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    output: {
      path: baseOutPath,
      module: type !== 'preload',
      chunkFormat: type !== 'preload' ? 'module': undefined,
    },
    experiments: {
      outputModule: type !== 'preload',
    },
    stats: {
      assetsSort: 'name',
      modules: false,
      children: false,
    },
    optimization: isProduction
      ? {
          minimizer: [
            new TerserPlugin({
              parallel: true,
              extractComments: false,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                ecma: undefined,
                parse: {},
                compress: {},
                mangle: true,
                module: false,
              },
            }),
          ],
        }
      : {},
    plugins: [
      new CleanPlugin(),
      new DefinePlugin(
        jsonify({
          'process.env.NODE_ENV': isProduction ? 'production' : 'development',
          'process.env.PACKAGE_VERSION': version,
          'process.env.BUILD_DATE': getDateString(),
          ENTRY_POINT_PRELOAD: join(webpackOutPath, 'preload', 'index.js'),
          ENTRY_POINT_HTML: isProduction
            ? join(webpackOutPath, 'renderer', 'index.html')
            : `http://localhost:${devServerPort}`,
          APP_ICON_PNG_PATH: await getIconPath('linux'),
        }),
      ),
    ],
    module: {
      rules: [
        // code
        {
          test: /\.(ts|tsx)$/i,
          loader: 'ts-loader',
          exclude: ['/node_modules/'],
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    resolve: {
      modules: [join(baseOutPath, 'src'), 'node_modules'],
      extensions: [
        '.tsx', '.ts', '.mts', '.cts',
        '.jsx', '.js', '.mjs', '.cjs',
        '...'
      ],
      plugins: [new TsconfigPathsPlugin()],
    },
  };

  const config = typeof configBuilder === 'function' ? configBuilder({
    isProduction,
    baseOutPath,
    devServerPort,
  }) : configBuilder;

  return merge(baseConfig, config);
}
