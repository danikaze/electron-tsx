/* eslint-disable no-restricted-imports */
import { ipcRenderer } from 'electron';
import i18next, { TFunction } from 'i18next';
import i18nextElectronFsBackend from 'i18next-electron-fs-backend';
import { createElement, FC, ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import {
  I18N_WINDOW_NAMESPACE,
  i18nCommonConfig,
  I18nIpcCommands,
  I18nIpcEvents,
} from './config';
import { TypedIpcRenderer } from 'types/electron-typed-ipc';

type I18nWindowNs = {
  i18nextElectronBackend: {
    initialLng: string;
    onLanguageChange: (
      cb: (args: { lng: string }, t: TFunction) => void
    ) => void;
  };
};

export { I18nContext, useTranslation } from 'react-i18next';
export { PreloadI18nNs, WithI18nNs } from './components';
export const i18n = (() => {
  const i18ns = window[I18N_WINDOW_NAMESPACE] as I18nWindowNs;
  const isProd = process.env.NODE_ENV === 'production';
  const localesPath = isProd
    ? `${process.resourcesPath}/app.asar/src/locales`
    : 'src/locales';

  i18ns.i18nextElectronBackend.onLanguageChange((args) => {
    console.log('i18nextElectronBackend.onLanguageChange', args);
    i18next.changeLanguage(args.lng, (error) => {
      console.log('changeLanguage', args, error);
      if (error) {
        console.error(error);
      }
    });
  });

  i18next
    .use(i18nextElectronFsBackend)
    .use(initReactI18next)
    .init({
      ...i18nCommonConfig,
      backend: {
        loadPath: localesPath + '/{{lng}}/{{ns}}.json',
        addPath: localesPath + '/{{lng}}/{{ns}}.missing.json',
        contextBridgeApiKey: I18N_WINDOW_NAMESPACE,
      },
      lng: i18ns.i18nextElectronBackend.initialLng,
    });

  i18next.on('languageChanged', (lng) =>
    console.log('renderer.languageChanged', lng)
  );

  (ipcRenderer as TypedIpcRenderer<I18nIpcEvents, I18nIpcCommands>).on(
    'languageChange',
    (ev, lang: string) => {
      i18next.changeLanguage(lang);
    }
  );

  return i18next;
})();

export const I18nProvider: FC<{ children: ReactNode }> = ({ children }) =>
  createElement(I18nextProvider, { i18n: i18next, children });
