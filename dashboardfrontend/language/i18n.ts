import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../public/locales/en/translation.json';
import translationES from '../public/locales/es/translation.json';
import translationPT from '../public/locales/pt/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    es: { translation: translationES },
    pt: { translation: translationPT },
  },
  lng: 'pt', // Default language
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
