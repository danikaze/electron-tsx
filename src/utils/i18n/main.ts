/* eslint-disable no-restricted-imports */
import { ipcMain } from 'electron';
import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import { join } from 'path';

import { TypedIpcMain } from 'types/electron-typed-ipc';

import { store } from '@/main/storage';

import { i18nCommonConfig, I18nIpcCommands, I18nIpcEvents } from './config';
import { DEFAULT_LANGUAGE } from './constants';

export {
  clearMainBindings as i18nClearMainBindings,
  mainBindings as i18nMainBindings,
} from 'i18next-electron-fs-backend';

export const i18nMain = i18next;

export function initI18nMain(): Promise<typeof i18nMain> {
  return new Promise<typeof i18nMain>((resolve) => {
    const localesPath = join('src', 'locales');

    i18nMain.use(backend).init({
      ...i18nCommonConfig,
      backend: {
        loadPath: join(localesPath, '{{lng}}', '{{ns}}.json'),
        addPath: join(localesPath, '{{lng}}', '{{ns}}.missing.json'),
      },
      lng: store.get('lang', DEFAULT_LANGUAGE),
    });

    i18nMain.on('languageChanged', async (lang) => {
      // update the settings with the selected language
      // so it can be loaded from the start the next time
      console.log('main.languageChanged', lang);
      store.set('lang', lang);
    });

    i18nMain.on('initialized', async () => {
      resolve(i18nMain);
    });

    (ipcMain as TypedIpcMain<I18nIpcEvents, I18nIpcCommands>).handle(
      'changeLanguage',
      (ev, lang) => {
        i18nMain.changeLanguage(lang);
      }
    );
  });
}
