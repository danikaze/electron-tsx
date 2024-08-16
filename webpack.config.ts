import { mainProcessConfig } from './config/webpack/webpack.main.config';
import { preloadConfig } from './config/webpack/webpack.preload.config';
import { rendererConfig } from './config/webpack/webpack.renderer.config';

export default [mainProcessConfig, preloadConfig, rendererConfig];
