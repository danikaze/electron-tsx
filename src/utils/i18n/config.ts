/* eslint-disable no-restricted-imports */
import { InitOptions } from 'i18next';
import { AVAILABLE_LANGUAGES } from './constants';

export type I18nIpcEvents = {
  languageChange: (lang: string) => void;
};

export type I18nIpcCommands = {
  changeLanguage: (lang: string) => void;
};

export const I18N_WINDOW_NAMESPACE = '__i18n';
export const I18N_IPC_CHANNEL = '__i18nextElectronBackend';
export const i18nCommonConfig: InitOptions = {
  interpolation: {
    escapeValue: false,
  },
  debug: false,
  saveMissing: true,
  saveMissingTo: 'current',
  supportedLngs: AVAILABLE_LANGUAGES,
  fallbackLng: false,
  react: {},
  ns: [],
};
