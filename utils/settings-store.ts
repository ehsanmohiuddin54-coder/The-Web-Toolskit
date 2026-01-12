
import { AppSettings } from '../types';

const SETTINGS_KEY = 'seo_utility_settings';

const DEFAULT_SETTINGS: AppSettings = {
  enabledTools: [
    '/word-counter',
    '/case-converter',
    '/text-cleaner',
    '/keyword-density',
    '/meta-generator',
    '/json-formatter',
    '/char-remover',
    '/gpa-calculator'
  ]
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const updateSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const toggleTool = (path: string) => {
  const settings = getSettings();
  if (settings.enabledTools.includes(path)) {
    settings.enabledTools = settings.enabledTools.filter(p => p !== path);
  } else {
    settings.enabledTools.push(path);
  }
  updateSettings(settings);
};
