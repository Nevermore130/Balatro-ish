import { zh } from './locales/zh';
import { en } from './locales/en';

export type Language = 'zh' | 'en';

export const translations = {
  zh,
  en,
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.en;
};

// Helper function to get nested translation
export const t = (lang: Language, path: string, params?: Record<string, string | number>): string => {
  const keys = path.split('.');
  let value: any = translations[lang] || translations.en;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return path; // Return path if translation not found
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return path;
  }
  
  // Replace parameters
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }
  
  return value;
};

