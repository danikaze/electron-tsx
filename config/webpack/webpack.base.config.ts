import { merge } from 'webpack-merge';
import { join } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, DefinePlugin, CleanPlugin} from 'webpack';

import { version } from '../../package.json';
import { getDateString } from './utils/get-date-string';
import { jsonify } from './utils/jsonify';

export type WebpackTarget = 'main' | 'preload' | 'renderer';

export type GetWebpackConfigCallbackData = {
  isProduction: boolean;
  /**
   * Combines the use of `path.join` and provides the base root project folder
   * @param path path relative to the project root folder
   * @returns absolute path
   */
  getProjectPath: (...path: string[]) => string
}

function getProjectPath(...path: string[]): string {
  return join(__dirname,'..','..', ...path);
}

/**
 * @param type Type of build to create. Will provide base values to be extended by `configBuilder`
 * @param configBuilder Config or function returning the webpack config that will extend the provided base
 * @returns webpack configuration for the given `type` of build.
 */
export function getWebpackConfig(
  type: WebpackTarget,
  configBuilder: Omit<Configuration, 'path'>
  | ((data: GetWebpackConfigCallbackData) => Omit<Configuration, 'path'>)
) {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseConfig: Configuration = {
    mode: isProduction ? 'production' : 'development',
    watch: !isProduction,
    devtool: isProduction ? false : 'source-map',
    output: {
      path: getProjectPath('build', type)
    },
    stats: {
      assetsSort: 'name',
      modules: false,
      children: false,
    },
    optimization: isProduction
      ? {
          minimizer: isProduction
            ? [
                new TerserPlugin({
                  parallel: true,
                  extractComments: false,
                  terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    ecma: undefined,
                    parse: {},
                    compress: {},
                    mangle: isProduction,
                    module: false,
                  },
                }),
              ]
            : undefined,
        }
      : {},
    plugins: [
      new CleanPlugin(),
      new DefinePlugin(
        jsonify({
          'process.env.NODE_ENV':isProduction ? 'production' : 'development',
          'process.env.PACKAGE_VERSION': version,
          'process.env.BUILD_DATE': getDateString(),
          'ENTRY_POINT_PRELOAD': getProjectPath('build', 'preload', 'index.js'),
          'ENTRY_POINT_HTML': getProjectPath('build', 'renderer', 'index.html'),
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
        },
      ],
    },
    resolve: {
      modules: [getProjectPath('src'), 'node_modules'],
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
      plugins: [new TsconfigPathsPlugin()],
    },
  };

  const config = typeof configBuilder === 'function' ? configBuilder({
    isProduction,
    getProjectPath
  }) : configBuilder;

  return merge(baseConfig, config);
}
